<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicSettingsCacheTest extends TestCase
{
    use RefreshDatabase;

    public function test_settings_survive_database_cache_round_trip_without_object_deserialization(): void
    {
        $this->withoutVite();
        config(['cache.default' => 'database', 'cache.serializable_classes' => false]);
        DB::table('settings')->insert([
            ['key' => 'home_about_image', 'value' => '/storage/media/about.webp'],
            ['key' => 'notification_email', 'value' => 'private@example.test'],
        ]);
        $this->get('/')->assertOk();
        $this->assertIsArray(Cache::get('public_site_settings'));
        $this->get('/consultations')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('settings.home_about_image', '/storage/media/about.webp')
            ->missing('settings.notification_email'));
    }

    public function test_legacy_incomplete_cached_object_is_replaced_with_fresh_plain_settings(): void
    {
        $this->withoutVite();
        config(['cache.default' => 'database', 'cache.serializable_classes' => false]);
        DB::table('settings')->insert(['key' => 'hero_title', 'value' => 'Current title']);
        Cache::put('public_site_settings', collect(['hero_title' => 'Old title']), 60);
        $this->assertInstanceOf(\__PHP_Incomplete_Class::class, Cache::get('public_site_settings'));
        $this->get('/consultations')->assertOk()->assertInertia(fn (Assert $page) => $page->where('settings.hero_title', 'Current title'));
        $this->assertSame(['hero_title' => 'Current title'], Cache::get('public_site_settings'));
        $this->get('/contact')->assertOk();
    }
}
