# Implementation status

Local implementation is complete for the core website and administration workflows below. Production configuration, approved content, and stakeholder acceptance remain outstanding. This checklist maps to the original PRD/TRD; it does not represent production sign-off.

## Public website coverage

| PRD | Module | Implemented coverage |
| --- | --- | --- |
| 7.1.1 | Home | Editable hero/copy, configurable section visibility/order, introduction, vision, books, programmes, consultation/speaking pathways, upcoming events, approved testimonials, articles, newsletter and CTA. |
| 7.1.2 | About | Editable biography and other profile sections through Markdown, cover and multi-image gallery. Approved biography/photos still required. |
| 7.1.3 | Vision and mission | Editable page supporting objectives, values and institutional philosophy. |
| 7.1.4 | Books | Published/forthcoming listings, categories, covers, lessons, purchase/enquiry links and related content. |
| 7.1.5 | Consultations | Managed service areas; request form includes individual/organisation, service, challenge, date, method, contact and consent. |
| 7.1.6 | Programmes | Managed details, audience/outcomes, format/fee, registration windows/capacity, enquiry and registration workflows. |
| 7.1.7 | Speaking | Managed topics/profile content and invitation form including proposed topic, format and event information. |
| 7.1.8 | Events | Upcoming/past filters, explicit time zones and start/end dates, event details, registration and galleries. |
| 7.1.9 | Media/resources | Category filtering, covers, downloadable files, audio playback, YouTube embeds and related content. |
| 7.1.10 | Articles | Author, category, relational tags, search/filtering, scheduled publication and related content. |
| 7.1.11 | Social impact | Managed projects, descriptions, galleries and partnership enquiry paths. |
| 7.1.12 | Testimonials | Attribution fields and approval gate; unapproved testimonials cannot be published or scheduled publicly. |
| 7.1.13 | Partnerships | Managed partners and partnership enquiries. |
| 7.1.14 | Community/newsletter | Consent, deduplication, welcome email, signed unsubscribe/resubscribe, active-only CSV export and community links. |
| 7.1.15 | Contact | Editable contact/social information and validated category/subject/message form. |
| 7.1.16 | FAQ | Managed, ordered FAQs. |
| 7.1.17 | Policies | Editable policy pages and additional custom page routes. Approved legal text remains required. |

## Functional requirements

| Requirement | Status and evidence |
| --- | --- |
| FR-001 Authentication | Implemented: login/logout/reset, super administrator/editor roles, account management, self-lockout protection and session revocation. |
| FR-002 CMS | Implemented: module CRUD, safe Markdown preview, publishing states, ordering, featured content, linked categories/tags/related records, galleries and settings. Category renames update associated content. |
| FR-003 Forms | Implemented: validation, consent, honeypot/throttling, persistent inbox, notes/statuses, duplicate registration prevention, windows and capacity checks. |
| FR-004 Search | Implemented: server-side search, category/tag filters and pagination. |
| FR-005 Newsletter | Implemented: stored subscribers and export. Direct campaign-provider synchronization depends on provider selection; export supports import today. |
| FR-006 Media | Implemented: image/PDF/audio validation, originals retained, responsive WebP variants when GD is available, image dimension limits and galleries. Inventory currently shows the latest 100 uploads. |
| FR-007 SEO | Implemented: metadata, canonical override, noindex, social tags, structured data, sitemap, robots.txt and historical-slug 301 redirects. Redirects respect publication visibility. |
| FR-008 Analytics | Implemented: consent-gated GA4 and conversion events. Production account configuration and measurement verification remain required. |
| FR-009 WhatsApp | Implemented: configurable site/content links. Official number still required. |
| FR-010 Purchase/payment links | Implemented: external links and click tracking. Approved destination URLs still required. |
| FR-011 Scheduling | Implemented: due-publication command, scheduler and testimonial approval enforcement. Production scheduler supervision required. |
| FR-012 Notifications | Implemented: queued mail, per-form recipients/toggles, default recipient and newsletter welcome. Actual delivery requires production mail credentials and supervised queue workers. |
| FR-013 Backups | Strategy documented in README. Hosting backup jobs, off-site retention and restore drill remain outstanding. |

## Technical coverage and verification

- Laravel/Inertia/React/TypeScript application; original logo and navy/royal-blue/gold palette; responsive public site and admin dashboard.
- MySQL application migrations applied locally; SQLite-supported migrations and isolated automated tests. Existing `.env` configuration preserved.
- Content modules share an indexed content table with structured details and relational category/tag/related links. This intentionally adapts the suggested per-module schema.
- Markdown editing with raw HTML disabled; this is not a drag-and-drop page builder.
- Role checks, CSRF protection, upload validation, throttling, publication visibility controls, consent records, activity logs and baseline security headers.
- Indexed publication/event queries, cached public settings with invalidation, responsive images, used-image-only variant lookup and separate frontend page bundles.
- **47 backend tests / 342 assertions pass.** Coverage includes permissions, accounts, CRUD, visibility, scheduling, approvals, forms, registrations, newsletter, notification routing, category/tag relationships, redirects, SEO and image processing.
- TypeScript validation and production asset build pass.
- Isolated browser QA covers Chromium, Firefox and WebKit, desktop/tablet/mobile layouts, navigation, form submission, admin login/editing, upload variants and conversion tracking. See [QA report](docs/QA_REPORT.md) for results and limits.
- Automated accessibility checks supplement keyboard/dialog checks. Manual screen-reader testing and real-device UAT remain necessary.
- Local timing measurements are diagnostic only; field Core Web Vitals and production caching/compression must be verified on the deployment environment.

## Implementation plan handover

| Phase | State |
| --- | --- |
| 0 — Discovery/content | Requirements mapped; approved content, official links and legal copy pending. |
| 1–6 — Foundation through publishing | Core implementation complete and locally verified. |
| 7 — Integrations | Integration controls implemented; live mail, analytics and provider configuration pending. |
| 8 — Hardening | Local controls/checks implemented; production infrastructure validation pending. |
| 9 — QA/UAT | Automated backend/browser/accessibility checks complete as documented; stakeholder and real-device UAT pending. |
| 10 — Deployment/handover | Setup, publishing, backup and QA instructions provided; deployment, monitoring, restore drill and administrator training pending. |

## Required before production launch

1. Supply and approve biography, portraits, books, programmes, events, testimonials, partner/impact information and policy text. No invented achievements or testimonials are seeded.
2. Configure official contact details, recipients, community/social links and purchase/payment destinations.
3. Configure real mail delivery, supervised workers/scheduler, analytics/Search Console and verify consent behavior with approved policies.
4. Provision domain, Laravel-compatible hosting, HTTPS, secrets, monitoring and off-site backups; perform a restore drill.
5. Complete stakeholder UAT, real-device/assistive-technology checks, production performance checks and administrator training.

Member accounts/LMS, internal payment processing and advanced campaign synchronization remain later-phase enhancements. The current application has not been deployed or declared production-ready.

## Deployment preparation added

A read-only `app:check-production` command, production environment template, Supervisor worker and cron templates, [deployment/recovery runbook](docs/DEPLOYMENT_RUNBOOK.md) and [UAT checklist](docs/UAT_CHECKLIST.md) are now provided. These do not provision hosting or certify external services. Production domain, hosting access, approved content and live integration configuration are still pending.

## Operational verification and administrator handover

Database-worker mail rendering, scheduler registration/due publishing and rendered password-reset-link/reuse checks pass in the isolated test environment. The [administrator walkthrough](docs/ADMINISTRATOR_GUIDE.md) is available for training. Real inbox delivery requires a designated test recipient; no live messages were sent during this verification. Training and external operational acceptance remain pending, not implied by the automated checks.

## Direct public uploads

Uploads now use a real `public/storage` directory without symlinks. `uploads:prepare` migrates legacy files without changing saved URLs, retains originals and rejects conflicting destination files. Production checks now require a writable real upload directory. Deployment and backup instructions reflect this storage layout.
