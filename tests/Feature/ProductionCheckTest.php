<?php

namespace Tests\Feature;

use Tests\TestCase;

class ProductionCheckTest extends TestCase
{
    public function test_preflight_rejects_development_defaults_without_printing_secrets(): void
    {
        config(['app.debug' => true, 'app.key' => 'private-key-must-not-print', 'session.secure' => false, 'queue.default' => 'sync', 'mail.default' => 'log']);
        $this->artisan('app:check-production')
            ->expectsOutput('FAIL  Production environment')
            ->expectsOutput('FAIL  Debug disabled')
            ->expectsOutput('FAIL  Secure session cookies')
            ->expectsOutput('FAIL  Persistent queue')
            ->expectsOutput('FAIL  Delivery mail transport selected')
            ->doesntExpectOutputToContain('private-key-must-not-print')
            ->assertFailed();
    }

    public function test_preflight_accepts_secure_configuration_checks_but_still_requires_production_environment(): void
    {
        config(['app.debug' => false, 'app.url' => 'https://www.drrichglobal.org', 'session.secure' => true, 'queue.default' => 'database', 'cache.default' => 'database', 'mail.default' => 'smtp', 'mail.mailers.smtp.host' => 'smtp.provider.test', 'mail.from.address' => 'hello@drrichglobal.org']);
        $this->artisan('app:check-production')
            ->expectsOutput('FAIL  Production environment')
            ->expectsOutput('PASS  Public HTTPS URL configured')
            ->expectsOutput('PASS  Secure session cookies')
            ->expectsOutput('PASS  Persistent queue')
            ->expectsOutput('PASS  SMTP host configured')
            ->assertFailed();
    }
}
