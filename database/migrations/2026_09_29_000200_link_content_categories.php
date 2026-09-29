<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contents', fn (Blueprint $t) => $t->foreignId('category_id')->nullable()->constrained('contents')->nullOnDelete());
        foreach (DB::table('contents')->where('type', 'categories')->get(['id', 'title']) as $category) {
            DB::table('contents')->where('category', $category->title)->update(['category_id' => $category->id]);
        }
    }

    public function down(): void
    {
        Schema::table('contents', fn (Blueprint $t) => $t->dropConstrainedForeignId('category_id'));
    }
};
