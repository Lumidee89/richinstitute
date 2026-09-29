<?php

namespace Tests\Feature;

use App\Models\Content;
use App\Models\Submission;
use App\Models\User;
use App\Notifications\NewSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PlatformTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function admin(string $role = 'super_admin'): User
    {
        $u = User::factory()->create();
        $u->role = $role;
        $u->save();

        return $u;
    }

    public function test_public_pages_render(): void
    {
        foreach (['', 'about', 'vision-mission', 'books', 'programmes', 'consultations', 'speaking', 'events', 'articles', 'media', 'contact', 'faq', 'privacy-policy', 'search'] as $page) {
            $this->get('/'.$page)->assertOk();
        }
    }

    public function test_admin_requires_authentication_and_role(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->actingAs($this->admin('member'))->get('/admin')->assertForbidden();
    }

    public function test_editor_cannot_change_settings(): void
    {
        $this->actingAs($this->admin('editor'))->put('/admin/settings', ['contact_email' => 'test@example.com'])->assertForbidden();
    }

    public function test_drafts_and_future_content_are_private(): void
    {
        foreach (['draft', 'archived', 'scheduled'] as $status) {
            $c = Content::create(['type' => 'books', 'title' => 'Private', 'slug' => $status, 'status' => $status]);
            $this->get('/books/'.$c->slug)->assertNotFound();
        }$c = Content::create(['type' => 'articles', 'title' => 'Future', 'slug' => 'future', 'status' => 'published', 'published_at' => now()->addDay()]);
        $this->get('/articles/future')->assertNotFound();
        Content::create(['type' => 'books', 'title' => 'Public', 'slug' => 'public', 'status' => 'published']);
        $this->get('/books/public')->assertOk();
    }

    public function test_admin_content_lifecycle(): void
    {
        $this->actingAs($this->admin());
        $data = ['type' => 'articles', 'title' => 'A new perspective', 'slug' => 'a-new-perspective', 'status' => 'draft', 'body' => 'Approved content.'];
        $this->post('/admin/content', $data)->assertRedirect();
        $c = Content::firstOrFail();
        $this->assertSame('draft', $c->status);
        $this->put('/admin/content/'.$c->id, [...$data, 'status' => 'published'])->assertRedirect();
        $this->assertDatabaseHas('contents', ['id' => $c->id, 'status' => 'published']);
        $this->delete('/admin/content/'.$c->id)->assertRedirect();
        $this->assertDatabaseMissing('contents', ['id' => $c->id]);
        $this->assertDatabaseCount('activity_logs', 3);
    }

    public function test_duplicate_slug_is_rejected_within_type(): void
    {
        $this->actingAs($this->admin());
        $d = ['type' => 'books', 'title' => 'Book', 'slug' => 'book', 'status' => 'draft'];
        $this->post('/admin/content', $d);
        $this->post('/admin/content', $d)->assertSessionHasErrors('slug');
    }

    public function test_schedule_requires_a_future_date(): void
    {
        $this->actingAs($this->admin())->post('/admin/content', ['type' => 'articles', 'title' => 'Scheduled', 'slug' => 'scheduled', 'status' => 'scheduled'])->assertSessionHasErrors('published_at');
    }

    public function test_enquiries_store_consent_and_queue_notification(): void
    {
        Notification::fake();
        DB::table('settings')->insert(['key' => 'notification_email', 'value' => 'team@example.com']);
        $this->post('/enquiries', ['type' => 'consultation', 'name' => 'Visitor', 'email' => 'visitor@example.com', 'message' => 'I would like guidance with business strategy.', 'consent' => true])->assertRedirect()->assertSessionHas('success');
        $this->assertDatabaseHas('submissions', ['type' => 'consultation', 'email' => 'visitor@example.com', 'status' => 'new']);
        $this->assertNotNull(Submission::first()->consent_at);
        Notification::assertSentOnDemand(NewSubmission::class);
    }

    public function test_spam_and_missing_consent_are_rejected(): void
    {
        $this->post('/enquiries', ['type' => 'contact', 'name' => 'Visitor', 'email' => 'visitor@example.com', 'message' => 'A valid message.', 'website' => 'https://spam.test'])->assertSessionHasErrors(['consent', 'website']);
        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_newsletter_is_case_insensitive_and_deduplicated(): void
    {
        foreach (['Person@example.com', 'person@example.com'] as $email) {
            $this->post('/subscribe', ['email' => $email, 'consent' => true])->assertRedirect();
        }$this->assertDatabaseCount('subscribers', 1);
    }

    public function test_submission_status_and_notes_are_saved(): void
    {
        $s = Submission::create(['type' => 'contact', 'name' => 'Visitor', 'email' => 'visitor@example.com', 'message' => 'Hello there', 'consent_at' => now()]);
        $this->actingAs($this->admin('editor'))->put('/admin/inbox/'.$s->id, ['status' => 'contacted', 'admin_notes' => 'Follow up next week.'])->assertRedirect();
        $this->assertDatabaseHas('submissions', ['id' => $s->id, 'status' => 'contacted']);
    }

    public function test_unsafe_external_urls_are_rejected(): void
    {
        $this->actingAs($this->admin())->post('/admin/content', ['type' => 'books', 'title' => 'Book', 'slug' => 'book', 'status' => 'draft', 'external_url' => 'javascript:alert(1)'])->assertSessionHasErrors('external_url');
    }

    public function test_sitemap_excludes_drafts(): void
    {
        Content::create(['type' => 'books', 'title' => 'Private', 'slug' => 'private-book', 'status' => 'draft']);
        Content::create(['type' => 'books', 'title' => 'Public', 'slug' => 'public-book', 'status' => 'published']);
        $this->get('/sitemap.xml')->assertOk()->assertSee('public-book')->assertDontSee('private-book');
    }

    public function test_login_logout_and_invalid_credentials(): void
    {
        $user = $this->admin();
        $this->post('/admin/login', ['email' => $user->email, 'password' => 'incorrect'])->assertSessionHasErrors('email');
        $this->post('/admin/login', ['email' => $user->email, 'password' => 'password'])->assertRedirect('/admin/dashboard');
        $this->get('/admin/dashboard')->assertOk();
        $this->post('/admin/logout')->assertRedirect('/admin/login');
        $this->assertGuest();
    }
}
