<?php

namespace App\Http\Controllers;

use App\Models\Content;
use App\Models\Submission;
use App\Notifications\NewSubmission;
use App\Notifications\WelcomeSubscriber;
use App\Services\OptimizedMedia;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PlatformController extends Controller
{
    public const TYPES = ['pages', 'books', 'programmes', 'events', 'articles', 'media', 'testimonials', 'partners', 'social-impact', 'faqs', 'consultation-services', 'speaking-topics', 'categories', 'tags'];

    public function site(Request $r, string $page = 'home', ?string $slug = null)
    {
        $query = trim($r->string('q')->limit(200)->toString());
        $type = match ($page) {
            'faq' => 'faqs', 'partnerships' => 'partners', 'consultations' => 'consultation-services', 'speaking' => 'speaking-topics', default => $page
        };
        $entry = $slug ? Content::visible()->with('tags:id,title,slug')->where('type', $type)->where('slug', $slug)->first() : null;
        if ($slug && ! $entry) {
            $redirect = DB::table('content_redirects')->where('type', $type)->where('slug', $slug)->first();
            $target = $redirect ? Content::visible()->find($redirect->content_id) : null;
            if ($target) {
                return redirect($target->publicPath(), 301);
            }abort(404);
        }
        $category = trim($r->string('category')->limit(150)->toString());
        $tag = trim($r->string('tag')->limit(150)->toString());
        $eventView = $r->input('view', 'upcoming');
        $categories = Content::visible()->where('type', $type)->whereNotNull('category')->distinct()->orderBy('category')->pluck('category');
        $tags = Content::where('type', 'tags')->whereIn('id', DB::table('content_tag')->whereIn('content_id', Content::visible()->where('type', $type)->select('id'))->select('tag_id'))->get(['id', 'title', 'slug']);
        $pageContent = Content::visible()->where('type', 'pages')->where('slug', $page)->first();
        $records = Content::visible()->with('tags:id,title,slug')->when($category !== '', fn ($q) => $q->where('category', $category))->when($tag !== '', fn ($q) => $q->whereHas('tags', fn ($q) => $q->where('slug', $tag)))->orderBy('display_order')->latest();
        if ($page === 'events') {
            $records->where(function ($q) use ($eventView) {
                if ($eventView === 'past') {
                    $q->whereRaw('COALESCE(event_ends_at,event_starts_at) < ?', [now()]);
                } else {
                    $q->whereRaw('COALESCE(event_ends_at,event_starts_at) >= ?', [now()]);
                }
            });
        }
        if ($page === 'search') {
            $records->whereIn('type', ['books', 'programmes', 'events', 'articles', 'media'])->where(function ($q) use ($query) {
                $q->where('title', 'like', '%'.$query.'%')->orWhere('excerpt', 'like', '%'.$query.'%')->orWhere('body', 'like', '%'.$query.'%');
            });
        } else {
            $records->where('type', $type);
        }
        $pagination = null;
        if ($page === 'home') {
            $items = collect();
            foreach (['programmes', 'books', 'events', 'testimonials', 'articles'] as $featuredType) {
                $items = $items->merge(Content::visible()->where('type', $featuredType)->when($featuredType === 'events', fn ($q) => $q->whereRaw('COALESCE(event_ends_at,event_starts_at) >= ?', [now()]))->orderByDesc('featured')->orderBy('display_order')->latest()->limit(3)->get());
            }
        } else {
            $result = $records->paginate(12)->withQueryString();
            $items = collect($result->items());
            $pagination = ['current' => $result->currentPage(), 'last' => $result->lastPage(), 'total' => $result->total(), 'previous' => $result->previousPageUrl(), 'next' => $result->nextPageUrl()];
        }
        if ($pageContent) {
            $items->push($pageContent);
        }
        $publicKeys = ['hero_description', 'hero_title', 'contact_email', 'phone', 'whatsapp', 'location', 'instagram', 'facebook', 'linkedin', 'youtube', 'community_url', 'seo_description', 'analytics_id', 'search_console_verification', 'home_eyebrow', 'home_sections', 'home_about_title', 'home_about_body', 'home_about_image', 'home_about_alt', 'home_consultation_title', 'home_consultation_body', 'home_speaking_title', 'home_speaking_body', 'home_journeys_title', 'home_vision_title', 'home_vision_body', 'home_newsletter_title', 'home_newsletter_body', 'home_final_cta'];
        $publicKeys = [...$publicKeys, ...array_keys(config('homepage.copy'))];
        // Persist plain data: database cache may disallow unserializing Collection objects.
        $loadSettings = fn () => DB::table('settings')->whereIn('key', $publicKeys)->pluck('value', 'key')->all();
        $settings = Cache::remember('public_site_settings', 60, $loadSettings);
        if (! is_array($settings)) {
            // Repair legacy cached objects without requiring a site-wide cache flush.
            $settings = $loadSettings();
            Cache::put('public_site_settings', $settings, 60);
        }
        $related = $entry ? $entry->related()->visible()->limit(6)->get() : collect();
        if ($entry && $related->isEmpty() && in_array($page, ['articles', 'books'])) {
            $related = Content::visible()->where('id', '!=', $entry->id)->where('type', $entry->type)->whereNotNull('category')->where('category', $entry->category)->limit(3)->get();
        }
        $imagePaths = $items->pluck('image')->merge($related->pluck('image'))->push($entry?->image)->push($settings['home_about_image'] ?? null)->push($settings['home_hero_image'] ?? null);
        foreach ($items->merge($related)->push($entry)->filter() as $record) {
            $imagePaths = $imagePaths->merge(explode("\n", $record->details['gallery'] ?? ''));
        }
        $media = DB::table('media_assets')->whereIn('path', $imagePaths->filter()->unique()->values())->whereNotNull('variants')->get(['path', 'variants'])->mapWithKeys(fn ($a) => [$a->path => json_decode($a->variants, true)]);
        $services = Content::visible()->whereIn('type', ['consultation-services', 'speaking-topics'])->orderBy('display_order')->get(['id', 'type', 'title']);
        $seoContent = $entry ?? $pageContent;
        $seo = ['title' => ($seoContent?->seo_title ?? $seoContent?->title ?? ($page === 'home' ? 'Liberate your mind. Transform your life.' : ucwords(str_replace('-', ' ', $page)))).' | Dr. Rich Global', 'description' => $seoContent?->meta_description ?? $seoContent?->excerpt ?? ($settings['seo_description'] ?? 'Human transformation, purposeful leadership, and sustainable wealth creation.'), 'canonical' => $seoContent?->canonical_url ?: $r->url(), 'noindex' => $page === 'search' || ($seoContent?->noindex ?? false), 'image' => $seoContent?->image ? url($seoContent->image) : null, 'verification' => $settings['search_console_verification'] ?? null];
        $structured = ['@context' => 'https://schema.org', '@type' => 'Organization', 'name' => 'Dr. Rich Global', 'url' => url('/'), 'logo' => url('/drlogo.png')];
        if ($entry && $page === 'articles') {
            $structured = ['@context' => 'https://schema.org', '@type' => 'Article', 'headline' => $entry->title, 'description' => $entry->excerpt, 'datePublished' => $entry->published_at?->toIso8601String(), 'publisher' => ['@type' => 'Organization', 'name' => 'Dr. Rich Global'], 'author' => ['@type' => 'Person', 'name' => $entry->details['author_name'] ?? 'Dr. Rich Global']];
        }
        if ($entry && $page === 'books') {
            $structured = ['@context' => 'https://schema.org', '@type' => 'Book', 'name' => $entry->title, 'description' => $entry->excerpt];
        }
        if ($entry && $page === 'events') {
            $structured = ['@context' => 'https://schema.org', '@type' => 'Event', 'name' => $entry->title, 'description' => $entry->excerpt, 'startDate' => $entry->event_starts_at?->toIso8601String(), 'endDate' => $entry->event_ends_at?->toIso8601String(), 'location' => ['@type' => 'Place', 'name' => $entry->details['venue'] ?? 'To be confirmed']];
        }
        $registrationOpen = true;
        if ($entry && in_array($page, ['programmes', 'events'])) {
            $details = $entry->details ?? [];
            $registrationOpen = (! isset($details['registration_opens_at']) || ! $details['registration_opens_at'] || now()->gte($details['registration_opens_at'])) && (! isset($details['registration_closes_at']) || ! $details['registration_closes_at'] || now()->lte($details['registration_closes_at']));
            if (! empty($details['capacity'])) {
                $registrationOpen = $registrationOpen && Submission::where('content_id', $entry->id)->where('status', '!=', 'closed')->count() < (int) $details['capacity'];
            }
        }

        return Inertia::render('Site', ['page' => $page, 'entry' => $entry, 'items' => $items, 'settings' => $settings, 'query' => $query, 'pagination' => $pagination, 'registrationOpen' => $registrationOpen, 'seo' => $seo, 'related' => $related, 'mediaVariants' => $media, 'services' => $services, 'catalogFilters' => ['category' => $category, 'tag' => $tag, 'view' => $eventView, 'categories' => $categories, 'tags' => $tags]])->withViewData(['seo' => $seo, 'structured' => $structured]);
    }

    public function customPage(Request $request, string $page)
    {
        if (Content::visible()->where('type', 'pages')->where('slug', $page)->exists()) {
            return $this->site($request, $page);
        }
        $redirect = DB::table('content_redirects')->where('type', 'pages')->where('slug', $page)->first();
        $target = $redirect ? Content::visible()->find($redirect->content_id) : null;
        if ($target) {
            return redirect($target->publicPath(), 301);
        }
        abort(404);
    }

    public function submit(Request $r)
    {
        $data = $r->validate(['type' => ['required', Rule::in(['contact', 'consultation', 'speaking', 'programme', 'event', 'book', 'partnership'])], 'name' => 'required|string|max:150', 'email' => 'required|email|max:254', 'phone' => 'nullable|string|max:40', 'message' => 'required|string|min:10|max:10000', 'consent' => 'accepted', 'website' => 'nullable|max:0', 'content_id' => 'nullable|integer', 'details' => 'nullable|array', 'details.country' => 'nullable|string|max:100', 'details.organisation' => 'nullable|string|max:200', 'details.category' => 'nullable|string|max:150', 'details.preferred_date' => 'nullable|date|after_or_equal:today', 'details.method' => 'nullable|in:Virtual,In person', 'details.event_name' => 'nullable|string|max:200', 'details.event_location' => 'nullable|string|max:200', 'details.expected_audience' => 'nullable|integer|min:1', 'details.requester_type' => 'nullable|in:Individual,Organisation', 'details.proposed_topic' => 'nullable|string|max:300', 'details.enquiry_category' => 'nullable|in:General,Consultation,Speaking,Events,Media,Partnerships,Book enquiries', 'details.subject' => 'nullable|string|max:200']);
        $data['email'] = strtolower($data['email']);
        unset($data['consent'],$data['website']);
        $data['consent_at'] = now();
        $submission = DB::transaction(function () use ($data) {
            if (in_array($data['type'], ['event', 'programme', 'book'])) {
                $expectedType = ['event' => 'events', 'programme' => 'programmes', 'book' => 'books'][$data['type']];
                $content = Content::visible()->where('type', $expectedType)->lockForUpdate()->find($data['content_id'] ?? 0);
                if (! $content) {
                    throw ValidationException::withMessages(['content_id' => 'Please choose a published offering.']);
                }
                if (in_array($data['type'], ['event', 'programme'])) {
                    $details = $content->details ?? [];
                    if ((! empty($details['registration_opens_at']) && now()->lt($details['registration_opens_at'])) || (! empty($details['registration_closes_at']) && now()->gt($details['registration_closes_at']))) {
                        throw ValidationException::withMessages(['content_id' => 'Registration is currently closed.']);
                    }
                    if (Submission::where('content_id', $content->id)->where('type', $data['type'])->where('email', $data['email'])->where('status', '!=', 'closed')->exists()) {
                        throw ValidationException::withMessages(['email' => 'You have already registered your interest. Please contact us to update your request.']);
                    }
                    if (! empty($details['capacity']) && Submission::where('content_id', $content->id)->where('status', '!=', 'closed')->count() >= (int) $details['capacity']) {
                        throw ValidationException::withMessages(['content_id' => 'This offering has reached its registration capacity.']);
                    }
                }
            } else {
                $data['content_id'] = null;
            }

            return Submission::create($data);
        });
        $email = DB::table('settings')->where('key', 'notification_email_'.$data['type'])->value('value') ?: DB::table('settings')->where('key', 'notification_email')->value('value');
        $enabled = DB::table('settings')->where('key', 'notification_enabled_'.$data['type'])->value('value');
        if ($email && $enabled !== '0') {
            Notification::route('mail', $email)->notify(new NewSubmission($data['type'], $submission->id));
        }

        return back()->with('success', 'Thank you. Your request has been received. Our team will be in touch.');
    }

    public function subscribe(Request $r)
    {
        $data = $r->validate(['email' => 'required|email|max:254', 'consent' => 'accepted', 'website' => 'nullable|max:0']);
        $email = strtolower($data['email']);
        $sendWelcome = DB::transaction(function () use ($email) {
            $record = DB::table('subscribers')->where('email', $email)->lockForUpdate()->first();
            if ($record && $record->status === 'subscribed') {
                return null;
            }
            if ($record) {
                DB::table('subscribers')->where('id', $record->id)->update(['status' => 'subscribed', 'consent_at' => now(), 'unsubscribed_at' => null, 'updated_at' => now()]);

                return $record->id;
            }

            return DB::table('subscribers')->insertGetId(['email' => $email, 'status' => 'subscribed', 'consent_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
        });
        if ($sendWelcome) {
            Notification::route('mail', $email)->notify(new WelcomeSubscriber($sendWelcome));
        }

        return back()->with('success', 'Thank you for joining our community. Your subscription has been recorded.');
    }

    public function admin(Request $r, string $section = 'dashboard')
    {
        abort_unless(in_array($section, [...self::TYPES, 'dashboard', 'inbox', 'subscribers', 'settings', 'activity', 'users']), 404);
        if (in_array($section, ['settings', 'users'])) {
            abort_unless($r->user()->role === 'super_admin', 403);
        }

        $search = trim($r->string('q')->limit(200)->toString());
        $status = $r->string('status', 'all')->toString();
        $contents = collect();
        $submissions = collect();
        $subscribers = collect();
        $activity = collect();
        $pagination = null;
        $stats = ['published' => Content::visible()->count(), 'drafts' => Content::where('status', 'draft')->count(), 'new_enquiries' => Submission::where('status', 'new')->count(), 'subscribers' => DB::table('subscribers')->where('status', 'subscribed')->count(), 'chart' => []];
        if ($section === 'dashboard') {
            $submissions = Submission::latest()->limit(4)->get();
            for ($i = 6; $i >= 0; $i--) {
                $day = now()->subDays($i);
                $stats['chart'][] = ['label' => $day->format('D'), 'count' => Submission::whereDate('created_at', $day->toDateString())->count()];
            }
        } elseif (in_array($section, self::TYPES)) {
            $records = Content::with(['tags:id,title,slug', 'related:id,type,title,slug'])->where('type', $section)->when($status !== 'all', fn ($q) => $q->where('status', $status))->when($search !== '', fn ($q) => $q->where(fn ($q) => $q->where('title', 'like', '%'.$search.'%')->orWhere('category', 'like', '%'.$search.'%')))->orderBy('display_order')->latest()->paginate(15)->withQueryString();
            $contents = collect($records->items());
        } elseif ($section === 'inbox') {
            $records = Submission::when($status !== 'all', fn ($q) => $q->where('status', $status))->when($search !== '', fn ($q) => $q->where(fn ($q) => $q->where('name', 'like', '%'.$search.'%')->orWhere('email', 'like', '%'.$search.'%')->orWhere('type', 'like', '%'.$search.'%')))->latest()->paginate(15)->withQueryString();
            $submissions = collect($records->items());
        } elseif ($section === 'subscribers') {
            $records = DB::table('subscribers')->latest()->paginate(25)->withQueryString();
            $subscribers = collect($records->items());
        } elseif ($section === 'activity') {
            $records = DB::table('activity_logs')->latest()->paginate(25)->withQueryString();
            $activity = collect($records->items());
        }
        if (isset($records)) {
            $pagination = ['current' => $records->currentPage(), 'last' => $records->lastPage(), 'total' => $records->total(), 'previous' => $records->previousPageUrl(), 'next' => $records->nextPageUrl()];
        }

        return Inertia::render('Admin', ['section' => $section, 'contents' => $contents, 'submissions' => $submissions, 'subscribers' => $subscribers, 'activity' => $activity, 'pagination' => $pagination, 'stats' => $stats, 'filters' => ['q' => $search, 'status' => $status], 'mediaAssets' => $section === 'media' ? DB::table('media_assets')->latest()->limit(100)->get() : [], 'relatedOptions' => Content::whereIn('type', ['books', 'programmes', 'events', 'articles', 'media'])->orderBy('title')->get(['id', 'type', 'title']), 'taxonomy' => Content::whereIn('type', ['categories', 'tags'])->orderBy('title')->get(['id', 'type', 'title']), 'homeCopyFields' => $section === 'settings' ? config('homepage.copy') : [], 'settings' => $section === 'settings' ? DB::table('settings')->pluck('value', 'key') : [], 'users' => $section === 'users' ? DB::table('users')->select('id', 'name', 'email', 'role')->get() : []]);
    }

    public function save(Request $r, ?Content $content = null)
    {
        $data = $r->validate(['type' => ['required', Rule::in(self::TYPES)], 'title' => 'required|string|max:200', 'slug' => ['required', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'max:200', Rule::unique('contents')->where('type', $r->input('type'))->ignore($content?->id)], 'excerpt' => 'nullable|string|max:1500', 'body' => 'nullable|string|max:100000', 'category' => 'nullable|string|max:150', 'category_id' => ['nullable', 'integer', Rule::exists('contents', 'id')->where('type', 'categories')], 'status' => 'required|in:draft,published,scheduled,archived,forthcoming', 'featured' => 'boolean', 'display_order' => 'integer|min:0', 'image' => 'nullable|string|max:2048', 'alt_text' => 'nullable|string|max:255', 'external_url' => 'nullable|url:http,https|max:2048', 'seo_title' => 'nullable|string|max:200', 'meta_description' => 'nullable|string|max:500', 'canonical_url' => 'nullable|url:http,https|max:2048', 'noindex' => 'boolean', 'tag_ids' => 'nullable|array|max:30', 'tag_ids.*' => ['integer', Rule::exists('contents', 'id')->where('type', 'tags')], 'related_ids' => 'nullable|array|max:12', 'related_ids.*' => ['integer', Rule::exists('contents', 'id')->whereIn('type', ['books', 'programmes', 'events', 'articles', 'media'])], 'published_at' => 'nullable|date', 'details' => 'nullable|array', 'details.duration' => 'nullable|string|max:100', 'details.format' => 'nullable|string|max:100', 'details.fee' => 'nullable|string|max:100', 'details.venue' => 'nullable|string|max:200', 'details.starts_at' => 'nullable|date', 'details.outcomes' => 'nullable|string|max:5000', 'details.audience' => 'nullable|string|max:1000', 'details.registration_opens_at' => 'nullable|date', 'details.registration_closes_at' => ['nullable', 'date', Rule::when($r->filled('details.registration_opens_at'), 'after_or_equal:details.registration_opens_at')], 'details.capacity' => 'nullable|integer|min:1', 'details.media_type' => 'nullable|in:video,audio,pdf,image,link', 'details.tags' => 'nullable|string|max:500', 'details.author_name' => 'nullable|string|max:150', 'details.major_lessons' => 'nullable|string|max:10000', 'details.ends_at' => ['nullable', 'date', Rule::when($r->filled('details.starts_at'), 'after_or_equal:details.starts_at')], 'details.timezone' => 'nullable|timezone', 'details.whatsapp_url' => 'nullable|url:https|max:2048', 'details.gallery' => 'nullable|string|max:20000', 'details.gallery_alt' => 'nullable|string|max:5000', 'details.person_name' => 'nullable|string|max:150', 'details.position' => 'nullable|string|max:150', 'details.organisation' => 'nullable|string|max:200', 'details.testimonial_type' => 'nullable|string|max:100', 'details.approval_status' => 'nullable|in:pending,approved,rejected', 'details.virtual_platform' => 'nullable|string|max:200', 'details.currency' => 'nullable|string|max:10']);
        if ($data['status'] === 'scheduled') {
            $r->validate(['published_at' => 'required|date|after:now']);
        }
        if ($data['type'] === 'testimonials' && in_array($data['status'], ['published', 'scheduled']) && ($data['details']['approval_status'] ?? 'pending') !== 'approved') {
            throw ValidationException::withMessages(['details.approval_status' => 'Approve the testimonial before publishing.']);
        }
        $reserved = DB::table('content_redirects')->where('type', $data['type'])->where('slug', $data['slug'])->when($content, fn ($q) => $q->where('content_id', '!=', $content->id))->exists();
        if ($reserved) {
            throw ValidationException::withMessages(['slug' => 'This URL is reserved by an existing redirect.']);
        }
        foreach (array_filter(explode("\n", $data['details']['gallery'] ?? '')) as $url) {
            if (! str_starts_with(trim($url), '/storage/') && (! filter_var(trim($url), FILTER_VALIDATE_URL) || ! in_array(parse_url(trim($url), PHP_URL_SCHEME), ['http', 'https']))) {
                throw ValidationException::withMessages(['details.gallery' => 'Use one valid image URL per line.']);
            }if (preg_match('/^(javascript|data):/i', trim($url))) {
                throw ValidationException::withMessages(['details.gallery' => 'Use HTTPS or uploaded images.']);
            }
        }
        $entry = DB::transaction(function () use ($data, $content) {
            $entry = $content ?? new Content;
            $oldType = $entry->type;
            $oldSlug = $entry->slug;
            $tags = $data['tag_ids'] ?? [];
            $related = array_filter($data['related_ids'] ?? [], fn ($id) => (int) $id !== $entry->id);
            unset($data['tag_ids'],$data['related_ids']);
            $timezone = $data['details']['timezone'] ?? 'Africa/Lusaka';
            $data['event_starts_at'] = ! empty($data['details']['starts_at']) ? Carbon::parse($data['details']['starts_at'], $timezone ?: 'Africa/Lusaka')->utc() : null;
            $data['event_ends_at'] = ! empty($data['details']['ends_at']) ? Carbon::parse($data['details']['ends_at'], $timezone ?: 'Africa/Lusaka')->utc() : null;
            if (! empty($data['category_id'])) {
                $data['category'] = Content::where('type', 'categories')->findOrFail($data['category_id'])->title;
            } elseif (! empty($data['category'])) {
                $data['category_id'] = Content::where('type', 'categories')->where('title', $data['category'])->value('id');
            }
            $entry->fill($data)->save();
            if ($entry->type === 'categories') {
                Content::where('category_id', $entry->id)->update(['category' => $entry->title]);
            }
            $entry->tags()->sync($tags);
            $entry->related()->sync($related);
            if ($oldSlug && ($oldSlug !== $entry->slug || $oldType !== $entry->type)) {
                DB::table('content_redirects')->updateOrInsert(['type' => $oldType, 'slug' => $oldSlug], ['content_id' => $entry->id]);
            }

            return $entry;
        });
        $this->log($r, 'Saved '.$data['status'], $data['title']);

        return back()->with('success', 'Content saved successfully.');
    }

    public function destroy(Request $r, Content $content)
    {
        $this->log($r, 'Deleted content', $content->title);
        if ($content->type === 'categories') {
            Content::where('category_id', $content->id)->update(['category' => null]);
        }
        $content->delete();

        return back()->with('success', 'Content deleted.');
    }

    public function updateSubmission(Request $r, Submission $submission)
    {
        $submission->update($r->validate(['status' => 'required|in:new,contacted,confirmed,closed', 'admin_notes' => 'nullable|string|max:10000']));
        $this->log($r, 'Updated enquiry', '#'.$submission->id);

        return back()->with('success', 'Enquiry updated.');
    }

    public function settings(Request $r)
    {
        abort_unless($r->user()->role === 'super_admin', 403);
        $data = $r->validate(['contact_email' => 'nullable|email', 'notification_email' => 'nullable|email', 'phone' => 'nullable|string|max:50', 'whatsapp' => 'nullable|regex:/^[0-9]{7,15}$/', 'location' => 'nullable|string|max:200', 'hero_title' => 'nullable|string|max:200', 'hero_description' => 'nullable|string|max:1000', 'seo_description' => 'nullable|string|max:500', 'analytics_id' => ['nullable', 'regex:/^G-[A-Z0-9]+$/'], 'search_console_verification' => 'nullable|string|max:200', 'instagram' => 'nullable|url:http,https', 'facebook' => 'nullable|url:http,https', 'linkedin' => 'nullable|url:http,https', 'youtube' => 'nullable|url:http,https', 'community_url' => 'nullable|url:https']);
        $extra = [];
        foreach (['contact', 'consultation', 'speaking', 'programme', 'event', 'book', 'partnership'] as $type) {
            $extra['notification_email_'.$type] = 'nullable|email';
            $extra['notification_enabled_'.$type] = 'nullable|in:0,1';
        }
        foreach (['home_eyebrow', 'home_sections', 'home_about_title', 'home_about_body', 'home_about_image', 'home_about_alt', 'home_consultation_title', 'home_consultation_body', 'home_speaking_title', 'home_speaking_body', 'home_journeys_title', 'home_vision_title', 'home_vision_body', 'home_newsletter_title', 'home_newsletter_body', 'home_final_cta'] as $key) {
            $extra[$key] = 'nullable|string|max:10000';
        }
        foreach (array_keys(config('homepage.copy')) as $key) {
            $extra[$key] = 'nullable|string|max:3000';
        }
        $extra['home_sections'] = ['nullable', 'string', function ($attribute, $value, $fail) {
            $allowed = ['hero', 'journeys', 'introduction', 'principles', 'vision', 'about', 'programmes', 'books', 'events', 'testimonials', 'articles', 'newsletter'];
            if (array_diff(array_map('trim', explode(',', $value)), $allowed)) {
                $fail('Choose valid homepage sections.');
            }
        }];
        $data = [...$data, ...$r->validate($extra)];
        foreach ($data as $key => $value) {
            DB::table('settings')->updateOrInsert(['key' => $key], ['value' => $value]);
        }
        Cache::forget('public_site_settings');
        $this->log($r, 'Updated', 'Site settings');

        return back()->with('success', 'Settings saved.');
    }

    public function upload(Request $r)
    {
        $r->validate(['file' => 'required|file|mimes:jpg,jpeg,png,webp,pdf,mp3|max:10240', 'alt_text' => 'required|string|max:255']);
        $asset = (new OptimizedMedia)->store($r->file('file'));
        DB::table('media_assets')->insert([...$asset, 'variants' => json_encode($asset['variants']), 'name' => $r->file('file')->getClientOriginalName(), 'alt_text' => $r->input('alt_text'), 'uploaded_by' => $r->user()->id, 'created_at' => now(), 'updated_at' => now()]);
        $this->log($r, 'Uploaded media', $asset['path']);

        return response()->json($asset);
    }

    public function exportSubscribers(Request $request)
    {
        return response()->streamDownload(function () {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Email', 'Consent recorded', 'Subscribed'], ',', '"', '');
            foreach (DB::table('subscribers')->where('status', 'subscribed')->orderBy('id')->cursor() as $subscriber) {
                $email = preg_match('/^[=+\-@\t\r]/', $subscriber->email) ? "'".$subscriber->email : $subscriber->email;
                fputcsv($out, [$email, $subscriber->consent_at, $subscriber->created_at], ',', '"', '');
            }fclose($out);
        }, 'subscribers.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function log(Request $r, string $action, string $subject)
    {
        DB::table('activity_logs')->insert(['user_id' => $r->user()->id, 'action' => $action, 'subject' => $subject, 'created_at' => now(), 'updated_at' => now()]);
    }
}
