<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\File;
use Tests\TestCase;

class PublicUploadsTest extends TestCase
{
    public function test_preparation_copies_files_preserves_urls_and_refuses_conflicts(): void
    {
        $root = sys_get_temp_dir().'/rich-uploads-'.bin2hex(random_bytes(8));
        $oldPublic = public_path();
        $oldStorage = storage_path();
        try {
            $this->app->usePublicPath($root.'/public');
            $this->app->useStoragePath($root.'/storage');
            File::ensureDirectoryExists(storage_path('app/public/media'));
            file_put_contents(storage_path('app/public/media/test.pdf'), 'original-upload');
            $this->artisan('uploads:prepare')->assertSuccessful();
            $this->assertFalse(is_link(public_path('storage')));
            $this->assertSame('original-upload', file_get_contents(public_path('storage/media/test.pdf')));
            $this->assertFileExists(storage_path('app/public/media/test.pdf'));
            $this->artisan('uploads:prepare')->assertSuccessful();
            file_put_contents(public_path('storage/media/test.pdf'), 'newer-upload');
            $this->artisan('uploads:prepare')->assertFailed();
            $this->assertSame('newer-upload', file_get_contents(public_path('storage/media/test.pdf')));
        } finally {
            $this->app->usePublicPath($oldPublic);
            $this->app->useStoragePath($oldStorage);
            File::deleteDirectory($root);
        }
    }

    public function test_preparation_replaces_legacy_symlink_with_real_directory(): void
    {
        $root = sys_get_temp_dir().'/rich-uploads-'.bin2hex(random_bytes(8));
        $oldPublic = public_path();
        $oldStorage = storage_path();
        try {
            $this->app->usePublicPath($root.'/public');
            $this->app->useStoragePath($root.'/storage');
            File::ensureDirectoryExists(storage_path('app/public/media'));
            File::ensureDirectoryExists(public_path());
            file_put_contents(storage_path('app/public/media/image.webp'), 'test-image');
            symlink(storage_path('app/public'), public_path('storage'));
            $this->artisan('uploads:prepare')->assertSuccessful();
            clearstatcache();
            $this->assertFalse(is_link(public_path('storage')));
            $this->assertSame('test-image', file_get_contents(public_path('storage/media/image.webp')));
            $this->assertFileExists(storage_path('app/public/media/image.webp'));
        } finally {
            $this->app->usePublicPath($oldPublic);
            $this->app->useStoragePath($oldStorage);
            File::deleteDirectory($root);
        }
    }

    public function test_public_disk_uses_direct_public_directory(): void
    {
        $this->assertSame(public_path('storage'), config('filesystems.disks.public.root'));
        $this->assertSame([], config('filesystems.links'));
    }
}
