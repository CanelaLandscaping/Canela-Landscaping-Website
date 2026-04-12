# 🌿 Canela Landscaping — SEO & Metadata Launch Guide

> **Goal**: Rank on Page 1 of Google when Cleveland-area homeowners search for landscaping, lawn care, and snow removal services.

---

## 📋 Table of Contents

1. [Google My Business (Most Important!)](#1-google-my-business-most-important)
2. [On-Page HTML Metadata](#2-on-page-html-metadata)
3. [Structured Data (Schema.org)](#3-structured-data-schemaorg)
4. [Google Search Console](#4-google-search-console)
5. [Directory Listings (Citations)](#5-directory-listings-citations)
6. [Content Strategy & Local Keywords](#6-content-strategy--local-keywords)
7. [Image SEO](#7-image-seo)
8. [Performance & Core Web Vitals](#8-performance--core-web-vitals)
9. [Backlink Building](#9-backlink-building)
10. [Monthly Checklist](#10-monthly-checklist)

---

## 1. Google My Business (Most Important!)

> [!IMPORTANT]
> This is the single highest-impact action you can take. A fully optimized GMB profile drives local map pack rankings ("landscapers near me").

### Steps:
1. Go to [business.google.com](https://business.google.com) and claim your business.
2. Use the **exact** business name: `Canela Landscaping & Snow Plow`
3. Set your **primary category**: `Landscaping Company`
4. Add **secondary categories**: `Lawn Care Service`, `Snow Removal Service`, `Gardening Service`
5. Add your **service area**: Cleveland, OH — Lakewood, Parma, Strongsville, Westlake, Solon, Beachwood, Shaker Heights, Euclid
6. Fill in all fields:
   - Phone: `(216) 538-4311`
   - Website: `https://canelalandscaping.com`
   - Hours of operation
7. Upload **at least 10 photos** of completed jobs (use your best before/after photos)
8. Enable **messaging** so customers can text you directly from Google

### Ongoing:
- **Post weekly updates** (e.g., "Spring cleanups are here! Book now for Cleveland area.")
- **Respond to every review** within 24 hours
- Ask every satisfied customer to leave a Google Review

---

## 2. On-Page HTML Metadata

These changes need to be made in `index.html` and in each page's `<head>`. Since this is a Vite/React SPA, you'll want to use `react-helmet-async` or Vite's `index.html`.

### Install react-helmet-async:
```bash
npm install react-helmet-async
```

### Recommended `<title>` tags per page:

| Page | Title Tag (max 60 chars) |
|------|--------------------------|
| Home | `Canela Landscaping & Snow Plow \| Cleveland, OH` |
| Services | `Landscaping Services Cleveland OH \| Canela` |
| Gallery | `Our Work Gallery \| Canela Landscaping Cleveland` |
| About | `About Canela Landscaping \| Cleveland Lawn Experts` |
| Contact | `Get a Free Quote \| Canela Landscaping Cleveland OH` |

### Recommended meta descriptions per page:

| Page | Meta Description (max 160 chars) |
|------|----------------------------------|
| Home | `Premium landscaping & snow removal in Cleveland, OH. Lawn care, mulching, cleanup, and more. Family-owned. Free estimates. Call (216) 538-4311.` |
| Services | `Full-service landscaping in Cleveland: lawn mowing, bush trimming, patio repair, leaf removal, and snow plowing. Serving Greater Cleveland, OH.` |
| Gallery | `Browse Canela Landscaping's project gallery. Real lawn care and snow plow jobs completed across Cleveland, Lakewood, Parma, and surrounding areas.` |
| Contact | `Request a free estimate from Canela Landscaping & Snow Plow in Cleveland, OH. Serving all of greater Cleveland. Call or fill out our form today.` |

### Update `index.html`:
```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/logo-icon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary SEO -->
  <title>Canela Landscaping & Snow Plow | Cleveland, OH</title>
  <meta name="description" content="Premium landscaping & snow removal in Cleveland, OH. Lawn care, mulching, cleanup, and more. Family-owned. Free estimates. Call (216) 538-4311." />
  <meta name="keywords" content="landscaping Cleveland OH, lawn care Cleveland, snow removal Cleveland, lawn mowing Cleveland Ohio, leaf cleanup Cleveland" />

  <!-- Geographic Tags -->
  <meta name="geo.region" content="US-OH" />
  <meta name="geo.placename" content="Cleveland, Ohio" />

  <!-- Open Graph (for Facebook & link previews) -->
  <meta property="og:title" content="Canela Landscaping & Snow Plow | Cleveland, OH" />
  <meta property="og:description" content="Premium landscaping & snow removal in Cleveland, OH. Free estimates. Call (216) 538-4311." />
  <meta property="og:image" content="https://canelalandscaping.com/og-image.jpg" />
  <meta property="og:url" content="https://canelalandscaping.com" />
  <meta property="og:type" content="website" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://canelalandscaping.com" />
</head>
```

> [!TIP]
> Create a 1200×630px image of your best work (or your logo on a green background) and save it as `public/og-image.jpg`. This shows up as the preview image when anyone shares your site link.

---

## 3. Structured Data (Schema.org)

Structured data tells Google exactly what your business is. Add this JSON-LD script to `index.html` before `</body>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://canelalandscaping.com",
  "name": "Canela Landscaping & Snow Plow",
  "image": "https://canelalandscaping.com/og-image.jpg",
  "description": "Premium landscaping and snow removal services in Cleveland, Ohio. Specializing in lawn care, mulching, cleanup, patio repair, and 24/7 snow plowing.",
  "url": "https://canelalandscaping.com",
  "telephone": "(216) 538-4311",
  "email": "contact@canelalandscaping.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cleveland",
    "addressRegion": "OH",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.4993,
    "longitude": -81.6944
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "areaServed": [
    "Cleveland, OH",
    "Lakewood, OH",
    "Parma, OH",
    "Strongsville, OH",
    "Westlake, OH",
    "Shaker Heights, OH",
    "Euclid, OH"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Landscaping Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Lawn Mowing" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Snow Removal" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mulch Installation" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Patio Repair & Masonry" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Leaf Removal" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bush & Hedge Trimming" } }
    ]
  },
  "sameAs": [
    "https://www.facebook.com/canelalandscaping",
    "https://www.instagram.com/canelalandscaping"
  ]
}
</script>
```

---

## 4. Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property: `https://canelalandscaping.com`
3. Verify via the HTML file method (download a file, upload to `/public`)
4. Submit your **sitemap**: `https://canelalandscaping.com/sitemap.xml`

### Generate a sitemap:
Install the Vite sitemap plugin:
```bash
npm install vite-plugin-sitemap --save-dev
```

Add to `vite.config.ts`:
```ts
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://canelalandscaping.com',
      dynamicRoutes: ['/', '/services', '/gallery', '/about', '/contact'],
    }),
  ],
});
```

---

## 5. Directory Listings (Citations)

> [!IMPORTANT]
> **NAP Consistency** (Name, Address, Phone) must be identical across every listing. Use exactly:
> - Name: `Canela Landscaping & Snow Plow`
> - Phone: `(216) 538-4311`
> - Website: `https://canelalandscaping.com`

### Priority Directories to Submit To:

| Directory | URL | Priority |
|-----------|-----|----------|
| Google My Business | business.google.com | 🔴 Critical |
| Yelp | yelp.com/biz | 🔴 Critical |
| Bing Places | bingplaces.com | 🔴 Critical |
| Apple Maps | mapsconnect.apple.com | 🟠 High |
| Angi (Angie's List) | angi.com | 🟠 High |
| HomeAdvisor | homeadvisor.com | 🟠 High |
| Thumbtack | thumbtack.com | 🟠 High |
| Facebook Business | facebook.com/business | 🟠 High |
| Yellow Pages | yellowpages.com | 🟡 Medium |
| Houzz | houzz.com | 🟡 Medium |
| Nextdoor | nextdoor.com | 🟡 Medium |
| BBB | bbb.org | 🟡 Medium |

---

## 6. Content Strategy & Local Keywords

### High-Value Keywords to Target:

**High Intent (People ready to hire):**
- `landscaping company Cleveland Ohio`
- `snow removal Cleveland OH`
- `lawn mowing service Cleveland`
- `mulch installation Cleveland`
- `leaf cleanup Cleveland Ohio`

**Long-tail (Less competition, easier to rank):**
- `affordable landscaping Cleveland Ohio`
- `snow plowing Cleveland residential`
- `spring cleanup service Cleveland OH`
- `patio repair masonry Cleveland`
- `bush trimming service Lakewood Ohio`

### How to Use These:
- Include keywords naturally in `<h1>`, `<h2>`, and paragraph text
- Add city/neighborhood names throughout the site (e.g., "serving Parma and Lakewood")
- Never stuff keywords — write naturally for humans first

---

## 7. Image SEO

All images should have descriptive `alt` text that includes your service and location:

```jsx
// ❌ Bad
<img src="/images/lawn-1.webp" alt="photo" />

// ✅ Good
<img src="/images/lawn-1.webp" alt="Lawn mowing service in Lakewood, Ohio by Canela Landscaping" />
```

**Quick wins:**
- Rename image files from `IMG_0032.jpg` → `lawn-mowing-cleveland-ohio.webp`
- Compress all images to WebP format (already done ✅)
- Add width/height attributes to prevent layout shift

---

## 8. Performance & Core Web Vitals

Google uses page speed as a ranking factor. Run these checks after launch:

1. **Google PageSpeed Insights**: [pagespeed.web.dev](https://pagespeed.web.dev) — aim for 90+ on mobile
2. **GTmetrix**: [gtmetrix.com](https://gtmetrix.com) — check for large images or render-blocking scripts
3. **Vercel Analytics**: Enable in your Vercel dashboard (free tier) for real user metrics

### Current optimizations already in place ✅:
- Images served as `.webp` (next-gen format)
- `loading="lazy"` on gallery images
- Framer Motion animations (GPU-accelerated)

---

## 9. Backlink Building

Backlinks (other sites linking to yours) are a major ranking signal.

### Easy wins:
- Ask the **Chamber of Commerce** ([clevelandchamber.com](https://clevelandchamber.com)) to list your business
- List on **Ohio-specific directories** (Ohio Small Business Association, etc.)
- If you sponsor a local event or sports team, ask to be listed on their website
- Partner with a local real estate agent — get mentioned as their "trusted landscaper"
- Ask past customers with a blog or Facebook page to mention you

---

## 10. Monthly Checklist

Run through this every month after launch:

- [ ] Post at least 2 updates on Google My Business
- [ ] Respond to all new Google Reviews
- [ ] Ask at least 2 satisfied customers for a Google Review
- [ ] Check Search Console for new search queries and errors
- [ ] Verify NAP is consistent if you added any new directory listings
- [ ] Upload 2-3 new job photos to Google My Business gallery
- [ ] Check PageSpeed Insights score — keep mobile above 85

---

*Prepared for Canela Landscaping & Snow Plow — Cleveland, Ohio*
