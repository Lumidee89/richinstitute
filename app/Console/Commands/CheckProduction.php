<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckProduction extends Command
{
    protected $signature = 'app:check-production';

    protected $description = 'Check deployment configuration without modifying data or exposing secrets';

    public function handle(): int
    {
        $url = (string) config('app.url');
        $host = parse_url($url, PHP_URL_HOST);
        $mailer = config('mail.default');
        $checks = [
            'Production environment' => app()->environment('production'),
            'Debug disabled' => config('app.debug') === false,
            'Application key configured' => filled(config('app.key')),
            'Public HTTPS URL configured' => str_starts_with($url, 'https://') && $host && ! in_array($host, ['localhost', '127.0.0.1', 'example.com']) && ! str_ends_with($host, '.test'),
            'Secure session cookies' => config('session.secure') === true,
            'Persistent sessions' => in_array(config('session.driver'), ['database', 'redis', 'file']),
            'Persistent queue' => in_array(config('queue.default'), ['database', 'redis', 'sqs', 'beanstalkd']),
            'Persistent cache' => in_array(config('cache.default'), ['database', 'redis', 'file', 'memcached', 'dynamodb']),
            'Delivery mail transport selected' => in_array($mailer, ['smtp', 'ses', 'postmark', 'resend', 'sendmail']),
            'Real sender configured' => filter_var(config('mail.from.address'), FILTER_VALIDATE_EMAIL) && ! preg_match('/@(example\.(com|test)|localhost)$/i', (string) config('mail.from.address')),
            'Production assets built' => is_file(public_path('build/manifest.json')),
            'Vite development marker absent' => ! is_file(public_path('hot')),
            'Public storage linked' => is_link(public_path('storage')) && is_dir(public_path('storage')),
            'Runtime directories writable' => is_writable(storage_path()) && is_writable(base_path('bootstrap/cache')),
        ];
        if ($mailer === 'smtp') {
            $checks['SMTP host configured'] = filled(config('mail.mailers.smtp.host')) && ! in_array(config('mail.mailers.smtp.host'), ['127.0.0.1', 'localhost']);
        }
        foreach ($checks as $label => $passed) {
            $this->line(($passed ? 'PASS' : 'FAIL').'  '.$label);
        }
        $this->comment('Configuration checks only. Verify database access, mail delivery, worker/scheduler operation, backups and approved content separately.');

        return in_array(false, array_map(fn ($value) => (bool) $value, $checks), true) ? self::FAILURE : self::SUCCESS;
    }
}
