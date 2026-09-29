<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Deliberately no public claims, testimonials, or shared-password accounts.
        // Create an administrator using php artisan admin:create.
    }
}
