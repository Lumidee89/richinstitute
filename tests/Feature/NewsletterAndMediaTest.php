<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\WelcomeSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class NewsletterAndMediaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_subscription_sends_welcome_once_and_signed_opt_out_works(): void
    {
        Notification::fake();
        $this->post('/subscribe', ['email' => 'reader@example.com', 'consent' => true])->assertSessionHasNoErrors();
        $subscriber = DB::table('subscribers')->first();
        Notification::assertSentOnDemand(WelcomeSubscriber::class);
        $this->post('/subscribe', ['email' => 'reader@example.com', 'consent' => true]);
        Notification::assertCount(1);
        $this->post('/newsletter/preferences/'.$subscriber->id)->assertForbidden();
        $url = URL::signedRoute('newsletter.preferences', ['subscriber' => $subscriber->id]);
        $this->get($url)->assertOk();
        $this->assertDatabaseHas('subscribers', ['status' => 'subscribed']);
        $this->post($url)->assertRedirect();
        $this->assertDatabaseHas('subscribers', ['status' => 'unsubscribed']);
        $this->post('/subscribe', ['email' => 'reader@example.com', 'consent' => true])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('subscribers', ['status' => 'subscribed', 'unsubscribed_at' => null]);
        Notification::assertCount(2);
    }

    public function test_uploads_require_auth_and_validate_files(): void
    {
        Storage::fake('public');
        $this->postJson('/admin/upload', [])->assertUnauthorized();
        $user = User::factory()->create();
        $user->role = 'editor';
        $user->save();
        $this->actingAs($user)->postJson('/admin/upload', ['file' => UploadedFile::fake()->create('script.php', 10), 'alt_text' => 'Unsafe'])->assertUnprocessable();
        $this->postJson('/admin/upload', ['file' => UploadedFile::fake()->image('cover.jpg'), 'alt_text' => 'Approved book cover'])->assertOk()->assertJsonStructure(['path']);
        $this->assertDatabaseHas('media_assets', ['name' => 'cover.jpg', 'alt_text' => 'Approved book cover']);
    }

    public function test_unsubscribed_addresses_are_excluded_from_export(): void
    {
        $user = User::factory()->create();
        $user->role = 'editor';
        $user->save();
        DB::table('subscribers')->insert(['email' => 'optedout@example.com', 'status' => 'unsubscribed', 'consent_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
        $response = $this->actingAs($user)->get('/admin/subscribers/export');
        $this->assertStringNotContainsString('optedout@example.com', $response->streamedContent());
    }
}
