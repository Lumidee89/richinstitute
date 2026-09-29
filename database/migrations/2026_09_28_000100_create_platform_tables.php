<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $t) => $t->string('role')->default('editor'));
        Schema::create('contents', function (Blueprint $t) {
            $t->id();
            $t->string('type')->index();
            $t->string('title');
            $t->string('slug');
            $t->text('excerpt')->nullable();
            $t->longText('body')->nullable();
            $t->string('category')->nullable();
            $t->string('status')->default('draft')->index();
            $t->boolean('featured')->default(false);
            $t->integer('display_order')->default(0);
            $t->string('image')->nullable();
            $t->string('alt_text')->nullable();
            $t->string('external_url')->nullable();
            $t->string('seo_title')->nullable();
            $t->text('meta_description')->nullable();
            $t->timestamp('published_at')->nullable();
            $t->json('details')->nullable();
            $t->timestamps();
            $t->unique(['type', 'slug']);
        });
        Schema::create('submissions', function (Blueprint $t) {
            $t->id();
            $t->string('type')->index();
            $t->foreignId('content_id')->nullable()->constrained('contents')->nullOnDelete();
            $t->string('name');
            $t->string('email');
            $t->string('phone')->nullable();
            $t->text('message')->nullable();
            $t->json('details')->nullable();
            $t->timestamp('consent_at');
            $t->string('status')->default('new')->index();
            $t->text('admin_notes')->nullable();
            $t->timestamps();
        });
        Schema::create('subscribers', function (Blueprint $t) {
            $t->id();
            $t->string('email')->unique();
            $t->timestamp('consent_at');
            $t->timestamps();
        });
        Schema::create('settings', function (Blueprint $t) {
            $t->id();
            $t->string('key')->unique();
            $t->text('value')->nullable();
        });
        Schema::create('activity_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->string('action');
            $t->string('subject');
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['activity_logs', 'settings', 'subscribers', 'submissions', 'contents'] as $table) {
            Schema::dropIfExists($table);
        }Schema::table('users', fn (Blueprint $t) => $t->dropColumn('role'));
    }
};
