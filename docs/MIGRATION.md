# CMS Migration Plan — Canela Landscaping

**Objective**: Migrate all hard-coded and i18n-file-driven content to a database-backed CMS, allowing the business owner to edit all page content (in both English and Spanish) from the `/admin` panel without needing a developer.

**Status**: 🏗️ In Progress — Layout standardized, CMS Phase 1 complete.

---

## Recent Updates (April 2026)

### Site-wide Layout Standardization (3-Layer Architecture)

The entire website has been refactored to follow a strict 3-layer containerization pattern:

1. **Outer Layer**: Background and horizontal padding (`px-6 md:px-12`).
2. **Sub-wrapper Layer**: Standardized `.container-custom` (`max-width: 1400px`, centered).
3. **Content Layer**: The actual UI elements.

This migration ensures perfect alignment and premium UI consistency across all viewports, preparing the codebase for dynamic dynamic content injection.

---

---

## Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [Database Schema Design](#2-database-schema-design)
3. [Content Inventory by Page](#3-content-inventory-by-page)
   - [Global / Shared](#31-global--shared)
   - [Home Page](#32-home-page)
   - [About Page](#33-about-page)
   - [Services Page](#34-services-page)
   - [Gallery Page](#35-gallery-page)
   - [Contact Page](#36-contact-page-)
   - [Footer](#37-footer)
4. [Admin Panel — New Pages Needed](#4-admin-panel--new-pages-needed)
5. [Frontend Changes Required](#5-frontend-changes-required)
6. [Migration Strategy (Codified Steps)](#6-migration-strategy-codified-steps)
7. [Files to Delete After Migration](#7-files-to-delete-after-migration)
8. [Open Questions & Decisions](#8-open-questions--decisions)

---

## 1. Overview & Architecture

### Current State

All content is stored in two places:

- **`src/locales/en.json`** and **`src/locales/es.json`** — all user-facing text (bilingual)
- **`src/data/services.ts`** — service list (titles, descriptions, categories, icons)
- **`src/data/gallery-assets.ts`** — gallery image URLs (Unsplash IDs + direct links)
- **`src/config/constants.ts`** — phone number, email, service area text
- **`public/images/`** — gallery photos (`.webp` files)
- Hard-coded in component files — team member names/photos, stat values (e.g. `1k+`), hero video URL

### Target State

- All content lives in **Supabase tables** with English and Spanish columns per text field
- Admin edits content at `/admin/content/*` using a live preview editor
- Frontend fetches content from Supabase at runtime (or builds a server cache)
- Images are uploaded to **Supabase Storage** and referenced by URL

### Bilingual Strategy

Every text field in the database will have two columns:

- `value_en` — English text
- `value_es` — Spanish text

The frontend reads `value_en` or `value_es` depending on the active language via `i18n.language`. The `useTranslation` hook is replaced by a custom `useContent()` hook that pulls from the DB instead of JSON files.

---

## 2. Database Schema Design

### Table: `cms_site_settings`

Stores global, singleton values (one row per setting).

| Column       | Type               | Description                                   |
| ------------ | ------------------ | --------------------------------------------- |
| `id`         | `text` PRIMARY KEY | Setting key e.g. `phone`, `email`, `location` |
| `value_en`   | `text`             | English value                                 |
| `value_es`   | `text`             | Spanish value                                 |
| `updated_at` | `timestamptz`      | Last modified                                 |

**Initial rows to seed:**

- `phone` → `(216) 538-4311` / `(216) 538-4311`
- `email` → `contact@canela-landscaping.com`
- `location` → `Serving the Greater Cleveland, Ohio Area` / `Sirviendo el Área de Cleveland, Ohio`
- `hero_video_url` → (current istock URL)
- `hero_poster_url` → (current Unsplash URL)
- `stats_properties_count` → `1k+`
- `facebook_url` → `https://facebook.com`
- `instagram_url` → `https://instagram.com`

---

### Table: `cms_pages`

Stores all text content for every page section, keyed by `page` + `section` + `field`.

| Column       | Type          | Description                                                      |
| ------------ | ------------- | ---------------------------------------------------------------- |
| `id`         | `uuid`        | Primary key                                                      |
| `page`       | `text`        | e.g. `home`, `about`, `services`, `gallery`, `contact`, `global` |
| `section`    | `text`        | e.g. `hero`, `trust_badges`, `why_us`, `testimonials`, `cta`     |
| `field`      | `text`        | e.g. `badge`, `title`, `subtitle`, `button_text`, `quote`        |
| `value_en`   | `text`        | English content                                                  |
| `value_es`   | `text`        | Spanish content                                                  |
| `updated_at` | `timestamptz` | Last modified                                                    |

**Composite unique constraint** on `(page, section, field)`.

---

### Table: `cms_services`

Replaces `src/data/services.ts`. One row per service.

| Column           | Type               | Description                                               |
| ---------------- | ------------------ | --------------------------------------------------------- |
| `id`             | `text` PRIMARY KEY | Slug e.g. `lawn-mowing`, `snow-plow`                      |
| `title_en`       | `text`             | English title                                             |
| `title_es`       | `text`             | Spanish title                                             |
| `description_en` | `text`             | English description                                       |
| `description_es` | `text`             | Spanish description                                       |
| `category`       | `text`             | `Lawn Care` \| `Maintenance` \| `Specialty` \| `Seasonal` |
| `icon`           | `text`             | Lucide icon name e.g. `Scissors`                          |
| `is_featured`    | `boolean`          | Whether shown on Home page                                |
| `display_order`  | `int`              | Sort order in the services grid                           |
| `is_active`      | `boolean`          | Toggle service visibility                                 |

---

### Table: `cms_team_members`

Replaces hardcoded team array in `About.tsx`.

| Column          | Type      | Description                                 |
| --------------- | --------- | ------------------------------------------- |
| `id`            | `uuid`    | Primary key                                 |
| `name`          | `text`    | Full name (not translated)                  |
| `role_en`       | `text`    | English job title                           |
| `role_es`       | `text`    | Spanish job title                           |
| `photo_url`     | `text`    | URL to photo (Supabase Storage or external) |
| `display_order` | `int`     | Sort order                                  |
| `is_active`     | `boolean` | Toggle visibility                           |

---

### Table: `cms_testimonials`

Replaces the single hardcoded testimonial. Built as a table for future expansion.

| Column            | Type      | Description                        |
| ----------------- | --------- | ---------------------------------- |
| `id`              | `uuid`    | Primary key                        |
| `quote_en`        | `text`    | English testimonial text           |
| `quote_es`        | `text`    | Spanish testimonial text           |
| `author_name`     | `text`    | e.g. `Sarah & Michael J.`          |
| `author_location` | `text`    | e.g. `Homeowners, Cleveland, Ohio` |
| `is_featured`     | `boolean` | Whether shown on home page         |
| `display_order`   | `int`     | Sort order (for future carousel)   |

---

### Table: `cms_gallery_images`

Replaces `src/data/gallery-assets.ts` and the `serviceImages` map inside `Gallery.tsx`.

| Column          | Type      | Description                                   |
| --------------- | --------- | --------------------------------------------- |
| `id`            | `uuid`    | Primary key                                   |
| `service_id`    | `text`    | FK → `cms_services.id` (e.g. `lawn-mowing`)   |
| `url`           | `text`    | Full image URL (Supabase Storage or external) |
| `alt_en`        | `text`    | English alt text (for SEO)                    |
| `alt_es`        | `text`    | Spanish alt text                              |
| `display_order` | `int`     | Sort order within a service                   |
| `is_active`     | `boolean` | Toggle image visibility                       |

---

## 3. Content Inventory by Page

### 3.1 Global / Shared

**Source**: `src/config/constants.ts`, `src/components/Footer.tsx`, `src/components/Navbar.tsx`

| Item                     | Current Location                           | Admin Field Type     |
| ------------------------ | ------------------------------------------ | -------------------- |
| Phone number             | `constants.ts`                             | Text input           |
| Email address            | `constants.ts`                             | Text input           |
| Business name            | Hardcoded in `Footer.tsx` and `Navbar.tsx` | Text input           |
| Service area text        | `constants.ts`                             | Text input (EN + ES) |
| Facebook URL             | Hardcoded in `Footer.tsx`                  | URL input            |
| Instagram URL            | Hardcoded in `Footer.tsx`                  | URL input            |
| Logo image               | `public/logo-icon.png`                     | Image upload         |
| Hero video URL           | Hardcoded in `Home.tsx`                    | URL input            |
| Hero poster fallback URL | Hardcoded in `Home.tsx`                    | URL input            |

---

### 3.2 Home Page

**Source**: `src/locales/en.json` → `hero`, `trust`, `home` sections + `Home.tsx`

#### Hero Section

| Field                 | i18n Key                     | Admin Field Type             |
| --------------------- | ---------------------------- | ---------------------------- |
| Badge text            | `hero.badge`                 | Text input (EN + ES)         |
| Title line 1          | `hero.title` (before `<1/>`) | Text input (EN + ES)         |
| Title line 2 (italic) | `hero.title` (after `<1/>`)  | Text input (EN + ES)         |
| Subtitle              | `hero.subtitle`              | Textarea (EN + ES)           |
| CTA button text       | `hero.cta`                   | Text input (EN + ES)         |
| Secondary button text | `hero.services`              | Text input (EN + ES)         |
| Background video URL  | Hardcoded in `Home.tsx`      | URL input (in site settings) |

#### Trust Badges

| Field        | i18n Key             | Admin Field Type     |
| ------------ | -------------------- | -------------------- |
| Badge 1 text | `trust.rated5`       | Text input (EN + ES) |
| Badge 2 text | `trust.fullyInsured` | Text input (EN + ES) |
| Badge 3 text | `trust.yearsExp`     | Text input (EN + ES) |
| Badge 4 text | `trust.certified`    | Text input (EN + ES) |

#### Featured Services Section

| Field                       | i18n Key                                        | Admin Field Type                                                           |
| --------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| Badge                       | `home.whatWeDo.badge`                           | Text input (EN + ES)                                                       |
| Title                       | `home.whatWeDo.title`                           | Text input (EN + ES)                                                       |
| "View All" link text        | `home.whatWeDo.viewAll`                         | Text input (EN + ES)                                                       |
| Which services are featured | Hardcoded as indexes `[0, 5, 14]` in `Home.tsx` | Multi-select from services list (via `is_featured` flag in `cms_services`) |

#### Why Us Section

| Field                | i18n Key                         | Admin Field Type              |
| -------------------- | -------------------------------- | ----------------------------- |
| Badge                | `home.whyUs.badge`               | Text input (EN + ES)          |
| Title                | `home.whyUs.title`               | Text input (EN + ES)          |
| Stats count label    | `home.whyUs.stats`               | Text input (EN + ES)          |
| Stats number         | Hardcoded as `1k+` in `Home.tsx` | Text input (in site settings) |
| Right-side image URL | Hardcoded URL in `Home.tsx`      | Image upload / URL            |
| Point 1 title        | `home.whyUs.quality.title`       | Text input (EN + ES)          |
| Point 1 description  | `home.whyUs.quality.desc`        | Textarea (EN + ES)            |
| Point 2 title        | `home.whyUs.reliable.title`      | Text input (EN + ES)          |
| Point 2 description  | `home.whyUs.reliable.desc`       | Textarea (EN + ES)            |
| Point 3 title        | `home.whyUs.passionate.title`    | Text input (EN + ES)          |
| Point 3 description  | `home.whyUs.passionate.desc`     | Textarea (EN + ES)            |

#### Testimonials Section

| Field           | i18n Key                     | Admin Field Type                                    |
| --------------- | ---------------------------- | --------------------------------------------------- |
| Quote text      | `home.testimonials.quote`    | Textarea (EN + ES) — pulled from `cms_testimonials` |
| Author name     | `home.testimonials.author`   | Text input                                          |
| Author location | `home.testimonials.location` | Text input                                          |

#### Bottom CTA Section

| Field                 | i18n Key            | Admin Field Type     |
| --------------------- | ------------------- | -------------------- |
| Title line 1          | `home.cta.title`    | Text input (EN + ES) |
| Title line 2 (italic) | `home.cta.title`    | Text input (EN + ES) |
| Subtitle              | `home.cta.subtitle` | Textarea (EN + ES)   |
| Button text           | `home.cta.button`   | Text input (EN + ES) |

---

### 3.3 About Page

**Source**: `src/locales/en.json` → `about` section + hardcoded values in `About.tsx`

#### Story Section

| Field           | i18n Key                              | Admin Field Type     |
| --------------- | ------------------------------------- | -------------------- |
| Badge           | `about.story.badge`                   | Text input (EN + ES) |
| Title           | `about.story.title`                   | Text input (EN + ES) |
| Body paragraph  | `about.story.content`                 | Textarea (EN + ES)   |
| Pull quote      | `about.story.quote`                   | Textarea (EN + ES)   |
| Story image URL | Hardcoded Unsplash URL in `About.tsx` | Image upload         |

#### Values Grid

| Field                 | i18n Key                      | Admin Field Type     |
| --------------------- | ----------------------------- | -------------------- |
| Mission card title    | `about.mission.title`         | Text input (EN + ES) |
| Mission card content  | `about.mission.content`       | Textarea (EN + ES)   |
| Promise card title    | `about.promise.title`         | Text input (EN + ES) |
| Promise card content  | `about.promise.content`       | Textarea (EN + ES)   |
| Team card title       | `about.team.card.title`       | Text input (EN + ES) |
| Team card description | `about.team.card.description` | Textarea (EN + ES)   |

#### Team Section

| Field               | i18n Key                                    | Admin Field Type     |
| ------------------- | ------------------------------------------- | -------------------- |
| Section badge       | `about.team.badge`                          | Text input (EN + ES) |
| Section title       | `about.team.title`                          | Text input (EN + ES) |
| Section description | `about.team.description`                    | Textarea (EN + ES)   |
| **Domingo — Name**  | Hardcoded `"Domingo Canela"` in `About.tsx` | Text input           |
| **Domingo — Role**  | `about.members.domingo`                     | Text input (EN + ES) |
| **Domingo — Photo** | Hardcoded Unsplash URL in `About.tsx`       | Image upload         |
| **Nora — Name**     | Hardcoded `"Nora Canela"` in `About.tsx`    | Text input           |
| **Nora — Role**     | `about.members.nora`                        | Text input (EN + ES) |
| **Nora — Photo**    | Hardcoded Unsplash URL in `About.tsx`       | Image upload         |

> [!IMPORTANT]
> Team members are currently hardcoded as a JS array in `About.tsx`. They need to be moved to the `cms_team_members` table so the admin can update names, roles, and photos without a code deployment.

---

### 3.4 Services Page

**Source**: `src/locales/en.json` → `servicesPage`, `services` sections + `src/data/services.ts`

#### Page Header

| Field    | i18n Key                | Admin Field Type     |
| -------- | ----------------------- | -------------------- |
| Badge    | `servicesPage.badge`    | Text input (EN + ES) |
| Title    | `servicesPage.title`    | Text input (EN + ES) |
| Subtitle | `servicesPage.subtitle` | Textarea (EN + ES)   |

#### CTA Block

| Field           | i18n Key                    | Admin Field Type     |
| --------------- | --------------------------- | -------------------- |
| CTA title       | `servicesPage.cta.title`    | Text input (EN + ES) |
| CTA subtitle    | `servicesPage.cta.subtitle` | Textarea (EN + ES)   |
| CTA button text | `servicesPage.cta.button`   | Text input (EN + ES) |

#### Services List (15 services, each with):

All currently in `src/data/services.ts` AND duplicated in `en.json`/`es.json`. After migration, the single source of truth is `cms_services`.

| Field            | Source                                                   | Admin Field Type           |
| ---------------- | -------------------------------------------------------- | -------------------------- |
| Title            | `services.[id].title` in both JSON + `services.ts`       | Text input (EN + ES)       |
| Description      | `services.[id].description` in both JSON + `services.ts` | Textarea (EN + ES)         |
| Category         | `service.category` in `services.ts`                      | Dropdown select            |
| Icon             | `service.icon` in `services.ts`                          | Icon picker (Lucide names) |
| Featured on home | Hardcoded indexes in `Home.tsx`                          | Toggle (checkbox)          |
| Active/visible   | Not present                                              | Toggle (checkbox)          |
| Display order    | Implicit (array order)                                   | Number input               |

**All 15 services:**
`lawn-mowing`, `edges`, `lawn-maintenance`, `bush-trimming`, `weeds`, `mulch`, `top-soil`, `reseeding`, `storm-cleanup`, `yard-cleanup`, `leaf-cleanup`, `patios`, `seasonal-cleanup`, `gravel`, `snow-plow`

---

### 3.5 Gallery Page

**Source**: `src/locales/en.json` → `gallery` section + hardcoded `serviceImages` map in `Gallery.tsx` + `src/data/gallery-assets.ts`

#### Page Header

| Field    | i18n Key           | Admin Field Type     |
| -------- | ------------------ | -------------------- |
| Badge    | `gallery.badge`    | Text input (EN + ES) |
| Title    | `gallery.title`    | Text input (EN + ES) |
| Subtitle | `gallery.subtitle` | Textarea (EN + ES)   |

#### Bottom CTA Block

| Field                | i18n Key                                | Admin Field Type     |
| -------------------- | --------------------------------------- | -------------------- |
| CTA title line 1     | `gallery.cta.title`                     | Text input (EN + ES) |
| CTA subtitle         | `gallery.cta.subtitle`                  | Textarea (EN + ES)   |
| CTA button text      | `gallery.cta.button`                    | Text input (EN + ES) |
| CTA background image | Hardcoded Unsplash URL in `Gallery.tsx` | Image upload         |

#### Gallery Images

Currently hardcoded in two places:

1. **`src/data/gallery-assets.ts`** — used for prefetching only
2. **`serviceImages` Record inside `Gallery.tsx`** — maps each of the 15 service IDs to an array of 1–3 image URLs

All of these move to **`cms_gallery_images`** table, linked to services via `service_id`.

> [!IMPORTANT]
> This is the largest content migration. There are ~40+ image entries currently hardcoded in `Gallery.tsx` (lines 10–66). Each one needs to become a row in `cms_gallery_images` with `service_id`, `url`, `alt_en`, `alt_es`, and `display_order`.

---

### 3.6 Contact Page

**Source**: `src/locales/en.json` → `contact` section + `src/config/constants.ts`

#### Page Header

| Field    | i18n Key           | Admin Field Type     |
| -------- | ------------------ | -------------------- |
| Badge    | `contact.badge`    | Text input (EN + ES) |
| Title    | `contact.title`    | Text input (EN + ES) |
| Subtitle | `contact.subtitle` | Textarea (EN + ES)   |

#### Contact Info Sidebar

| Field               | i18n Key                         | Admin Field Type                   |
| ------------------- | -------------------------------- | ---------------------------------- |
| Call section title  | `contact.info.call.title`        | Text input (EN + ES)               |
| Business hours      | `contact.info.call.hours`        | Text input (EN + ES)               |
| Email section title | `contact.info.email.title`       | Text input (EN + ES)               |
| Reply time          | `contact.info.email.reply`       | Text input (EN + ES)               |
| Area section title  | `contact.info.area.title`        | Text input (EN + ES)               |
| Phone number        | `constants.ts` → `PHONE_NUMBER`  | Text input (site settings)         |
| Email address       | `constants.ts` → `EMAIL_ADDRESS` | Text input (site settings)         |
| Location text       | `constants.ts` → `LOCATION_TEXT` | Text input (site settings / EN+ES) |

#### Contact Form Labels (these can change per admin preference)

| Field           | i18n Key                      | Admin Field Type     |
| --------------- | ----------------------------- | -------------------- |
| Form title      | `contact.form.title`          | Text input (EN + ES) |
| Name label      | `contact.form.labels.name`    | Text input (EN + ES) |
| Email label     | `contact.form.labels.email`   | Text input (EN + ES) |
| Phone label     | `contact.form.labels.phone`   | Text input (EN + ES) |
| Message label   | `contact.form.labels.message` | Text input (EN + ES) |
| Service label   | `contact.form.labels.service` | Text input (EN + ES) |
| Submit button   | `contact.form.button`         | Text input (EN + ES) |
| Success message | `contact.form.success`        | Textarea (EN + ES)   |

> [!NOTE]
> The contact form service dropdown options (`Lawn Maintenance`, `Garden Cleanup`, etc.) can be auto-generated from the `cms_services` table names — no separate migration needed.

---

### 3.7 Footer

**Source**: `src/locales/en.json` → `footer` section + hardcoded social URLs + `constants.ts`

| Field                      | i18n Key                                     | Admin Field Type          |
| -------------------------- | -------------------------------------------- | ------------------------- |
| Tagline/description        | `footer.description`                         | Textarea (EN + ES)        |
| Facebook URL               | Hardcoded in `Footer.tsx`                    | URL input (site settings) |
| Instagram URL              | Hardcoded in `Footer.tsx`                    | URL input (site settings) |
| Copyright text pattern     | Hardcoded `"© {year} Canela Landscaping..."` | Text input (EN + ES)      |
| Quick links section title  | `footer.quickLinks`                          | Text input (EN + ES)      |
| Services section title     | `footer.serviceLinks.title`                  | Text input (EN + ES)      |
| Contact info section title | `footer.contactInfo`                         | Text input (EN + ES)      |

> [!NOTE]
> Footer navigation link labels are already translated. Their destinations (paths) are hardcoded routes and do not need CMS control.

---

## 4. Admin Panel — New Pages Needed

All new pages live under `/admin/*` and are protected by `<ProtectedRoute>`.

### New Routes to Create

| Route                     | Page Component                  | Purpose                                |
| ------------------------- | ------------------------------- | -------------------------------------- |
| `/admin`                  | `AdminDashboard.tsx` (existing) | Leads inbox — already done             |
| `/admin/content/home`     | `AdminHome.tsx`                 | Edit all Home page content             |
| `/admin/content/about`    | `AdminAbout.tsx`                | Edit About page + team members         |
| `/admin/content/services` | `AdminServices.tsx`             | Edit, add, reorder, hide services      |
| `/admin/content/gallery`  | `AdminGallery.tsx`              | Upload images, assign to services      |
| `/admin/content/contact`  | `AdminContact.tsx`              | Edit Contact page text                 |
| `/admin/content/settings` | `AdminSettings.tsx`             | Phone, email, social links, hero video |

### Admin Sidebar Navigation

The admin panel needs a persistent left sidebar linking to all `/admin/content/*` routes. Currently there is no sidebar — only a single-page dashboard.

### Admin UI Components Needed

- **Live preview toggle** — a side-by-side or tab view (EN / ES) so the admin can see both languages at once while editing
- **Inline save** — auto-save on blur or explicit "Save" button per section
- **Image uploader** — drag-and-drop upload to Supabase Storage, shows preview
- **Reorder list** — drag handles for services and gallery images
- **Rich text hint** — for longer fields (story content, testimonials), consider a minimal rich-text editor or at least multi-line `<textarea>`

---

## 5. Frontend Changes Required

### Remove / Replace

| File                         | Change                                                                 |
| ---------------------------- | ---------------------------------------------------------------------- |
| `src/locales/en.json`        | Delete after all keys are migrated to `cms_pages`                      |
| `src/locales/es.json`        | Delete after all keys are migrated to `cms_pages`                      |
| `src/data/services.ts`       | Delete after data is seeded into `cms_services`                        |
| `src/data/gallery-assets.ts` | Delete after images are seeded into `cms_gallery_images`               |
| `src/config/constants.ts`    | Delete after values are seeded into `cms_site_settings`                |
| `src/i18n.ts`                | Delete (or convert to a thin wrapper that passes the language through) |

### New Hook: `useContent()`

Replaces `useTranslation()` across the frontend.

```ts
// src/hooks/useContent.ts (conceptual)
const useContent = () => {
  const { language } = useCurrentLanguage(); // 'en' or 'es'
  const getData = (page: string, section: string, field: string): string => {
    // Returns value_en or value_es from the cached CMS store
  };
  return { getData };
};
```

### Caching Strategy

Because the site content changes infrequently, the CMS data should be:

1. Fetched once on app load and stored in a React context (`CMSContext`)
2. Re-fetched when a CMS write occurs (admin saves a field)
3. On Vercel, optionally cached via ISR (Incremental Static Regeneration) or stale-while-revalidate if switching to Next.js in the future

### Image References

All `src` attributes that currently point to Unsplash or hardcoded paths need to pull from the database. The `public/images/` folder can remain for images that were uploaded locally — they just need to be re-registered as rows in `cms_gallery_images`.

---

## 6. Migration Strategy (Codified Steps)

Execute in this order to minimize downtime and risk:

### Phase 1 — Database Setup

1. Create SQL migration: `cms_site_settings` table
2. Create SQL migration: `cms_pages` table
3. Create SQL migration: `cms_services` table (with `is_featured`, `display_order`, `is_active`)
4. Create SQL migration: `cms_team_members` table
5. Create SQL migration: `cms_testimonials` table
6. Create SQL migration: `cms_gallery_images` table
7. Set RLS policies on all CMS tables:
   - `SELECT` → public (anon role) — the site must be able to read content
   - `INSERT/UPDATE/DELETE` → authenticated only (admins)

### Phase 2 — Seed All Content

8. Write a seed script (`supabase/seed.sql` or a one-time run script) that inserts all current content from JSON files and TypeScript data files into the new tables
9. Verify seed data completeness by cross-checking against `en.json` and `services.ts`

### Phase 3 — Build Admin UI

10. Add admin sidebar navigation component
11. Build `AdminSettings.tsx` (site-wide config)
12. Build `AdminHome.tsx`
13. Build `AdminAbout.tsx` (including team member CRUD)
14. Build `AdminServices.tsx` (with drag-to-reorder and toggle)
15. Build `AdminGallery.tsx` (with image uploader to Supabase Storage)
16. Build `AdminContact.tsx`

### Phase 4 — Update Frontend

17. Create `CMSContext` and `CMSProvider` — fetches all CMS data on app load
18. Create `useContent()` hook
19. Replace `useTranslation()` calls with `useContent()` across all components, page by page
20. Replace all hardcoded values (team photos, hero video, etc.) with CMS-driven values

### Phase 5 — Cleanup

21. Delete `src/locales/en.json` and `es.json`
22. Delete `src/data/services.ts`, `src/data/gallery-assets.ts`, `src/config/constants.ts`
23. Delete `src/i18n.ts`
24. Run `npm run build` to verify no broken imports
25. Deploy and smoke-test all pages

---

## 7. Files to Delete After Migration

| File                                       | Replaced By                             |
| ------------------------------------------ | --------------------------------------- |
| `src/locales/en.json`                      | `cms_pages` + `cms_services` tables     |
| `src/locales/es.json`                      | `cms_pages` + `cms_services` tables     |
| `src/data/services.ts`                     | `cms_services` table                    |
| `src/data/gallery-assets.ts`               | `cms_gallery_images` table              |
| `src/config/constants.ts`                  | `cms_site_settings` table               |
| `src/i18n.ts`                              | `CMSContext` / `useContent()` hook      |
| `src/components/TemporaryManualExport.tsx` | Already deprecated — delete immediately |

---

## 8. Open Questions & Decisions

> [!IMPORTANT]
> These must be answered before implementation begins.

1. **Caching**: Should the frontend fetch CMS content on every page load (live, always up to date) or cache it for a set TTL? A `stale-while-revalidate` strategy is recommended to keep the site fast.

2. **Image Storage**: Should uploaded gallery photos go into Supabase Storage (recommended — keeps everything in one place) or remain in `public/images/`? Supabase Storage allows admin uploads without code changes.

3. **Rich Text**: Are any fields (story content, mission statement) expected to support bold/italic/links in the future? If yes, a rich-text field type (even just Markdown) should be planned now rather than retro-fitted.

4. **Draft / Publish Workflow**: Should admins be able to draft changes before publishing? Or is every save immediately live? For simplicity, **save = live** is recommended for v1.

5. **Admin URL**: Currently `/admin` redirects to the dashboard. The new content pages would be at `/admin/content/...`. Confirm this structure is acceptable.

6. **Multiple Testimonials**: The current site shows only one testimonial. The `cms_testimonials` table is designed as a list. Does the admin want to manage multiple testimonials and rotate them, or is one always sufficient?

---

_Document prepared for Canela Landscaping & Snow Plow — Cleveland, Ohio_  
_Last updated: April 2026_
