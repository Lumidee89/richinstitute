# Deployment and operations runbook

This is a prepared handover, not a record of a completed deployment. Select the hosting target and substitute its paths, domain and service user before applying these instructions. Never copy the local administrator credentials or development database into production.

## Configuration and first deployment

1. Provision a Laravel-compatible PHP 8.4+ host with the extensions required by Composer, GD for optimized images, MySQL, HTTPS and a web root pointing exclusively to `public/`. Restrict write permissions to `storage/` and `bootstrap/cache/` for the application user. Do not make the entire repository writable by the web server.
2. Create production configuration using [the environment template](../deployment/production.env.example). Store the completed `.env` only on the host or in its secret manager, with restricted permissions. Fill in a least-privilege database account and actual SMTP settings. The template uses implicit TLS on port 465; use your provider's prescribed transport settings.
3. Install dependencies with `composer install --no-dev --optimize-autoloader`. Build assets with `npm ci` and `npm run build` in the build environment. Do not ship `public/hot`, test fixtures, local credential files or a local database.
4. Generate the application key once with `php artisan key:generate` for a new installation. Preserve that key on subsequent releases and include it in protected recovery materials.
5. Run `php artisan migrate --force`, `php artisan uploads:prepare` and `php artisan optimize`. For subsequent deployments, take a verified backup before migrating. Keep persistent uploads and the production `.env` across releases.
6. Create the administrator with `php artisan admin:create your-address@your-domain.com`. It prompts securely for a password.
7. Adapt/install [the Supervisor worker template](../deployment/queue-worker.conf) and [scheduler crontab](../deployment/scheduler.cron). Configure log rotation for the scheduler log. Restart workers with `php artisan queue:restart` after each release; the supervisor must restart exiting workers. Confirm the worker timeout remains below the queue connection's retry-after value.
8. Run `php artisan app:check-production`. It reports labels only, never configuration values or secrets, and exits nonzero when checks fail. Passing checks confirm configuration, not external connectivity or delivery.

If HTTPS terminates at a proxy, configure trusted proxy addresses for the chosen hosting topology and verify generated URLs/cookies through that proxy. Do not blindly trust arbitrary forwarded headers.

## Acceptance checks on the deployed environment

- Check `/up`, homepage, one published detail page, `/sitemap.xml` and `/robots.txt`. Monitor `/up` for application availability; it is not a comprehensive database, email or queue health check.
- Confirm HTTPS redirects, secure session cookies, administrator login/logout/password reset and no debug error output. Check that private content cannot be reached using current or historical URLs.
- Upload an image and verify it remains accessible after a release. Verify the real public upload directory and responsive image variants.
- Configure notification recipients in Settings. With explicit approval to send live test messages, submit an enquiry to a controlled address, verify delivery and inbox persistence, then test password reset and newsletter unsubscribe.
- Inspect `php artisan queue:failed`, worker logs and `php artisan schedule:list`. Publish a controlled scheduled draft and confirm it becomes public at the expected time.
- Configure GA4/Search Console and verify consent behavior and real analytics events. Check approved purchase/community/WhatsApp links.
- Complete [the UAT checklist](UAT_CHECKLIST.md). Record actual results and approver; do not mark placeholders as approved.

## Backup and recovery

Use the hosting provider's automated database snapshots plus encrypted off-site backups of `public/storage`. Keep the application key and other secrets separately in a protected secret manager. Suggested retention is 7 daily, 4 weekly and 3 monthly backups. Restrict backup access and monitor failures. A database-only backup cannot recover uploaded files.

Before launch, restore a selected backup to an isolated database and storage location. Disable outbound mail/analytics on the restore environment, use separate credentials and a non-public hostname, then verify login, content counts, publication visibility and uploaded file checksums. Record the backup timestamp, recovery duration, data-loss window and owner. Agree recovery objectives with the site owner; no recovery objective is guaranteed until measured.

For a bad release, place the site in maintenance if needed, retain diagnostic logs and restore the previous application release. Database migrations may be incompatible with older code: review them before rolling back and use the verified recovery procedure when necessary. Do not automatically run destructive migration rollbacks on production data.

## Ongoing operations

Review failed jobs and application errors daily, patch dependencies through the test/build workflow, check backup completion daily and rehearse recovery monthly. Review administrator access periodically. Keep approved content and purchase/event links current. Alerting, off-site storage, live delivery, domain and hosting remain provider-specific configuration tasks.
