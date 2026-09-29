# Dr. Rich Global

Laravel 13 + Inertia 3 + React 19 + TypeScript + Tailwind CSS 4. A public website and authenticated publishing workspace, styled from the supplied logo and UI references.

## Run locally

Requirements: PHP 8.3+, Composer, Node.js 22.12+ (Node 24 recommended), SQLite or MySQL.

```sh
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
npm run build
php artisan serve --host=127.0.0.1 --port=8000
```

The website is at http://127.0.0.1:8000 and the dashboard at http://127.0.0.1:8000/admin.

For frontend development, also run `npm run dev`. The example environment defaults to SQLite. This workspace is now configured to use your local MySQL database; its connection settings in `.env` have been preserved. Set `DB_*` as appropriate for each environment.

## Administrator account

```sh
php artisan admin:create admin@your-domain.com --name="Administrator"
```

The command securely prompts for a password of at least 12 characters. No shared-password account is seeded. For local development only, `php artisan admin:local` creates a random-password account and writes its credentials to `storage/app/local-admin.json` (ignored by version control, readable only by the local owner). This has already been run in the initial development workspace.

## Content management

- Open a module and choose **Create**. Add title, slug, summary, body, cover, category, and SEO fields.
- Save as **draft** until the content is approved. Drafts, archived items, and future publications are unavailable publicly, including by direct URL.
- Choose **published** to publish immediately, or **scheduled** with a future publication date. Run the scheduler for scheduled publishing.
- Upload JPEG, PNG, WebP, PDF, or MP3 files up to 10 MB. PDFs and audio use the resource link; images use the cover field.
- For editable site and policy pages, use the **Site content** module with the route slug: `home` (homepage introduction), `about`, `vision-mission`, `privacy-policy`, `terms`, `cookie-policy`, `disclaimer`, or `refund-policy`.
- The editor supports Markdown formatting, toolbar shortcuts, and live preview. Raw HTML is disabled for safe rendering.
- Enquiries include consultation, speaking, book, event, programme, partnership, and general contact requests. Review them in **Enquiries**, update their status, and add internal notes.
- Newsletter signups record consent, deduplicate email addresses, and queue a welcome email with a signed unsubscribe link. **Community** exports currently subscribed addresses only.
- Event and programme details include optional registration opening/closing dates and capacity. Duplicate active registrations are rejected.
- The media library lists uploaded assets, including alt text, file size, and type. Resource URLs can embed YouTube videos or audio.
- Public search and administrative lists are paginated and filtered on the server.
- Set an optional GA4 measurement ID and Search Console verification token in Settings. Analytics loads only after consent; visitors can reopen **Privacy choices** in the footer.
- Homepage headline (one line per row) and description can be changed in Settings. Publish a Site content record with slug `home` to replace its introduction.
- Super administrators can update site/contact settings. Editors can manage content and enquiries, but cannot edit settings or view administrator accounts.
- Super administrators can create, update, and remove accounts in **Administrators**. The system prevents deleting or demoting your own account and preserves at least one super administrator. Password/role changes revoke other database-backed sessions.

## Notifications and scheduled publishing

Local mail uses Laravel's log mailer. Configure `MAIL_*` for an actual SMTP or API mail provider before launch, and set **Notification email** in dashboard settings. Enquiries are stored before notifications are queued. A failed delivery does not remove the enquiry.

```sh
php artisan queue:work --tries=3
php artisan schedule:work
```

In production, supervise the queue worker and run `php artisan schedule:run` every minute via cron. Password reset links use the same configured mail transport. Monitor `php artisan queue:failed` and retry failures once delivery is fixed.

## Verification

```sh
npm run typecheck
npm run build
php artisan test
```

Optional local browser verification (requires Playwright Chromium and a running local server):

```sh
php artisan admin:local
node scripts/browser-check.mjs
```

The browser check verifies desktop/mobile layouts, creates/publishes/views/deletes a temporary article, and creates/removes a temporary editor account. Run it only against the local development database. Screenshots are written to the operating system temporary directory.

## Production handover

1. Use Laravel-compatible hosting with the web root set to `public/`.
2. Configure HTTPS, `APP_ENV=production`, `APP_DEBUG=false`, the real `APP_URL`, `SESSION_SECURE_COOKIE=true`, production database, and mail settings.
3. Run `composer install --no-dev --optimize-autoloader`, `npm ci`, `npm run build`, `php artisan migrate --force`, `php artisan storage:link`, and `php artisan optimize`.
4. Create a production administrator with `admin:create`; do not copy the local database or local credentials.
5. Configure the queue worker, scheduler, access logs, monitoring, and backups.
6. Publish approved biography, photographs, books, programmes, events, policies, contact details, and external payment/community links.
7. Verify email delivery and all registration/contact workflows on the production domain.
8. Complete the outstanding items in `IMPLEMENTATION_STATUS.md` before declaring the full PRD launch-ready.

## Backup and restore

Back up the database and `storage/app/public` daily to encrypted, access-controlled off-site storage. Keep environment secrets separately in a secret manager. Suggested retention: 7 daily, 4 weekly, 3 monthly snapshots. Use consistent database snapshots (`mysqldump --single-transaction` for MySQL or SQLite's `.backup` command). Test restoration to a separate database and storage directory monthly, then check login, published content, and uploaded files. Backup jobs and retention must be configured with the chosen hosting provider; this repository does not provision infrastructure.

## Assets

- Original logo: `drlogo.png`; public copy: `public/drlogo.png`.
- Palette: navy `#102433`, royal blue `#2058b5`, gold `#b8994f`, warm white `#f7f6f1`.
- The home hero uses a locally stored mountain landscape originally sourced from Unsplash as an aspirational visual, not as a photograph of Dr. Rich or an institutional event. Replace it with approved photography when available.

Photo source: https://images.unsplash.com/photo-1464822759023-fed622ff2c3b (local asset: `public/images/mountain-perspective.jpg`).

## Extended publishing controls

- Categories are linked records; renaming one updates assigned content. Select tags and related records in the editor. Only publicly visible related records appear to visitors.
- Forthcoming books appear publicly with a forthcoming label. Testimonials require **Approved** review status before publication or scheduling.
- Event start/end times use the selected IANA time zone (for example `Africa/Accra`); they are stored in UTC for upcoming/past filtering. Publication scheduling uses the application's configured time zone.
- Add gallery image URLs and descriptions through the module fields. Images uploaded with GD support retain their original and receive responsive WebP variants. Images above 12 megapixels are rejected to constrain processing memory.
- Changing a published content slug preserves its earlier URL as a permanent redirect. Archived/private content remains inaccessible through old URLs. Historical slugs are reserved against conflicting reuse.
- Use canonical URL overrides when appropriate and **Noindex** to exclude a page from indexing and the sitemap. Custom Site content slugs can create additional top-level pages without overriding existing application routes.
- Settings controls homepage copy, imagery and section order/visibility. Per-form notification controls support individual recipients or the default notification email.

## Isolated multi-browser QA

These fixtures refuse to run outside the dedicated testing SQLite database. They do not use the application's MySQL data. The fixture command resets the dedicated QA database and removes its previous uploaded test assets.

```sh
npx playwright install chromium firefox webkit
npm run build
APP_ENV=testing APP_CONFIG_CACHE=/private/tmp/dr-rich-qa-config.php DB_CONNECTION=sqlite DB_DATABASE=/private/tmp/dr-rich-qa.sqlite CACHE_STORE=array QUEUE_CONNECTION=sync MAIL_MAILER=array php scripts/qa-fixtures.php
APP_ENV=testing APP_CONFIG_CACHE=/private/tmp/dr-rich-qa-config.php APP_URL=http://127.0.0.1:8123 DB_CONNECTION=sqlite DB_DATABASE=/private/tmp/dr-rich-qa.sqlite CACHE_STORE=array QUEUE_CONNECTION=sync MAIL_MAILER=array php artisan serve --host=127.0.0.1 --port=8123
```

With that server running, execute `node scripts/qa-browser.mjs` in another terminal. Results and screenshots are written to `/private/tmp/dr-rich-qa-*`. This macOS/local workflow uses in-memory mail and a separate random QA administrator. Stop the QA server afterward. To remove QA uploads, rerun the fixture command with `--cleanup` appended. The QA suite uses production assets even when the normal Vite development server is running.

## Deployment preparation

Run `php artisan app:check-production` for a read-only configuration check (development environments intentionally fail production checks). It does not print secrets or send mail. Use the [deployment runbook](docs/DEPLOYMENT_RUNBOOK.md), templates in `deployment/`, and [stakeholder UAT checklist](docs/UAT_CHECKLIST.md) when the hosting target is selected. The templates have not been applied to a production server.

## Administrator handover and operational checks

The [administrator guide](docs/ADMINISTRATOR_GUIDE.md) explains publishing, events, enquiries, subscribers, settings and training exercises. The isolated operational checks can be run with `php artisan test --filter=OperationalWorkflowTest`. They process serialized notifications through the database queue into an in-memory mail transport, verify scheduler registration/due publishing and exercise a rendered password-reset link. They do not send email or certify a production worker installation.
