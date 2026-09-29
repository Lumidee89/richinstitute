# Administrator walkthrough

This guide supports the handover session. Training and stakeholder acceptance are not complete until the site administrators have performed the exercises themselves.

## Sign in and account access

Open `/admin` and sign in with your individual account. Use the password-reset flow if needed; delivery depends on the configured email service. Keep the local development credential file private and never distribute it as a production account.

Editors manage content and enquiries. Super administrators also manage site settings and administrator accounts. Use an editor account for routine publishing. In **Administrators**, a super administrator can create or update accounts; passwords must contain at least 12 characters. The application prevents removing or demoting your own account and preserves at least one super administrator. Password/role changes revoke other database-backed sessions.

## Create and publish content

1. Choose the relevant module, then **Create**. Enter the title, URL slug, summary and body. The body supports Markdown; use the preview to inspect formatting. Raw HTML is disabled.
2. Add a cover and meaningful image description. Complete the module-specific fields, such as book lessons/author, programme outcomes or event start/end time and time zone.
3. Select categories, tags and related items where available. Category names are linked: a category rename updates assigned content. Related items appear publicly only when visible.
4. Save as **draft**, then reopen and review. Check names, claims, links, spelling, images and permissions to publish.
5. Choose **published** to release the entry, or **scheduled** with its publication time. Scheduling requires the background scheduler. Publication times use the application's time zone; event dates use the event's explicitly selected time zone.
6. Open the public page and check it on desktop and mobile. Verify download, purchase or registration links.

Draft and archived entries are private. Forthcoming status makes books public with a forthcoming label. Testimonials must have **Approved** review status before publishing or scheduling. Archiving removes public visibility, including through historical URLs.

Changing a slug preserves the previous URL as a permanent redirect. Historical slugs cannot be reused by a different entry. Prefer stable URLs. Canonical overrides and noindex affect search visibility; use them deliberately. Noindex excludes the entry from the sitemap but does not make a published page private.

## Images, galleries and resources

Upload JPEG, PNG, WebP, PDF or MP3 files up to 10 MB. Image uploads above 12 megapixels are rejected. With GD available, image originals are retained and responsive WebP variants are generated. Use descriptive alt text for informative images.

Gallery fields accept local `/storage/` paths and HTTP(S) URLs with descriptions. Verify every image is accessible. Media inventory currently shows the latest 100 uploads. Resource links can provide downloadable files, audio and supported YouTube embeds. Test external links after saving.

## Homepage and permanent pages

A super administrator can change homepage copy, imagery, section order and section visibility in **Settings**. Save and inspect the homepage afterward. Some sections need published records to display useful content.

Use **Site content** for biography, vision and policy pages. Standard slugs include `about`, `vision-mission`, `privacy-policy`, `terms`, `cookie-policy`, `disclaimer` and `refund-policy`. The `home` record supplies the homepage introduction. Additional custom page slugs cannot override reserved application routes.

## Enquiries and registrations

Open **Enquiries**, review the visitor's details and update the status:

| Status | Intended use |
| --- | --- |
| New | Received and awaiting review |
| Contacted | A team member has followed up |
| Confirmed | Participation or next steps have been confirmed |
| Closed | No further action is required |

Use internal notes to record follow-up. Status changes do not send a visitor reply automatically. Follow your organisation's communication and data-retention policies.

Event/programme registrations enforce opening/closing windows, capacity and duplicate active registration checks. A closed registration no longer occupies active capacity; closing it can allow the same visitor to register again. These records collect interest/registrations and do not verify payment.

Configure the default notification email and per-form recipient/toggle in **Settings**. A per-form recipient overrides the default. Notification delivery requires the mail service and running queue worker. If email is missing, check the inbox first: the enquiry is stored before notification dispatch.

## Newsletter and analytics

**Community** exports currently subscribed addresses only. Handle the CSV as personal information. An unsubscribe link is included in welcome mail. When importing subscribers into another campaign service, synchronize opt-outs and include the campaign provider's unsubscribe mechanism; direct campaign synchronization is not implemented.

Set GA4 and Search Console values in **Settings**. Analytics is consent-gated, so declined tracking will not produce analytics events. Visitors can reopen **Privacy choices** in the footer. Analytics configuration does not replace legal review of consent text.

## Routine administration

- Review new enquiries and keep follow-up statuses current.
- Check event dates, registration availability and external purchase links.
- Review scheduled content and testimonial approvals before release.
- Keep administrator access current and report unexpected activity.
- Ask the operator to investigate missed emails, failed jobs, unavailable uploads or scheduler delays. Operational commands and backup procedures are in the deployment runbook.

## Handover exercises

On a staging/test environment, have each administrator create and revise a draft, upload a cover, assign a category/tag, publish and archive the entry, schedule an article, review an enquiry, export active subscribers and locate password reset. Have the super administrator reorder a homepage section and manage a temporary editor account. Confirm public visibility and permissions after each step.

Record the trainer, administrator, date, unresolved questions and acceptance in the UAT checklist. Delete temporary training records afterward. Do not use real customer data for training.
