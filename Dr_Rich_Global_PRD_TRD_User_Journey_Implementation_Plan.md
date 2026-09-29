# Dr. Rich Global Website
## Product Requirements Document (PRD), Technical Requirements Document (TRD), User Journey Flow, and Implementation Plan

**Preferred Stack:** Laravel + Inertia.js + React (TSX) + TypeScript  
**Project:** Dr. Rich Global — Human Transformation and Wealth Institute  
**Primary Location:** Lusaka, Zambia  
**Primary Website Message:** *Liberate Your Mind. Transform Your Life. Create a Different Future.*

---

# PART 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Product Overview

Dr. Rich Global requires a premium institutional and personal-brand website that functions as the central digital platform for Dr. Rich’s books, programmes, consultations, speaking engagements, events, teachings, media resources, articles, partnerships, social-impact initiatives, and transformational work.

The website will position Dr. Rich professionally as an entrepreneur, author, speaker, consultant, transformational thinker, business leader, and advocate for human development and wealth creation.

The platform must combine:

- A premium public-facing website
- A content-management system
- A secure administrative dashboard
- Enquiry and lead-generation workflows
- Consultation requests
- Speaking invitation requests
- Programme registrations
- Event registrations
- Book/publication management
- Blog/article publishing
- Media/resource publishing
- Newsletter/community acquisition
- Basic analytics, SEO, security, and backups

The website must be designed so that ordinary content updates can be handled by the administrator without developer intervention.

---

## 2. Product Vision

Build a trusted, premium, modern digital presence for Dr. Rich Global that communicates authority, transformation, purpose, entrepreneurship, leadership, practical wisdom, and sustainable wealth creation while converting visitors into readers, subscribers, programme participants, consultation leads, speaking enquiries, event attendees, partners, and community members.

---

## 3. Business Objectives

The platform should:

1. Establish a professional international digital identity for Dr. Rich Global.
2. Clearly communicate the organisation’s vision, mission, values, philosophy, and transformational message.
3. Position Dr. Rich for consultations, speaking engagements, institutional partnerships, and media opportunities.
4. Promote books and publications.
5. Promote and register participants for programmes and masterclasses.
6. Promote events and collect registrations.
7. Publish articles, teachings, media, videos, and downloadable resources.
8. Capture qualified leads from individuals and organisations.
9. Build an email/newsletter and approved WhatsApp community audience.
10. Showcase approved testimonials and impact stories.
11. Support future expansion across Zambia, Africa, and international audiences.
12. Enable non-technical administrators to update content independently.

---

## 4. Product Principles

### 4.1 Content integrity
No qualifications, awards, institutional positions, books, programmes, testimonials, partnerships, achievements, project figures, or beneficiary information should be published unless approved.

### 4.2 Mobile-first
The website should be optimised primarily for mobile users while maintaining an excellent tablet and desktop experience.

### 4.3 Premium presentation
The design should feel mature, authoritative, international, clean, modern, and professional.

### 4.4 Simple content administration
Routine content changes should not require a developer.

### 4.5 Conversion-focused design
Important pages should have clear calls to action such as:

- Book a Consultation
- Invite Dr. Rich to Speak
- Register for Programme
- Register for Event
- Buy Book
- Make an Enquiry
- Subscribe
- Join Community

### 4.6 Performance
Pages should load quickly, images should be optimised, and content should be efficiently cached.

### 4.7 Security and privacy
Administrative access and user-submitted information must be appropriately protected.

---

## 5. Target Audiences

### Primary audiences

- Entrepreneurs
- Aspiring entrepreneurs
- Business owners
- Professionals
- Leaders
- Young adults
- Students and graduates
- Individuals seeking personal transformation
- Individuals seeking financial growth

### Institutional audiences

- Churches and ministries
- Companies and organisations
- Universities and educational institutions
- Government institutions
- Development organisations
- Conference and event organisers
- Media organisations
- Potential partners

---

## 6. User Personas

### Persona A — Individual seeking transformation
**Goal:** Learn from Dr. Rich, read articles, join programmes, request consultations, attend events.

**Needs:**
- Clear explanation of Dr. Rich’s work
- Easy programme discovery
- Consultation request process
- Useful resources
- Mobile-friendly browsing

### Persona B — Entrepreneur/business owner
**Goal:** Get strategic guidance, attend masterclasses, consume entrepreneurship resources, request consultation.

**Needs:**
- Consultation categories
- Programme details
- Business-oriented articles
- Testimonials
- Straightforward enquiry process

### Persona C — Event organiser
**Goal:** Invite Dr. Rich to speak.

**Needs:**
- Speaking topics
- Professional profile
- Speaking invitation form
- Clear contact information

### Persona D — Institution/partner
**Goal:** Explore partnerships, organisational programmes, social-impact collaboration, or speaking opportunities.

**Needs:**
- Institutional positioning
- Partnership information
- Impact information
- Contact and proposal channels

### Persona E — Administrator
**Goal:** Keep the website updated without editing source code.

**Needs:**
- Secure login
- Simple dashboard
- CRUD management
- Media uploads
- Publishing controls
- Form submission inboxes
- SEO fields
- Homepage editing
- Site settings

---

## 7. Product Scope

## 7.1 Public Website Modules

### 7.1.1 Home
Sections:

- Hero
- Primary headline
- Supporting message
- Introduction to Dr. Rich Global
- Vision and mission
- Introduction to Dr. Rich
- Featured books
- Featured programmes
- Consultation services
- Speaking engagements
- Upcoming events
- Testimonials
- Latest articles
- Newsletter subscription
- Final CTA

Primary CTAs:

- Discover Dr. Rich Global
- Book a Consultation
- Invite Dr. Rich to Speak

### 7.1.2 About Dr. Rich

Content blocks:

- Biography
- Personal journey
- Educational background
- Professional experience
- Business and leadership experience
- Transformational philosophy
- Approved achievements/recognitions
- Social-impact activities
- Vision for Dr. Rich Global
- Photo gallery

Important: biography and professional information must remain editable.

### 7.1.3 Vision, Mission & Objectives

- Vision
- Mission
- Strategic objectives
- Core values
- Institutional philosophy
- Human transformation commitment
- Wealth-creation commitment

### 7.1.4 Books & Publications

Capabilities:

- List published books
- List forthcoming books
- Book detail pages
- Categories
- Cover upload
- Short description
- Major lessons
- Publication status
- External purchase link
- Enquiry CTA
- Related resources

Suggested statuses:

- Draft
- Forthcoming
- Published
- Archived

### 7.1.5 Consultations

Consultation service areas:

- Personal transformation
- Financial mindset
- Idea development and monetisation
- Entrepreneurship
- Business clarity and strategy
- Leadership development
- Organisational transformation

Consultation request form:

- Full name
- Email
- WhatsApp number
- Country
- Individual/organisation
- Consultation category
- Description of challenge
- Preferred date
- Preferred consultation method
- Consent checkbox
- Submit button

Submission result:

- Store enquiry
- Notify administrator
- Show confirmation message
- Optionally send acknowledgement email to requester

### 7.1.6 Programmes & Masterclasses

Initial supported programme categories may include:

- The Brand-New You Programme
- The Mind Liberation Experience
- The Idea-to-Wealth Masterclass
- Financial Transformation Programmes
- Personal Reinvention Sessions
- Entrepreneurship Development Programmes
- Leadership and Business Programmes

Each programme:

- Title
- Slug
- Promotional image
- Description
- Target audience
- Learning outcomes
- Duration
- Delivery format
- Participation fee
- Registration CTA
- Enquiry CTA
- Status
- Featured flag
- Registration opening/closing date if applicable

### 7.1.7 Speaking Engagements

Page content:

- Professional speaking introduction
- Audience/institution types
- Speaking topics
- Previous approved speaking highlights
- Speaking invitation CTA

Speaking invitation form:

- Organisation name
- Contact person
- Email
- WhatsApp number
- Event name
- Event date
- Event location
- Expected audience
- Proposed topic
- Physical/virtual
- Additional information

### 7.1.8 Events

Sections:

- Upcoming events
- Past events

Event details:

- Title
- Promotional image
- Description
- Date
- Time
- Venue/virtual platform
- Participation fee
- Registration CTA
- WhatsApp community link
- Enquiry CTA
- Gallery after completion
- Registration status

### 7.1.9 Media & Resources

Supported resource types:

- Video
- Interview
- Photograph
- Teaching
- Media appearance
- Event gallery
- Downloadable PDF
- YouTube embed
- Audio teaching

Each resource should support:

- Title
- Resource type
- Description
- Thumbnail
- Media URL or uploaded file
- Publication date
- Category
- Featured flag

### 7.1.10 Articles & Insights

Article categories may include:

- Mind transformation
- Money and wealth
- Entrepreneurship
- Idea development
- Purpose
- Personal transformation
- Leadership
- Business
- Human development
- Faith and practical wisdom

Publishing features:

- Draft
- Published
- Scheduled
- Archived
- Category
- Tags
- Featured image
- SEO title
- Meta description
- Canonical URL
- Author
- Publish date

### 7.1.11 Social Impact

Content:

- Educational support
- Youth development
- Support for vulnerable individuals
- Humanitarian initiatives
- Entrepreneurship empowerment
- Community transformation

Only verified projects and information should be published.

### 7.1.12 Testimonials & Success Stories

Fields:

- Person name
- Photograph
- Position
- Organisation
- Testimonial statement
- Testimonial type
- Featured flag
- Approval status

### 7.1.13 Partnerships

Capabilities:

- Partner name
- Approved logo
- Website URL
- Partnership description
- Display order
- Visibility status

### 7.1.14 Community & Newsletter

Visitors may:

- Subscribe to email updates
- Receive article announcements
- Receive programme/event announcements
- Join approved WhatsApp communities
- Access selected free resources

### 7.1.15 Contact

Enquiry categories:

- General
- Consultation
- Speaking
- Events
- Media
- Partnerships
- Book enquiries

Contact information:

- Official email
- WhatsApp
- Phone
- Location
- Social links
- Contact form

### 7.1.16 FAQ

Editable questions covering:

- Consultations
- Speaking invitations
- Book purchasing
- Programme registration
- Virtual consultations
- International speaking invitations
- Partnerships

### 7.1.17 Policy Pages

- Privacy Policy
- Terms and Conditions
- Cookie Policy
- Disclaimer
- Refund and Cancellation Policy

---

## 8. Administrative Dashboard

The dashboard should provide management interfaces for:

- Dashboard overview
- Homepage content
- About content
- Vision/mission/objectives
- Books
- Book categories
- Programmes
- Programme categories
- Consultation services
- Consultation requests
- Speaking topics
- Speaking invitations
- Events
- Event registrations
- Media/resources
- Resource categories
- Articles
- Article categories
- Tags
- Testimonials
- Social-impact projects
- Partners
- Newsletter subscribers
- FAQs
- Contact enquiries
- Policy pages
- Site settings
- Contact information
- Social-media links
- SEO defaults
- Media library
- Administrator users
- Audit/activity log

---

## 9. Roles & Permissions

### Super Administrator
Full access to all modules, users, settings, submissions, and publishing controls.

### Content Administrator / Editor
Recommended optional role:

- Manage content
- Manage articles
- Manage books
- Manage programmes
- Manage events
- Manage testimonials
- Manage media
- View form submissions
- Cannot manage critical security/system settings unless permitted

A single-administrator setup can launch first, with role-based access available for future expansion.

---

## 10. Functional Requirements

### FR-001 Authentication
- Admin login
- Logout
- Password reset
- Secure password storage
- Session management

### FR-002 CMS
Administrators must be able to create, edit, publish, unpublish, reorder, and archive appropriate content.

### FR-003 Form Processing
All public forms must:

- Validate required fields
- Provide human-readable errors
- Store submissions
- Send administrator notifications
- Show success messages
- Include spam protection
- Record submission timestamp

### FR-004 Search
Public search should return relevant:

- Articles
- Books
- Programmes
- Events
- Resources

### FR-005 Newsletter
- Newsletter subscription form
- Consent capture
- Duplicate email handling
- External newsletter-provider integration or export

### FR-006 Media
- Image uploads
- PDF/resource uploads
- YouTube/video embeds
- File validation
- File size limits
- Alt text

### FR-007 SEO
Per-page support for:

- SEO title
- Meta description
- Open Graph metadata
- Canonical URL
- Sitemap inclusion
- Index/noindex where applicable

### FR-008 Analytics
- Analytics tracking script integration
- Basic conversion/event tracking hooks

### FR-009 WhatsApp
- Configurable WhatsApp contact links
- Programme/event/community WhatsApp links
- Pre-filled messages where useful

### FR-010 External Purchase/Payment Links
Books, programmes, and events may link to approved external payment or purchase systems.

### FR-011 Scheduling
Articles should support scheduled publishing.

### FR-012 Notifications
Email notifications should be configurable by form type.

### FR-013 Backups
Database and uploaded assets should be included in a documented backup strategy.

---

## 11. Non-Functional Requirements

### Performance
- Responsive image formats
- Lazy loading
- Database query optimisation
- Appropriate indexes
- Server/page caching where useful
- Asset minification through Vite
- Target good Core Web Vitals

### Security
- CSRF protection
- XSS-safe rendering
- Laravel validation
- Rate limiting
- Secure cookies
- HTTPS
- Strong admin authentication
- Access-control middleware
- Upload validation
- Security headers where supported
- Server/database backups

### Reliability
- Graceful error pages
- Form retry-safe processing where appropriate
- Logging
- Notification failure logging

### Accessibility
- Semantic HTML
- Keyboard navigation
- Visible focus states
- Image alt text
- Form labels
- Good contrast
- Accessible error messages

### Browser Support
Latest commonly used versions of:

- Chrome
- Safari
- Firefox
- Edge
- Mobile Safari
- Android Chrome

---

## 12. Design Requirements

Brand colours:

- Midnight navy
- Royal blue
- Rich gold
- Warm white

Visual direction:

- Premium
- Modern
- Authoritative
- Professional
- International
- Clean
- Mature
- Easy to navigate

Avoid:

- Excessive animation
- Crowded layouts
- Too many colours
- Decorative clutter

Use:

- Strong typography
- Generous white space
- Professional photography
- Clear CTA hierarchy
- Consistent cards and content patterns
- Elegant transitions only where useful

---

## 13. Success Metrics

Recommended KPIs:

- Consultation requests/month
- Speaking invitations/month
- Programme registrations
- Event registrations
- Book purchase-link clicks
- Newsletter subscriptions
- WhatsApp CTA clicks
- Contact enquiries
- Article engagement
- Returning visitors
- Organic search traffic
- Form completion rate

---

## 14. Acceptance Criteria

The project is considered launch-ready when:

1. All approved pages are implemented.
2. Mobile, tablet, and desktop layouts are tested.
3. All admin CRUD modules work.
4. Forms validate, save, and send notifications.
5. All CTA buttons and links are tested.
6. WhatsApp links work.
7. External purchase/payment links work.
8. Newsletter integration works.
9. Search works.
10. Articles can be drafted, scheduled, published, and archived.
11. Events and registrations work.
12. Admin users can manage ordinary content without code changes.
13. SSL is active.
14. Backups are configured.
15. Analytics is configured.
16. SEO metadata is present.
17. Unapproved content is not published.
18. Final stakeholder review is completed.

---

# PART 2 — TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## 1. Technical Architecture

### Recommended Architecture

**Backend**
- Laravel
- PHP
- MySQL or MariaDB
- Laravel queues
- Laravel scheduler
- Laravel notifications/mail
- Laravel filesystem

**Frontend**
- Inertia.js
- React
- TypeScript
- TSX
- Tailwind CSS
- Vite

**Architecture style**
- Laravel monolith with Inertia rendering
- Server-side routing via Laravel
- React/TSX page components
- Shared typed page props
- Form requests for validation
- Service classes/actions for business logic where appropriate
- Eloquent ORM
- Policies/gates for administrative authorisation

This keeps deployment simpler than maintaining separate frontend and backend applications while preserving a modern React development experience.

---

## 2. Recommended Project Structure

```text
app/
├── Actions/
├── Enums/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   └── Public/
│   ├── Middleware/
│   └── Requests/
├── Mail/
├── Models/
├── Notifications/
├── Policies/
├── Providers/
├── Services/
└── Support/

database/
├── factories/
├── migrations/
└── seeders/

resources/
├── css/
├── js/
│   ├── Components/
│   ├── Layouts/
│   ├── Pages/
│   │   ├── Admin/
│   │   └── Public/
│   ├── Types/
│   ├── Hooks/
│   ├── Utils/
│   └── app.tsx
└── views/

routes/
├── web.php
├── admin.php
└── console.php

storage/
tests/
├── Feature/
└── Unit/
```

---

## 3. Routing Strategy

### Public routes

Examples:

```text
/
 /about
 /vision-mission
 /books
 /books/{slug}
 /consultations
 /programmes
 /programmes/{slug}
 /speaking
 /events
 /events/{slug}
 /media
 /articles
 /articles/{slug}
 /social-impact
 /testimonials
 /partnerships
 /community
 /contact
 /faq
 /privacy-policy
 /terms
 /cookie-policy
 /disclaimer
 /refund-policy
 /search
```

### Admin routes

Prefix:

```text
/admin
```

Examples:

```text
/admin/dashboard
/admin/books
/admin/programmes
/admin/events
/admin/articles
/admin/media
/admin/testimonials
/admin/partners
/admin/faqs
/admin/consultations
/admin/speaking-invitations
/admin/event-registrations
/admin/contact-enquiries
/admin/subscribers
/admin/settings
/admin/users
```

All admin routes must use authentication and authorisation middleware.

---

## 4. Suggested Database Schema

### users
- id
- name
- email
- password
- role
- last_login_at
- created_at
- updated_at

### pages
For editable semi-static pages.

- id
- key
- title
- slug
- content_json / body
- seo_title
- meta_description
- status
- published_at
- timestamps

### books
- id
- title
- slug
- category_id
- short_description
- description
- major_lessons
- cover_path
- publication_status
- purchase_url
- enquiry_enabled
- is_featured
- display_order
- seo_title
- meta_description
- timestamps

### book_categories
- id
- name
- slug
- timestamps

### consultation_services
- id
- title
- slug
- description
- is_active
- display_order
- timestamps

### consultation_requests
- id
- full_name
- email
- whatsapp
- country
- requester_type
- consultation_service_id
- challenge_description
- preferred_date
- preferred_method
- consent_at
- status
- admin_notes
- timestamps

### programmes
- id
- title
- slug
- category_id
- promotional_image
- description
- target_audience
- learning_outcomes
- duration
- delivery_format
- participation_fee
- currency
- registration_url
- enquiry_enabled
- registration_opens_at
- registration_closes_at
- status
- is_featured
- seo_title
- meta_description
- timestamps

### programme_categories
- id
- name
- slug
- timestamps

### speaking_topics
- id
- title
- description
- is_active
- display_order
- timestamps

### speaking_invitations
- id
- organisation_name
- contact_person
- email
- whatsapp
- event_name
- event_date
- event_location
- expected_audience
- speaking_topic_id
- proposed_topic_text
- engagement_type
- additional_information
- status
- admin_notes
- timestamps

### events
- id
- title
- slug
- promotional_image
- description
- starts_at
- ends_at
- timezone
- venue_name
- venue_address
- virtual_platform
- participation_fee
- currency
- registration_url
- whatsapp_url
- status
- is_featured
- seo_title
- meta_description
- timestamps

### event_registrations
- id
- event_id
- full_name
- email
- whatsapp
- country
- organisation
- notes
- registration_status
- timestamps

### media_resources
- id
- title
- slug
- type
- description
- thumbnail_path
- media_url
- file_path
- category_id
- published_at
- is_featured
- status
- timestamps

### media_categories
- id
- name
- slug
- timestamps

### articles
- id
- author_id
- category_id
- title
- slug
- excerpt
- body
- featured_image
- status
- scheduled_for
- published_at
- seo_title
- meta_description
- canonical_url
- is_featured
- timestamps

### article_categories
- id
- name
- slug
- timestamps

### tags
- id
- name
- slug
- timestamps

### article_tag
- article_id
- tag_id

### testimonials
- id
- person_name
- photo_path
- position
- organisation
- statement
- type
- is_featured
- status
- display_order
- timestamps

### social_impact_projects
- id
- title
- slug
- category
- summary
- body
- featured_image
- status
- published_at
- timestamps

### partners
- id
- name
- logo_path
- website_url
- description
- status
- display_order
- timestamps

### newsletter_subscribers
- id
- email
- name
- status
- consent_at
- source
- provider_reference
- timestamps

### faqs
- id
- question
- answer
- category
- is_active
- display_order
- timestamps

### contact_enquiries
- id
- enquiry_type
- full_name
- email
- whatsapp
- organisation
- subject
- message
- status
- admin_notes
- timestamps

### site_settings
Key-value or grouped JSON settings:

- brand
- contact
- social_links
- analytics
- SEO
- WhatsApp
- newsletter
- notification_emails

### media_library
Optional central media table:

- id
- file_name
- file_path
- mime_type
- size
- alt_text
- uploaded_by
- timestamps

### activity_logs
- id
- user_id
- action
- subject_type
- subject_id
- metadata
- ip_address
- timestamps

---

## 5. TypeScript / Inertia Data Contract

Shared TS types should be maintained in:

```text
resources/js/Types/
```

Example:

```ts
export interface Book {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  coverUrl: string | null;
  publicationStatus: 'draft' | 'forthcoming' | 'published' | 'archived';
  purchaseUrl: string | null;
  isFeatured: boolean;
}
```

The goal is to avoid untyped page props and reduce frontend/backend integration mistakes.

---

## 6. Frontend Component Strategy

Reusable public components:

- Header
- Footer
- MobileNavigation
- HeroSection
- SectionHeading
- CTASection
- BookCard
- ProgrammeCard
- EventCard
- ArticleCard
- TestimonialCard
- PartnerLogo
- ResourceCard
- NewsletterForm
- Pagination
- Breadcrumbs
- EmptyState
- FormField
- FormError

Reusable admin components:

- AdminSidebar
- AdminHeader
- DataTable
- SearchFilter
- StatusBadge
- ConfirmDialog
- MediaUploader
- RichTextEditor
- DateTimePicker
- ImagePreview
- SeoFields
- PublishControls
- FormActions

---

## 7. Content Editing

For rich content, the system may use a React-compatible rich-text editor.

Recommended saved format:

- HTML with sanitisation, or
- Structured JSON from the selected editor

Content should be sanitised before rendering where required.

---

## 8. File Storage

### Development
Laravel local/public storage.

### Production options
- Server storage
- S3-compatible object storage
- Cloud object storage/CDN

Uploads must validate:

- MIME type
- Extension
- File size
- Image dimensions where required

Recommended image processing:

- Resize oversized images
- Generate responsive sizes
- Prefer WebP/AVIF where supported
- Preserve originals when required

---

## 9. Email & Notification Architecture

Forms that trigger email notifications:

- Consultation request
- Speaking invitation
- Event registration
- Contact enquiry
- Book enquiry
- Programme enquiry
- Newsletter signup acknowledgement if required

Use queued notifications where hosting supports queues.

Recommended flow:

```text
Visitor submits form
        ↓
Server validation
        ↓
Store record in database
        ↓
Dispatch notification
        ↓
Queue sends email
        ↓
Success response returned
```

If email delivery fails, the stored database submission remains available in the admin dashboard.

---

## 10. Newsletter Integration

Implement an abstraction so the provider can be replaced.

Possible integration types:

- Mailchimp
- Brevo
- ConvertKit/Kit
- MailerLite
- Other provider with API support

Internal table remains the website’s consent/subscription record where appropriate.

---

## 11. Search

Phase 1:

- Laravel database search using indexed title/content columns.

Searchable resources:

- Articles
- Books
- Programmes
- Events
- Media resources

Future upgrade:

- Laravel Scout
- Meilisearch/Algolia

---

## 12. SEO Requirements

- Editable title/meta description
- Clean slugs
- Canonical URLs
- Open Graph tags
- Twitter/X cards where applicable
- XML sitemap
- robots.txt
- Structured data where suitable:
  - Person
  - Organization
  - Article
  - Event
  - Book
  - BreadcrumbList
- Redirect management for changed URLs
- Image alt text

---

## 13. Analytics

Implement configurable analytics scripts through site settings.

Recommended tracking events:

- consultation_submit
- speaking_invitation_submit
- event_registration_submit
- newsletter_subscribe
- book_purchase_click
- programme_registration_click
- whatsapp_click
- contact_submit

---

## 14. Spam Protection

Recommended:

- Honeypot
- Rate limiting
- CSRF
- Cloudflare Turnstile or reCAPTCHA if needed
- Server-side validation

Avoid depending solely on client-side validation.

---

## 15. Authentication & Authorisation

Recommended features:

- Laravel session authentication
- Strong password rules
- Password reset
- Optional email verification for administrators
- Role middleware/policies
- Login throttling
- Session regeneration
- Optional 2FA as a later enhancement

---

## 16. Logging & Monitoring

Log:

- Application errors
- Failed jobs
- Failed notification attempts
- Admin activity
- Authentication failures where appropriate

Production should have:

- Rotated application logs
- Error alerting where possible
- Health checks
- Uptime monitoring as an optional external service

---

## 17. Backup Requirements

Back up:

- Database
- User-uploaded media
- Critical environment/config documentation

Recommended:

- Daily database backup
- Regular file backup
- Retention policy
- Off-site copy where possible
- Periodic restore test

---

## 18. Hosting Requirements

Minimum practical production environment:

- PHP version supported by the selected Laravel release
- MySQL/MariaDB
- HTTPS/SSL
- Composer
- Node.js for build/deployment or CI build process
- Cron access
- Queue-worker support preferred
- SSH access preferred
- Sufficient storage for media
- Email delivery capability/API
- Scheduled backups

The application can run on quality Laravel-compatible shared hosting, VPS, or managed cloud hosting. VPS/managed Laravel hosting is preferable if traffic, queued email, scheduled publishing, and media usage grow.

---

## 19. Third-Party Services

Potential external services:

- Transactional email provider
- Newsletter provider
- Google Analytics
- Google Search Console
- YouTube
- WhatsApp deep links/community links
- Cloudflare
- CAPTCHA/Turnstile
- External payment or book-purchase providers
- Cloud object storage/CDN
- Error monitoring

No premium plugin is technically required simply because Laravel + Inertia is being used. Paid external services should only be introduced when they provide clear operational value.

---

## 20. Testing Requirements

### Feature tests

Test:

- Admin authentication
- Authorisation
- CRUD operations
- Consultation submissions
- Speaking submissions
- Event registrations
- Newsletter signup
- Contact forms
- Article scheduling
- Search
- Publishing permissions

### Unit tests

Test:

- Business rules
- Status transitions
- Service/action classes
- Slug generation
- Date handling where complex

### Frontend/browser testing

Test:

- Mobile navigation
- Forms
- Validation errors
- Uploads
- Search/filter interfaces
- Admin responsive behaviour
- CTA links

---

## 21. Deployment Architecture

Recommended flow:

```text
Git repository
      ↓
Staging environment
      ↓
Automated/manual test
      ↓
Production deployment
      ↓
Migrations
      ↓
Build frontend assets
      ↓
Cache configuration/routes/views
      ↓
Restart queue workers
      ↓
Smoke test
```

Production deployment checklist:

- APP_ENV=production
- APP_DEBUG=false
- HTTPS active
- Secure environment secrets
- Migrations complete
- Storage link/configuration
- Cache configured
- Scheduler configured
- Queue configured
- Mail tested
- Backups tested
- Analytics enabled
- Robots/sitemap checked

---

# PART 3 — USER JOURNEY FLOW

## 1. General Visitor Journey

```text
Visitor lands on website
        ↓
Homepage communicates Dr. Rich Global message
        ↓
Visitor chooses area of interest
        ├── Learn about Dr. Rich
        ├── Explore books
        ├── Explore programmes
        ├── Book consultation
        ├── Invite Dr. Rich
        ├── View events
        ├── Read articles
        ├── View media/resources
        └── Contact/subscribe
        ↓
Visitor views relevant detail page
        ↓
Visitor takes CTA
        ↓
System validates action/form
        ↓
Submission/link action succeeds
        ↓
Visitor receives confirmation
        ↓
Admin receives/stores lead where applicable
```

---

## 2. Consultation Journey

```text
Home / Consultations
        ↓
Visitor reviews consultation categories
        ↓
Selects consultation service
        ↓
Reads service information
        ↓
Clicks "Book a Consultation"
        ↓
Completes request form
        ↓
Validation
        ├── Error → highlight fields → resubmit
        └── Valid
              ↓
        Save request
              ↓
        Send admin notification
              ↓
        Show confirmation
              ↓
        Admin reviews request
              ↓
        Admin changes status
        New → Contacted → Scheduled → Completed / Closed
```

---

## 3. Speaking Invitation Journey

```text
Visitor opens Speaking page
        ↓
Reviews speaking positioning/topics
        ↓
Clicks "Invite Dr. Rich to Speak"
        ↓
Completes invitation form
        ↓
System validates
        ↓
Invitation stored
        ↓
Admin notified
        ↓
Confirmation shown
        ↓
Admin reviews request
        ↓
Admin follows up externally
```

---

## 4. Programme Journey

```text
Visitor opens Programmes
        ↓
Browses categories/programmes
        ↓
Opens programme detail
        ↓
Reviews:
- outcomes
- audience
- duration
- delivery
- fee
        ↓
Chooses action
        ├── Register
        │      ↓
        │ External registration/payment link or internal form
        │
        └── Enquire
               ↓
        Enquiry captured
```

---

## 5. Event Journey

```text
Visitor opens Events
        ↓
Views upcoming events
        ↓
Opens event details
        ↓
Reviews date/time/venue/fee
        ↓
Clicks Register
        ↓
Registration form or approved external registration URL
        ↓
Successful registration
        ↓
Confirmation
        ↓
Optional WhatsApp community CTA
```

After the event:

```text
Admin changes event to Past
        ↓
Uploads event gallery/resources
        ↓
Past-event page becomes archive/content asset
```

---

## 6. Book Journey

```text
Visitor opens Books
        ↓
Selects Published / Forthcoming
        ↓
Opens book
        ↓
Reads overview and major lessons
        ↓
Chooses:
        ├── Purchase
        │      ↓
        │ Approved external purchase link
        │
        └── Enquire
               ↓
        Enquiry form/contact route
```

---

## 7. Article Journey

```text
Visitor finds article
        ↓
Reads article
        ↓
Views related content
        ↓
Optional CTA:
- Subscribe
- Explore programme
- Book consultation
- View book/resource
```

---

## 8. Newsletter Journey

```text
Visitor enters email
        ↓
Consent + validation
        ↓
Check duplicate
        ↓
Store subscription
        ↓
Sync with newsletter provider
        ↓
Show success state
```

---

## 9. Administrator Journey

```text
Admin opens /admin
        ↓
Login
        ↓
Dashboard
        ↓
Select module
        ├── Books
        ├── Programmes
        ├── Events
        ├── Articles
        ├── Media
        ├── Testimonials
        ├── Partners
        ├── FAQs
        ├── Site content
        └── Form submissions
        ↓
Create/Edit/Delete/Publish content
        ↓
Validate
        ↓
Save
        ↓
Public site reflects approved published content
```

---

## 10. Content Publishing Journey

```text
Admin creates content
        ↓
Status = Draft
        ↓
Adds media/SEO/content
        ↓
Preview/review
        ↓
Choose:
        ├── Publish now
        ├── Schedule
        └── Keep draft
        ↓
Published content appears publicly only when approved
```

---

# PART 4 — IMPLEMENTATION PLAN

## Phase 0 — Discovery & Content Preparation

### Objectives
Confirm what is approved and what remains temporary.

### Tasks
- Review final brand assets
- Obtain approved logo
- Confirm colour values
- Confirm domain
- Confirm hosting
- Confirm contact information
- Confirm social links
- Confirm approved biography
- Confirm book information
- Confirm programmes
- Confirm speaking topics
- Confirm initial events
- Confirm policy/legal content
- Confirm notification email addresses
- Confirm newsletter provider
- Confirm analytics account

### Deliverable
Signed-off content/asset checklist.

---

## Phase 1 — Project Foundation

### Backend
- Initialise Laravel project
- Configure database
- Configure environment
- Configure authentication
- Add admin route group
- Add role/permission foundation
- Configure mail
- Configure filesystem
- Configure queue/scheduler
- Configure logging

### Frontend
- Install/configure Inertia
- Configure React + TypeScript
- Configure Tailwind
- Create design tokens
- Create public layout
- Create admin layout

### Deliverable
Running project foundation with authenticated admin area.

---

## Phase 2 — Design System & Public Shell

Build:

- Header
- Footer
- Navigation
- Mobile navigation
- Button system
- Typography
- Form controls
- Cards
- Hero patterns
- CTA patterns
- Content sections
- Responsive grid
- Breadcrumbs
- Pagination
- Error/empty states

Pages to establish:

- Home shell
- About shell
- Contact shell

### Deliverable
Approved responsive visual system.

---

## Phase 3 — Core CMS

Implement:

- Pages
- Site settings
- Homepage sections
- Contact details
- Social links
- Media library
- SEO fields
- Admin CRUD patterns

### Deliverable
Administrator can manage core site content.

---

## Phase 4 — Business Content Modules

Implement:

1. Books
2. Book categories
3. Programmes
4. Programme categories
5. Consultation services
6. Speaking topics
7. Events
8. Media/resources
9. Testimonials
10. Partners
11. Social-impact projects
12. FAQs

### Deliverable
All primary website content modules manageable in admin.

---

## Phase 5 — Lead & Registration Workflows

Implement:

- Consultation requests
- Speaking invitations
- Event registrations
- Contact enquiries
- Book enquiries
- Programme enquiries
- Newsletter subscriptions

For each:

- Validation
- Database storage
- Email notification
- Success/failure states
- Admin list/detail screen
- Status management

### Deliverable
Complete lead-capture and enquiry system.

---

## Phase 6 — Blog & Publishing

Implement:

- Articles
- Categories
- Tags
- Rich-text editing
- Featured images
- Draft/publish states
- Scheduled publishing
- Related articles
- Article SEO
- Article search/filtering

### Deliverable
Full article publishing workflow.

---

## Phase 7 — Integrations

Configure:

- Transactional email
- Newsletter provider
- Google Analytics
- Search Console verification
- YouTube embeds
- WhatsApp CTAs
- CAPTCHA/Turnstile if required
- External payment/purchase links
- Sitemap

### Deliverable
External integrations operational.

---

## Phase 8 — Security, Performance & SEO Hardening

### Security
- Rate limits
- File validation
- Authorisation review
- Secure headers
- HTTPS
- Admin access review
- Production debug disabled

### Performance
- Image optimisation
- Lazy loading
- Caching
- Database indexes
- Query review
- Asset optimisation

### SEO
- Metadata review
- Structured data
- Sitemap
- robots.txt
- Canonical URLs
- Open Graph

### Deliverable
Production-ready technical quality.

---

## Phase 9 — QA & UAT

### Functional testing

Test:

- Every public link
- Every CTA
- Every admin module
- Every form
- Every notification
- Every upload
- Search
- Article scheduling
- Newsletter
- WhatsApp links
- External purchase links

### Device testing

- Mobile
- Tablet
- Desktop

### Browser testing

- Chrome
- Safari
- Firefox
- Edge

### UAT
Stakeholder reviews all visible content and confirms that no unapproved information is present.

### Deliverable
Signed UAT checklist.

---

## Phase 10 — Deployment & Handover

### Deployment
- Configure production
- Run migrations
- Build assets
- Configure cache
- Configure queues
- Configure scheduler
- Configure SSL
- Configure backups
- Configure analytics
- Verify email sending

### Handover
Provide:

- Admin login
- Content-management guide
- Backup overview
- Hosting/domain details
- Third-party integration list
- Basic administrator training
- Post-launch support process

### Deliverable
Approved production website and administrator handover.

---

# SUGGESTED DEVELOPMENT SCHEDULE

A practical schedule for a full implementation is approximately 8 weeks, depending mainly on content readiness and stakeholder review speed.

| Week | Focus |
|---|---|
| Week 1 | Discovery, architecture, project foundation |
| Week 2 | Design system, responsive public layouts |
| Week 3 | Core CMS, homepage, about, institutional pages |
| Week 4 | Books, programmes, consultation, speaking modules |
| Week 5 | Events, media, testimonials, partners, social impact |
| Week 6 | Blog, forms, registrations, notifications, newsletter |
| Week 7 | Integrations, SEO, security, performance, analytics |
| Week 8 | QA, content review, UAT, deployment, handover |

If approved content is delayed, development can continue with clearly marked placeholders, but production publication should wait for final approval.

---

# DEVELOPMENT PRIORITY / MVP

## MVP — Launch Essential

- Home
- About
- Vision/Mission/Objectives
- Books
- Consultations
- Programmes
- Speaking
- Events
- Articles
- Media/resources
- Testimonials
- Contact
- FAQ
- Policy pages
- Admin CMS
- Forms and notifications
- Newsletter
- WhatsApp links
- Search
- SEO basics
- Analytics
- Security
- Backups

## Phase 2 Enhancements

- Advanced CRM pipeline
- Internal calendar scheduling
- Integrated payments
- Customer/member accounts
- Course/LMS functionality
- Digital product downloads with access control
- Advanced marketing automation
- Advanced analytics dashboard
- Multilingual support
- Native mobile app
- Advanced full-text search
- 2FA
- Approval workflows
- API/mobile backend

---

# DEFINITION OF DONE

A feature is considered complete only when:

1. Backend logic is implemented.
2. Frontend UI is implemented.
3. Validation is implemented.
4. Authorisation is implemented.
5. Responsive behaviour is verified.
6. Success/error states are implemented.
7. Tests are completed where applicable.
8. Admin management is available where required.
9. SEO/accessibility considerations are included.
10. Stakeholder-visible content uses approved information only.

---

# FINAL RECOMMENDED STACK

| Layer | Technology |
|---|---|
| Backend | Laravel |
| Frontend bridge | Inertia.js |
| UI | React |
| Language | TypeScript / TSX |
| Styling | Tailwind CSS |
| Build tool | Vite |
| Database | MySQL / MariaDB |
| Authentication | Laravel session authentication |
| ORM | Eloquent |
| Queue | Database or Redis depending on hosting |
| Scheduler | Laravel Scheduler + cron |
| Storage | Local/S3-compatible |
| Email | SMTP/API transactional email provider |
| Analytics | Google Analytics |
| SEO | Laravel-rendered metadata + sitemap + structured data |
| Spam protection | Honeypot + rate limiting + optional Turnstile |
| Source control | Git |
| Deployment | Laravel-compatible hosting/VPS/managed hosting |

---

# CLIENT INFORMATION REQUIRED BEFORE DEVELOPMENT

1. Approved logo files
2. Exact brand colour values if available
3. Professional photographs
4. Approved biography
5. Confirmed educational/professional information
6. Book titles, covers, descriptions, and purchase links
7. Programme information
8. Consultation categories/availability
9. Speaking topics
10. Event information
11. Approved testimonials
12. Approved partner information
13. Social-impact content
14. Official email
15. WhatsApp number
16. Phone number
17. Social-media links
18. Domain access
19. Hosting access
20. Analytics account/access
21. Newsletter provider/access
22. Notification email recipients
23. Legal/policy content
24. Approved payment or external purchase links

---

# POST-LAUNCH SUPPORT RECOMMENDATION

Recommended support coverage:

- Bug fixes
- Security updates
- Framework/package updates
- Backup monitoring
- Uptime monitoring
- Form/email-delivery checks
- Minor content/admin support
- Performance checks
- Periodic restore testing

A separate maintenance agreement can define response times, monthly support hours, hosting responsibility, update frequency, and excluded feature-development work.

---

# PROJECT CONCLUSION

Laravel with Inertia.js, React, TypeScript, and TSX is an appropriate architecture for Dr. Rich Global because it provides a strong Laravel backend, a modern React user experience, a single deployable application, secure administrative workflows, structured content management, and room to expand into more advanced digital products later.

The platform should be built as a content-rich, conversion-focused institutional website rather than a static brochure site. The administrator should be able to manage the organisation’s books, programmes, events, articles, testimonials, resources, speaking information, consultation services, FAQs, contact information, social links, and homepage content without routine developer intervention.
