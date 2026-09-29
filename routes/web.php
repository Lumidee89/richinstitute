<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PlatformController as Platform;
use App\Http\Middleware\EnsureAdministrator;
use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

Route::get('/admin/login', fn () => Inertia::render('Login', ['mode' => 'login']))->name('login');
Route::post('/admin/login', function (Request $r) {
    $data = $r->validate(['email' => 'required|email', 'password' => 'required']);
    if (! Auth::attempt($data)) {
        return back()->withErrors(['email' => 'The supplied credentials are incorrect.']);
    }$r->session()->regenerate();

    return redirect('/admin/dashboard');
})->middleware('throttle:5,1');
Route::get('/forgot-password', fn () => Inertia::render('Login', ['mode' => 'forgot']))->name('password.request');
Route::post('/forgot-password', function (Request $r) {
    $r->validate(['email' => 'required|email']);
    Password::sendResetLink($r->only('email'));

    return back()->with('success', 'If that email has an account, a reset link will be sent.');
})->middleware('throttle:3,1');
Route::get('/reset-password/{token}', fn (Request $r, string $token) => Inertia::render('Login', ['mode' => 'reset', 'token' => $token, 'email' => $r->email]))->name('password.reset');
Route::post('/reset-password', function (Request $r) {
    $r->validate(['token' => 'required', 'email' => 'required|email', 'password' => 'required|confirmed|min:12']);
    $status = Password::reset($r->only('email', 'password', 'password_confirmation', 'token'), function ($user, $password) {
        $user->forceFill(['password' => Hash::make($password)])->setRememberToken(Str::random(60));
        $user->save();
    });

    return $status === Password::PASSWORD_RESET ? redirect('/admin/login')->with('success', __($status)) : back()->withErrors(['email' => __($status)]);
})->middleware('throttle:5,1');
Route::middleware(['auth', EnsureAdministrator::class])->prefix('admin')->group(function () {
    Route::post('/logout', function (Request $r) {
        Auth::logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();

        return redirect('/admin/login');
    });
    Route::post('/users', [AdminUserController::class, 'save']);
    Route::put('/users/{user}', [AdminUserController::class, 'save']);
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
    Route::post('/content', [Platform::class, 'save']);
    Route::put('/content/{content}', [Platform::class, 'save']);
    Route::delete('/content/{content}', [Platform::class, 'destroy']);
    Route::put('/inbox/{submission}', [Platform::class, 'updateSubmission']);
    Route::put('/settings', [Platform::class, 'settings']);
    Route::post('/upload', [Platform::class, 'upload']);
    Route::get('/subscribers/export', [Platform::class, 'exportSubscribers']);
    Route::get('/{section?}', [Platform::class, 'admin']);
});
Route::post('/enquiries', [Platform::class, 'submit'])->middleware('throttle:6,1');
Route::get('/newsletter/preferences/{subscriber}', [NewsletterController::class, 'preferences'])->middleware('signed')->name('newsletter.preferences');
Route::post('/newsletter/preferences/{subscriber}', [NewsletterController::class, 'unsubscribe'])->middleware(['signed', 'throttle:10,1']);
Route::post('/subscribe', [Platform::class, 'subscribe'])->middleware('throttle:5,1');
Route::get('/sitemap.xml', function () {
    $paths = ['', 'about', 'vision-mission', 'books', 'programmes', 'consultations', 'speaking', 'events', 'articles', 'media', 'contact', 'faq'];
    foreach (Content::visible()->where('noindex', false)->whereIn('type', ['books', 'programmes', 'events', 'articles', 'media', 'testimonials', 'partners', 'social-impact', 'pages'])->get() as $item) {
        $paths[] = ltrim($item->publicPath(), '/');
    }$xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    $excluded = Content::visible()->where('type', 'pages')->where('noindex', true)->pluck('slug')->map(fn ($slug) => $slug === 'home' ? '' : $slug)->all();
    foreach (array_diff($paths, $excluded) as $path) {
        $xml .= '<url><loc>'.htmlspecialchars(url('/'.$path), ENT_XML1).'</loc></url>';
    }

    return response($xml.'</urlset>', 200, ['Content-Type' => 'application/xml']);
});
Route::get('/robots.txt', fn () => response("User-agent: *\nDisallow: /admin\nDisallow: /newsletter/preferences\nSitemap: ".url('/sitemap.xml')."\n", 200, ['Content-Type' => 'text/plain']));
Route::get('/', [Platform::class, 'site']);
Route::get('/{page}/{slug?}', [Platform::class, 'site'])->where('page', 'about|vision-mission|books|programmes|consultations|speaking|events|media|articles|social-impact|testimonials|partnerships|community|contact|faq|privacy-policy|terms|cookie-policy|disclaimer|refund-policy|search');

Route::get('/{page}', [Platform::class, 'customPage']);
