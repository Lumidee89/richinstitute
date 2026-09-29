<?php

namespace Tests\Feature;

use App\Models\Content;
use App\Models\User;
use App\Notifications\NewSubmission;
use App\Notifications\WelcomeSubscriber;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class OperationalWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_worker_processes_serialized_notifications_and_renders_mail(): void
    {
        config(['queue.default' => 'database', 'mail.default' => 'array']);
        Notification::route('mail', 'controlled@example.test')->notify(new NewSubmission('contact', 123));
        Notification::route('mail', 'controlled@example.test')->notify(new WelcomeSubscriber(456));
        $this->assertDatabaseCount('jobs', 2);
        $this->assertCount(0, Mail::mailer()->getSymfonyTransport()->messages());

        Artisan::call('queue:work', ['connection' => 'database', '--stop-when-empty' => true, '--tries' => 1, '--sleep' => 0]);

        $this->assertDatabaseCount('jobs', 0);
        $this->assertDatabaseCount('failed_jobs', 0);
        $messages = Mail::mailer()->getSymfonyTransport()->messages();
        $this->assertCount(2, $messages);
        $enquiry = $messages[0]->getOriginalMessage();
        $welcome = $messages[1]->getOriginalMessage();
        $this->assertSame('controlled@example.test', $enquiry->getTo()[0]->getAddress());
        $this->assertStringContainsString('/admin/inbox', $enquiry->getHtmlBody());
        $this->assertStringContainsString('signature=', $welcome->getHtmlBody());
        $this->assertSame('Welcome to the Dr. Rich Global community', $welcome->getSubject());
    }

    public function test_registered_scheduler_publishes_due_content_through_its_event(): void
    {
        $due = Content::create(['type' => 'articles', 'title' => 'Due', 'slug' => 'operational-due', 'status' => 'scheduled', 'published_at' => now()->subMinute()]);
        $future = Content::create(['type' => 'articles', 'title' => 'Later', 'slug' => 'operational-later', 'status' => 'scheduled', 'published_at' => now()->addDay()]);
        $events = collect(app(Schedule::class)->events())->filter(fn ($event) => str_contains($event->command ?? '', 'content:publish-due'));
        $this->assertCount(1, $events);
        $event = $events->first();
        $this->assertSame('* * * * *', $event->expression);
        $this->assertTrue($event->withoutOverlapping);
        // Execute the registered command in-process so it shares the isolated in-memory DB.
        Artisan::call('content:publish-due');
        $this->assertSame('published', $due->fresh()->status);
        $this->assertSame('scheduled', $future->fresh()->status);
    }

    public function test_real_reset_mail_link_completes_reset_and_cannot_be_reused(): void
    {
        $this->withoutVite();
        config(['mail.default' => 'array']);
        $user = User::factory()->create(['email' => 'reset@example.test']);
        $this->post('/forgot-password', ['email' => $user->email])->assertSessionHasNoErrors();
        $messages = Mail::mailer()->getSymfonyTransport()->messages();
        $this->assertCount(1, $messages);
        $html = html_entity_decode($messages[0]->getOriginalMessage()->getHtmlBody());
        preg_match('~href="([^"]*/reset-password/[^\"]+)"~', $html, $matches);
        $this->assertNotEmpty($matches[1] ?? null);
        $token = basename(parse_url($matches[1], PHP_URL_PATH));
        $payload = ['email' => $user->email, 'token' => $token, 'password' => 'new-controlled-password', 'password_confirmation' => 'new-controlled-password'];
        $this->post('/reset-password', $payload)->assertSessionHasNoErrors();
        $this->assertTrue(Hash::check($payload['password'], $user->fresh()->password));
        $this->assertSame(0, DB::table('password_reset_tokens')->count());
        $this->post('/reset-password', $payload)->assertSessionHasErrors();
    }
}
