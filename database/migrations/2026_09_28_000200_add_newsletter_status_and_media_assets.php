<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscribers', function (Blueprint $t) {
            $t->string('status')->default('subscribed')->index();
            $t->timestamp('unsubscribed_at')->nullable();
        });
        Schema::create('media_assets', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('path')->unique();
            $t->string('mime_type');
            $t->unsignedBigInteger('size');
            $t->string('alt_text');
            $t->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
        Schema::table('subscribers', fn (Blueprint $t) => $t->dropColumn(['status', 'unsubscribed_at']));
    }
};
