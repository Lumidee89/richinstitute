# Local QA report

Verification completed September 28, 2026 (America/Los_Angeles).

## Results

| Check | Result |
| --- | --- |
| Laravel feature suite | 47 tests, 342 assertions passed |
| TypeScript | Passed |
| Production Vite build | Passed |
| Chromium workflows | Passed |
| Firefox workflows | Passed |
| WebKit workflows | Passed |
| axe WCAG 2 A/AA and 2.1 AA rules | Zero violations on Home desktop, Contact mobile, Dashboard mobile and Settings desktop |

Browser checks used a dedicated SQLite QA database, in-memory mail and a separate random administrator. They did not insert test submissions into the application's MySQL database. External analytics and purchase destinations were intercepted locally.

## Tested workflows

- Desktop, tablet (768 px) and mobile (390 px) homepage layout, heading clipping/overflow and navigation.
- Forthcoming books, upcoming/past events, article tag filtering, authors and related content.
- Contact submission and confirmation in all three engines; consultation service/requester selectors and speaking fields.
- Administrator login, settings, book editor fields and keyboard Escape dismissal.
- Chromium media upload producing a WebP variant, resource creation, consent controls and purchase conversion event dispatch.
- Backend coverage for account/role protection, publication visibility, content CRUD, category renames/deletion, tags/relationships, scheduled approvals, historical redirects, canonical/noindex/sitemap/robots behavior, request validation, capacity/duplicate registration checks, newsletter preferences, notification settings and optimized media.

Accessibility findings corrected during QA included low-contrast secondary text and an image-role container containing an interactive link. The four final audited views had no reported violations under the selected rules.

## Performance sample and limits

The final local Chromium homepage sample measured 110 ms DOMContentLoaded and 110 ms load, with 1,185,628 transferred resource bytes. These values are a local development-server observation, not a production benchmark or field Core Web Vitals result. Hosting compression, caching, network latency and approved content will affect production performance.

Engine tests do not replace testing actual Safari/Edge releases or physical mobile devices. Automated axe results are limited to the rendered views and selected rules; manual keyboard/screen-reader review and stakeholder UAT remain launch tasks. Real email delivery, third-party analytics ingestion, external checkout, production backups and disaster recovery require their configured external environments.

## Reproduction

See the **Isolated multi-browser QA** instructions in [README](../README.md). The browser runner writes detailed JSON to `/private/tmp/dr-rich-qa-report.json` and screenshots to the same temporary directory. Backend checks use `php artisan test`; static/build checks use `npm run typecheck` and `npm run build`.

## Deployment preparation verification

The expanded backend suite includes production-check rejection of development defaults and detection of secure configuration values. All 44 tests / 321 assertions pass. Running `app:check-production` locally correctly reported development environment/debug/URL/cookie settings and the Vite marker as failing production checks. It detected a selected delivery transport, sender and SMTP host; no live mail was sent and no external connectivity is implied. The earlier browser/build results above remain unchanged; this follow-up added operational files and a console command only.

## Operational workflow verification

Three additional tests pass (21 assertions): database-backed notification jobs are serialized and processed by the worker into the in-memory mail transport with an empty queue and no failed jobs; the scheduled publishing registration uses every-minute execution and overlap protection, and its command publishes due content while retaining future drafts; a reset link extracted from the rendered email changes the password and cannot be reused. The scheduler command is invoked in-process to share the isolated test database; this does not certify an installed cron service.

The complete backend suite now passes 47 tests / 342 assertions. These checks do not send external messages. Live inbox delivery awaits a user-designated recipient. The administrator guide is prepared; human training, real-device/screen-reader testing, external monitoring, off-site backup restoration and stakeholder sign-off remain pending.
