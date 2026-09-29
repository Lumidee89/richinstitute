<?php

namespace Tests\Feature;

use App\Models\Content;
use App\Models\User;
use App\Notifications\NewSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RequirementsCompletionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function admin(): User
    {
        $user = User::factory()->create();
        $user->role = 'super_admin';
        $user->save();

        return $user;
    }

    private function item(array $values = []): Content
    {
        return Content::create([...['type' => 'articles', 'title' => 'Approved article', 'slug' => 'approved-article', 'status' => 'published'], ...$values]);
    }

    public function test_forthcoming_books_are_public_but_forthcoming_other_content_is_not(): void
    {
        $this->item(['type' => 'books', 'slug' => 'coming-book', 'status' => 'forthcoming']);
        $this->item(['slug' => 'coming-article', 'status' => 'forthcoming']);
        $this->get('/books/coming-book')->assertOk();
        $this->get('/articles/coming-article')->assertNotFound();
        $this->get('/books')->assertInertia(fn (Assert $p) => $p->has('items', 1)->where('items.0.status', 'forthcoming'));
    }

    public function test_testimonials_need_explicit_approval_to_publish_or_appear(): void
    {
        $this->item(['type' => 'testimonials', 'slug' => 'pending-story', 'details' => ['approval_status' => 'pending']]);
        $this->get('/testimonials/pending-story')->assertNotFound();
        $this->actingAs($this->admin())->post('/admin/content', ['type' => 'testimonials', 'title' => 'Story', 'slug' => 'story', 'status' => 'published', 'details' => ['person_name' => 'Approved person', 'approval_status' => 'pending']])->assertSessionHasErrors('details.approval_status');
        $this->post('/admin/content', ['type' => 'testimonials', 'title' => 'Story', 'slug' => 'story', 'status' => 'published', 'details' => ['person_name' => 'Approved person', 'approval_status' => 'approved']])->assertSessionHasNoErrors();
        $this->get('/testimonials/story')->assertOk();
    }

    public function test_event_timezone_dates_and_public_views(): void
    {
        $this->actingAs($this->admin());
        $this->post('/admin/content', ['type' => 'events', 'title' => 'Future event', 'slug' => 'future-event', 'status' => 'published', 'details' => ['starts_at' => now()->addDays(3)->format('Y-m-d').'T10:00', 'ends_at' => now()->addDays(3)->format('Y-m-d').'T12:00', 'timezone' => 'Africa/Lusaka']])->assertSessionHasNoErrors();
        $event = Content::where('slug', 'future-event')->firstOrFail();
        $this->assertSame('08:00', $event->event_starts_at->format('H:i'));
        $this->item(['type' => 'events', 'slug' => 'past-event', 'event_starts_at' => now()->subDay()]);
        $this->get('/events')->assertInertia(fn (Assert $p) => $p->has('items', 1)->where('items.0.slug', 'future-event'));
        $this->get('/events?view=past')->assertInertia(fn (Assert $p) => $p->has('items', 1)->where('items.0.slug', 'past-event'));
    }

    public function test_invalid_timezone_and_end_date_are_rejected(): void
    {
        $this->actingAs($this->admin())->post('/admin/content', ['type' => 'events', 'title' => 'Event', 'slug' => 'event', 'status' => 'draft', 'details' => ['starts_at' => '2027-01-02T12:00', 'ends_at' => '2027-01-01T12:00', 'timezone' => 'Invalid/Zone']])->assertSessionHasErrors(['details.ends_at', 'details.timezone']);
    }

    public function test_linked_tags_related_resources_and_category_filter(): void
    {
        $tag = $this->item(['type' => 'tags', 'title' => 'Leadership', 'slug' => 'leadership']);
        $related = $this->item(['type' => 'media', 'slug' => 'resource']);
        $hidden = $this->item(['type' => 'media', 'slug' => 'private', 'status' => 'draft']);
        $this->actingAs($this->admin())->post('/admin/content', ['type' => 'articles', 'title' => 'Leadership article', 'slug' => 'leadership-article', 'status' => 'published', 'category' => 'Leadership', 'tag_ids' => [$tag->id], 'related_ids' => [$related->id, $hidden->id], 'details' => ['author_name' => 'Approved Author']])->assertSessionHasNoErrors();
        $this->get('/articles/leadership-article')->assertInertia(fn (Assert $p) => $p->has('entry.tags', 1)->has('related', 1)->where('related.0.slug', 'resource'));
        $this->get('/articles?category=Leadership&tag=leadership')->assertInertia(fn (Assert $p) => $p->has('items', 1));
        $this->get('/articles?category=Other')->assertInertia(fn (Assert $p) => $p->has('items', 0));
    }

    public function test_slug_changes_redirect_and_do_not_reveal_archived_content(): void
    {
        $item = $this->item();
        $this->actingAs($this->admin())->put('/admin/content/'.$item->id, ['type' => 'articles', 'title' => $item->title, 'slug' => 'new-url', 'status' => 'published'])->assertSessionHasNoErrors();
        $this->get('/articles/approved-article')->assertStatus(301)->assertRedirect('/articles/new-url');
        $this->post('/admin/content', ['type' => 'articles', 'title' => 'Conflict', 'slug' => 'approved-article', 'status' => 'published'])->assertSessionHasErrors('slug');
        $item->refresh()->update(['status' => 'archived']);
        $this->get('/articles/approved-article')->assertNotFound();
    }

    public function test_custom_pages_and_redirects_work(): void
    {
        $page = $this->item(['type' => 'pages', 'slug' => 'our-values']);
        $this->get('/our-values')->assertOk();
        $this->actingAs($this->admin())->put('/admin/content/'.$page->id, ['type' => 'pages', 'title' => 'Our values', 'slug' => 'core-values', 'status' => 'published'])->assertSessionHasNoErrors();
        $this->get('/our-values')->assertStatus(301)->assertRedirect('/core-values');
    }

    public function test_canonical_noindex_and_sitemap_exclusion(): void
    {
        $this->item(['slug' => 'private-search', 'noindex' => true, 'canonical_url' => 'https://example.org/approved-canonical']);
        $this->get('/articles/private-search')->assertSee('content="noindex,follow"', false)->assertSee('https://example.org/approved-canonical');
        $this->get('/sitemap.xml')->assertDontSee('private-search');
        $this->get('/robots.txt')->assertOk()->assertSee('Sitemap:');
    }

    public function test_form_fields_and_per_type_notifications(): void
    {
        Notification::fake();
        $this->actingAs($this->admin())->put('/admin/settings', ['notification_email' => 'default@example.com', 'notification_email_speaking' => 'speaking@example.com', 'notification_enabled_contact' => '0'])->assertSessionHasNoErrors();
        $this->post('/enquiries', ['type' => 'speaking', 'name' => 'Organiser', 'email' => 'organiser@example.com', 'message' => 'Please speak at our conference.', 'consent' => true, 'details' => ['proposed_topic' => 'Leadership', 'method' => 'In person']])->assertSessionHasNoErrors();
        Notification::assertSentOnDemand(NewSubmission::class, fn ($notification, $channels, $notifiable) => $notifiable->routes['mail'] === 'speaking@example.com');
        $this->post('/enquiries', ['type' => 'contact', 'name' => 'Visitor', 'email' => 'visitor@example.com', 'message' => 'A media enquiry for your team.', 'consent' => true, 'details' => ['enquiry_category' => 'Media', 'subject' => 'Media interview']])->assertSessionHasNoErrors();
        Notification::assertCount(1);
        $this->assertDatabaseHas('submissions', ['type' => 'contact']);
    }

    public function test_homepage_content_and_cache_invalidation(): void
    {
        $this->item(['type' => 'testimonials', 'slug' => 'story', 'details' => ['approval_status' => 'approved']]);
        $this->item(['type' => 'events', 'slug' => 'event', 'event_starts_at' => now()->addDay()]);
        $this->get('/')->assertInertia(fn (Assert $p) => $p->has('items', 2));
        $this->actingAs($this->admin())->put('/admin/settings', ['home_sections' => 'hero,events,testimonials', 'home_about_body' => 'Approved biography.', 'home_eyebrow' => 'Approved homepage label'])->assertSessionHasNoErrors();
        $this->get('/')->assertInertia(fn (Assert $p) => $p->where('settings.home_sections', 'hero,events,testimonials')->where('settings.home_eyebrow', 'Approved homepage label')->missing('settings.notification_email_speaking'));
    }

    public function test_image_uploads_preserve_original_and_generate_responsive_webp(): void
    {
        Storage::fake('public');
        $response = $this->actingAs($this->admin())->postJson('/admin/upload', ['file' => UploadedFile::fake()->image('portrait.jpg', 1600, 900), 'alt_text' => 'Approved portrait']);
        $response->assertOk()->assertJsonCount(3, 'variants');
        $this->assertStringEndsWith('.webp', $response->json('path'));
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $response->json('original_path')));
        foreach ($response->json('variants') as $variant) {
            Storage::disk('public')->assertExists(str_replace('/storage/', '', $variant['url']));
        }
    }

    public function test_scheduler_publishes_only_due_approved_records(): void
    {
        $due = $this->item(['slug' => 'due', 'status' => 'scheduled', 'published_at' => now()->subMinute()]);
        $future = $this->item(['slug' => 'future', 'status' => 'scheduled', 'published_at' => now()->addDay()]);
        $unapproved = $this->item(['type' => 'testimonials', 'slug' => 'unapproved', 'status' => 'scheduled', 'published_at' => now()->subMinute(), 'details' => ['approval_status' => 'pending']]);
        $this->artisan('content:publish-due')->assertSuccessful();
        $this->assertSame('published', $due->fresh()->status);
        $this->assertSame('scheduled', $future->fresh()->status);
        $this->assertSame('scheduled', $unapproved->fresh()->status);
    }
    public function test_category_rename_updates_linked_content_and_delete_uncategorises_it():void {
        $category=$this->item(['type'=>'categories','title'=>'Original category','slug'=>'original-category']);
        $this->actingAs($this->admin())->post('/admin/content',['type'=>'articles','title'=>'Linked article','slug'=>'linked-article','status'=>'published','category_id'=>$category->id])->assertSessionHasNoErrors();
        $article=Content::where('slug','linked-article')->firstOrFail();$this->assertSame('Original category',$article->category);
        $this->put('/admin/content/'.$category->id,['type'=>'categories','title'=>'Renamed category','slug'=>'renamed-category','status'=>'published'])->assertSessionHasNoErrors();$this->assertSame('Renamed category',$article->fresh()->category);
        $this->delete('/admin/content/'.$category->id)->assertRedirect();$this->assertNull($article->fresh()->category_id);$this->assertNull($article->fresh()->category);
    }
    public function test_home_section_names_and_gallery_schemes_are_validated():void {
        $this->actingAs($this->admin())->put('/admin/settings',['home_sections'=>'hero,unknown'])->assertSessionHasErrors('home_sections');
        $this->post('/admin/content',['type'=>'events','title'=>'Unsafe gallery','slug'=>'unsafe-gallery','status'=>'draft','details'=>['gallery'=>'javascript:alert(1)']])->assertSessionHasErrors('details.gallery');
    }
}
