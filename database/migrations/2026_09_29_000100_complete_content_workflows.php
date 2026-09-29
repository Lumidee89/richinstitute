<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contents', function (Blueprint $t) {
            $t->string('canonical_url', 2048)->nullable();
            $t->boolean('noindex')->default(false);
            $t->timestamp('event_starts_at')->nullable()->index();
            $t->timestamp('event_ends_at')->nullable()->index();
            $t->index(['type', 'status', 'display_order']);
        });
        Schema::create('content_tag', function (Blueprint $t) {
            $t->foreignId('content_id')->constrained('contents')->cascadeOnDelete();
            $t->foreignId('tag_id')->constrained('contents')->cascadeOnDelete();
            $t->primary(['content_id', 'tag_id']);
        });
        Schema::create('content_related', function (Blueprint $t) {
            $t->foreignId('content_id')->constrained('contents')->cascadeOnDelete();
            $t->foreignId('related_id')->constrained('contents')->cascadeOnDelete();
            $t->primary(['content_id', 'related_id']);
        });
        Schema::create('content_redirects', function (Blueprint $t) {
            $t->id();
            $t->string('type');
            $t->string('slug');
            $t->foreignId('content_id')->constrained('contents')->cascadeOnDelete();
            $t->unique(['type', 'slug']);
        });
        Schema::table('media_assets', function (Blueprint $t) {
            $t->string('original_path')->nullable();
            $t->json('variants')->nullable();
        });
        foreach (DB::table('contents')->where('type', 'events')->get() as $record) {
            $details = json_decode($record->details ?? '{}', true);
            if (! empty($details['starts_at'])) {
                try {
                    DB::table('contents')->where('id', $record->id)->update(['event_starts_at' => Carbon::parse($details['starts_at'], $details['timezone'] ?? 'Africa/Lusaka')->utc()]);
                } catch (Throwable) { /* Leave invalid legacy dates for editorial review. */
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('content_redirects');
        Schema::dropIfExists('content_related');
        Schema::dropIfExists('content_tag');
        Schema::table('contents', function (Blueprint $t) {
            $t->dropIndex(['type', 'status', 'display_order']);
            $t->dropColumn(['canonical_url', 'noindex', 'event_starts_at', 'event_ends_at']);
        });
        Schema::table('media_assets', fn (Blueprint $t) => $t->dropColumn(['original_path', 'variants']));
    }
};
