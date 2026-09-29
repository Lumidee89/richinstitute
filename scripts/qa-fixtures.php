<?php

use App\Models\Content;
use App\Models\User;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;


// This script refuses to modify the application database.
require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();
if (! app()->environment('testing') || config('database.default') !== 'sqlite' || config('database.connections.sqlite.database') !== '/private/tmp/dr-rich-qa.sqlite') {
    fwrite(STDERR, "Refusing to run outside the isolated QA database.\n");
    exit(1);
}
if (! file_exists('/private/tmp/dr-rich-qa.sqlite')) {
    touch('/private/tmp/dr-rich-qa.sqlite');
}

if (Schema::hasTable('media_assets')) {
    foreach (DB::table('media_assets')->get() as $asset) {
        $paths = [$asset->path, $asset->original_path];
        foreach (json_decode($asset->variants ?? '[]', true) as $variant) {
            $paths[] = $variant['url'];
        }foreach (array_filter($paths) as $path) {
            if (str_starts_with($path, '/storage/media/')) {
                Storage::disk('public')->delete(substr($path, 9));
            }
        }
    }
}
if (in_array('--cleanup', $argv, true)) {
    echo "QA uploaded assets removed.\n";
    exit;
}
Artisan::call('migrate:fresh', ['--force' => true]);
$password = bin2hex(random_bytes(16));
$user = new User;
$user->name = 'QA Administrator';
$user->email = 'qa@example.test';
$user->password = $password;
$user->role = 'super_admin';
$user->save();
$make = fn ($type, $slug, $title, $details = []) => Content::create(['type' => $type, 'slug' => $slug, 'title' => $title, 'body' => 'Approved only for automated testing.', 'excerpt' => 'Isolated QA content, never published to the application database.', 'status' => 'published', 'details' => $details]);
$tag = $make('tags', 'qa-leadership', 'QA Leadership');
$make('categories', 'qa-category', 'QA Category');
$book = $make('books', 'qa-book', 'QA Book', ['major_lessons' => 'A useful lesson.', 'author_name' => 'QA Author']);
$book->update(['status' => 'forthcoming', 'external_url' => 'https://example.test/book']);
$article = $make('articles', 'qa-article', 'QA Article', ['author_name' => 'QA Author']);
$article->update(['category' => 'QA Category']);
$article->tags()->sync([$tag->id]);
$article->related()->sync([$book->id]);
$event = $make('events', 'qa-event', 'QA Event', ['starts_at' => now()->addMonth()->format('Y-m-d').'T10:00', 'ends_at' => now()->addMonth()->format('Y-m-d').'T12:00', 'timezone' => 'Africa/Lusaka', 'capacity' => '5', 'whatsapp_url' => 'https://wa.me/260000000000']);
$event->update(['event_starts_at' => now()->addMonth()->startOfDay()->addHours(8), 'event_ends_at' => now()->addMonth()->startOfDay()->addHours(10)]);
$past = $make('events', 'qa-past-event', 'QA Past Event');
$past->update(['event_starts_at' => now()->subMonth()]);
$make('programmes', 'qa-programme', 'QA Programme', ['duration' => '2 hours', 'outcomes' => 'A practical outcome.']);
$make('testimonials', 'qa-story', 'QA Story', ['person_name' => 'QA Person', 'organisation' => 'QA Organisation', 'approval_status' => 'approved']);
$make('consultation-services', 'qa-service', 'QA Consultation Area');
$make('speaking-topics', 'qa-topic', 'QA Speaking Topic');
$make('media', 'qa-resource', 'QA Resource');
$make('faqs', 'qa-question', 'QA question?');
foreach (['contact_email' => 'qa@example.test', 'notification_email' => 'qa@example.test', 'analytics_id' => 'G-QATEST123', 'home_about_title' => 'QA introduction', 'home_about_body' => 'Biography approved for isolated testing only.'] as $key => $value) {
    DB::table('settings')->insert(['key' => $key, 'value' => $value]);
}
file_put_contents('/private/tmp/dr-rich-qa-admin.json',json_encode(['email' => $user->email, 'password' => $password]));
chmod('/private/tmp/dr-rich-qa-admin.json',0600);
echo "Isolated QA database prepared; mail uses the in-memory transport.\n";
