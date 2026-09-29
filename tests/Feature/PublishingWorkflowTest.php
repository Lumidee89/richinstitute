<?php

namespace Tests\Feature;

use App\Models\Content;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublishingWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function admin(string $role = 'super_admin'): User
    {
        $user = User::factory()->create();
        $user->role = $role;
        $user->save();

        return $user;
    }

    private function enquiry(Content $content, array $overrides = []): array
    {
        return [...['type' => 'event', 'content_id' => $content->id, 'name' => 'Visitor', 'email' => 'visitor@example.com', 'message' => 'I would like to register my interest.', 'consent' => true], ...$overrides];
    }

    public function test_super_administrator_can_manage_accounts(): void
    {
        $admin = $this->admin();
        $this->actingAs($admin)->post('/admin/users', ['name' => 'Content Editor', 'email' => 'editor@example.com', 'role' => 'editor', 'password' => 'a-strong-test-password', 'password_confirmation' => 'a-strong-test-password'])->assertSessionHasNoErrors();
        $user = User::where('email', 'editor@example.com')->firstOrFail();
        $this->assertTrue(Hash::check('a-strong-test-password', $user->password));
        $this->put('/admin/users/'.$user->id, ['name' => 'Updated Editor', 'email' => $user->email, 'role' => 'editor', 'password' => ''])->assertSessionHasNoErrors();
        $this->assertSame('Updated Editor', $user->fresh()->name);
        $this->delete('/admin/users/'.$user->id)->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_editor_cannot_manage_accounts_and_admin_cannot_remove_self(): void
    {
        $editor = $this->admin('editor');
        $this->actingAs($editor)->post('/admin/users', [])->assertForbidden();
        $admin = $this->admin();
        $this->actingAs($admin)->delete('/admin/users/'.$admin->id)->assertStatus(422);
        $this->put('/admin/users/'.$admin->id, ['name' => $admin->name, 'email' => $admin->email, 'role' => 'editor'])->assertSessionHasErrors('role');
    }

    public function test_registration_cannot_target_wrong_type_or_draft(): void
    {
        $book = Content::create(['type' => 'books', 'title' => 'Book', 'slug' => 'book', 'status' => 'published']);
        $this->post('/enquiries', $this->enquiry($book))->assertSessionHasErrors('content_id');
        $event = Content::create(['type' => 'events', 'title' => 'Event', 'slug' => 'event', 'status' => 'draft']);
        $this->post('/enquiries', $this->enquiry($event))->assertSessionHasErrors('content_id');
        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_registration_windows_capacity_and_duplicates(): void
    {
        $event = Content::create(['type' => 'events', 'title' => 'Event', 'slug' => 'event', 'status' => 'published', 'details' => ['registration_opens_at' => now()->addDay()->toDateTimeString()]]);
        $this->post('/enquiries', $this->enquiry($event))->assertSessionHasErrors('content_id');
        $event->update(['details' => ['capacity' => 1]]);
        $this->post('/enquiries', $this->enquiry($event))->assertSessionHasNoErrors();
        $this->post('/enquiries', $this->enquiry($event))->assertSessionHasErrors('email');
        $this->post('/enquiries', $this->enquiry($event, ['email' => 'second@example.com']))->assertSessionHasErrors('content_id');
        $this->assertDatabaseCount('submissions', 1);
        $this->get('/events/event')->assertInertia(fn (Assert $page) => $page->where('registrationOpen', false));
    }

    public function test_public_search_and_pagination_are_server_side(): void
    {
        for ($i = 0; $i < 14; $i++) {
            Content::create(['type' => 'articles', 'title' => 'Leadership '.$i, 'slug' => 'leadership-'.$i, 'status' => 'published']);
        }Content::create(['type' => 'articles', 'title' => 'Private secret', 'slug' => 'private', 'status' => 'draft']);
        $this->get('/articles')->assertInertia(fn (Assert $page) => $page->has('items', 12)->where('pagination.total', 14));
        $this->get('/search?q=Leadership')->assertInertia(fn (Assert $page) => $page->where('pagination.total', 14));
        $this->get('/search?q=secret')->assertInertia(fn (Assert $page) => $page->has('items', 0));
    }

    public function test_private_settings_are_not_shared_on_public_pages(): void
    {
        DB::table('settings')->insert([['key' => 'notification_email', 'value' => 'private@example.com'], ['key' => 'contact_email', 'value' => 'public@example.com']]);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->missing('settings.notification_email')->where('settings.contact_email', 'public@example.com'));
    }

    public function test_metadata_is_rendered_on_server_and_escaped(): void
    {
        Content::create(['type' => 'articles', 'title' => 'An approved insight', 'slug' => 'insight', 'status' => 'published', 'seo_title' => 'Approved SEO title', 'meta_description' => 'A useful description.']);
        $this->get('/articles/insight')->assertSee('<title inertia>Approved SEO title | Dr. Rich Global</title>', false)->assertSee('application/ld+json', false)->assertSee('A useful description.');
    }

    public function test_admin_lists_are_paginated_and_filtered(): void
    {
        for ($i = 0; $i < 18; $i++) {
            Content::create(['type' => 'books', 'title' => 'Book '.$i, 'slug' => 'book-'.$i, 'status' => 'draft']);
        }$this->actingAs($this->admin())->get('/admin/books')->assertInertia(fn (Assert $page) => $page->has('contents', 15)->where('pagination.total', 18));
        $this->get('/admin/books?q=Book%2017')->assertInertia(fn (Assert $page) => $page->has('contents', 1)->where('pagination.total', 1));
    }

    public function test_newsletter_export_has_consent_and_neutralizes_formulas(): void
    {
        DB::table('subscribers')->insert(['email' => '=person@example.com', 'consent_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
        $response = $this->actingAs($this->admin())->get('/admin/subscribers/export');
        $response->assertOk();
        $this->assertStringContainsString("'=person@example.com",$response->streamedContent());
        $this->assertStringContainsString('Consent recorded',$response->streamedContent());
    }
}
