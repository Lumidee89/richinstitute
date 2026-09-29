<?php

use App\Models\Content;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schedule;

Artisan::command('admin:create {email} {--name=Administrator}', function () {
    $password = $this->secret('Password (at least 12 characters)');
    if (strlen($password ?? '') < 12) {
        $this->error('Use at least 12 characters.');

        return 1;
    }if (User::where('email', $this->argument('email'))->exists()) {
        $this->error('Account already exists.');

        return 1;
    }$user = new User;
    $user->name = $this->option('name');
    $user->email = $this->argument('email');
    $user->password = Hash::make($password);
    $user->role = 'super_admin';
    $user->save();
    $this->info('Administrator created.');
});
Artisan::command('content:publish-due', function () {
    $count = Content::where('status', 'scheduled')->where('published_at', '<=', now())->where(fn ($q) => $q->where('type', '!=', 'testimonials')->orWhere('details->approval_status', 'approved'))->update(['status' => 'published']);
    $this->info($count.' scheduled item(s) published.');
});
Schedule::command('content:publish-due')->everyMinute()->withoutOverlapping();

Artisan::command('admin:local', function () {
    if (! app()->environment('local')) {
        $this->error('Local development only.');

        return 1;
    }
    $email = 'admin@drrich.local';
    if (User::where('email', $email)->exists()) {
        $this->info('Local account already exists. See storage/app/local-admin.json.');

        return;
    }
    $password = bin2hex(random_bytes(12));
    $user = new User;
    $user->name = 'Dr. Rich Admin';
    $user->email = $email;
    $user->password = Hash::make($password);
    $user->role = 'super_admin';
    $user->save();
    file_put_contents(storage_path('app/local-admin.json'), json_encode(['email' => $email, 'password' => $password], JSON_PRETTY_PRINT));
    chmod(storage_path('app/local-admin.json'), 0600);
    $this->info('Local administrator created. Credentials: storage/app/local-admin.json');
});
