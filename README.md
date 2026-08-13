<div align="center">

<img src="/assets/images/ui/favicon.png" alt="PinnedPicks Logo" width="72" />

# PinnedPicks™

**A modern curated product discovery platform based in the Philippines**

*Find trending products from Shopee without the endless scroll.*

[![Status](https://img.shields.io/badge/status-active%20development-c8521a?style=flat-square)](https://www.pinnedpicks.gt.tc/)
[![Built With](https://img.shields.io/badge/built%20with-HTML%20%7C%20CSS%20%7C%20Vanilla%20JS-4a90d9?style=flat-square)](#technologies)
[![Backend](https://img.shields.io/badge/backend-Supabase%20%7C%20PostgreSQL-3ecf8e?style=flat-square&logo=supabase)](#technologies)
[![Hosted On](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-24292e?style=flat-square&logo=github)](https://www.pinnedpicks.gt.tc/)
[![License](https://img.shields.io/badge/license-Proprietary-gray?style=flat-square)](#license)
[![Affiliate](https://img.shields.io/badge/affiliate-Shopee-f05a28?style=flat-square)](#affiliate-disclosure)

[Visit Site](https://www.pinnedpicks.gt.tc/) · [Submit Feedback](https://forms.gle/m9ZJ9iqkeFS1zyig6) · [Saved Pins](https://www.pinnedpicks.gt.tc/pages/saved.html)

</div>

---

## What Is PinnedPicks™?

PinnedPicks™ is a curated product discovery platform designed to cut through the noise of modern online shopping. Instead of overwhelming users with cluttered catalogs and endless listings, it focuses on hand-picked, editorial-style collections organized by category: fashion, tech, lifestyle, room décor, beauty, and everyday essentials.

The goal is simple: help people discover products worth exploring, without opening five different apps.

---

## About the Project

PinnedPicks™ started as an independent early-stage web platform with a clear focus: make product discovery feel intentional rather than exhausting.

The platform currently curates products from one affiliate partner ecosystem:

| Platform | Region Focus |
|----------|-------------|
| **Shopee** | Philippines & Southeast Asia |

Users can browse collections by category, save products locally to their device, and revisit their favorite finds through a dedicated **Saved Pins** experience, no account or login required.

---

## Core Features

### 🔍 Product Discovery
- Curated product collections across multiple categories
- Pinterest-inspired editorial card layout
- Horizontal browsing sections optimized for mobile
- Responsive product grid with smooth interactions
- In-page search across all curated products

### 📌 Save Pins System
- Save products locally using browser `localStorage`
- Persistent saved state across sessions, no login needed
- Dedicated `/pages/saved.html` page for bookmarked picks
- Dynamic client-side rendering of saved products
- Remove individual saves or clear all at once

### 🌗 Theme System
- Dark mode / light mode toggle
- Theme preference persisted via `localStorage`
- Consistent theming across all pages
- Respects system `prefers-color-scheme` for initial state

### 📱 Responsive & Mobile-First
- Mobile-first layout and spacing
- Touch-friendly horizontal scroll sections
- Optimized typography scaling across breakpoints
- PWA-ready with `manifest.json` and home screen install support

### 🔎 SEO & Discoverability
- Enterprise-grade metadata architecture across all pages
- Full Open Graph and Twitter/X card implementation
- JSON-LD structured data: `WebSite`, `Organization`, `CollectionPage`, `AboutPage`, `WebPage`, `BreadcrumbList`, `FAQPage`, `SearchAction`
- Google, Pinterest, and Bing site verification
- Canonical URLs, geo metadata, and `robots` directives
- Accurate XML sitemap with image indexing

### 🗄️ Product Backend
- Live product catalog served from a PostgreSQL database via Supabase
- Row Level Security restricts public access to read-only, active listings
- Frontend fetches products client-side through the Supabase JS client, no build step required
- Internal, unpublished intake tool converts affiliate links and queues new products for review before they go live

---

## Technologies

PinnedPicks™ ships as a static site: no frameworks, no build step, backed by a lightweight serverless data layer.

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (custom properties, no preprocessor) |
| Logic | Vanilla JavaScript (ES6+) |
| Product Database | Supabase (PostgreSQL) with Row Level Security |
| Serverless Functions | Supabase Edge Functions (Deno) |
| Affiliate Links | Involve Asia API (deeplink generation) |
| Client-Side Persistence | Browser `localStorage` (theme, saved pins) |
| Fonts | Google Fonts (DM Serif Display, DM Sans) |
| Analytics | Google Analytics 4 via Google Tag Manager |
| Hosting | GitHub Pages |
| PWA | Web App Manifest |

No external UI frameworks, no npm build pipeline for the site itself. Supabase's client library is loaded directly, and product data is fetched at runtime rather than baked in at build time.

---

## Development Status

PinnedPicks™ is in **active early-stage development**, temporarily hosted on GitHub Pages while features and UX continue to evolve.

### Current Priorities
- Expanding curated product collections
- Refining mobile browsing experience
- Improving accessibility (ARIA, keyboard nav, contrast)
- Optimizing frontend performance (LCP, CLS)
- Enhancing save and personalization systems
- Streamlining the internal product intake workflow

### Planned Future Improvements
- Advanced filtering and category search
- Personalized or trending product signals
- Expanded platform integrations beyond Shopee (Lazada planned next)
- Richer editorial collection pages
- Performance optimizations for Core Web Vitals

---

## Philosophy

PinnedPicks™ is built around the idea that product discovery should feel **intentional**, not overwhelming.

> Not another bloated affiliate catalog. A curated discovery experience that helps users quickly find products worth exploring.

Design principles that guide every decision:

- **Visually clean**: editorial over catalog
- **Lightweight**: no unnecessary dependencies
- **Inspiring**: products presented with context, not just specs
- **Practical**: real picks for real people
- **User-focused**: no dark patterns, no spam

---

## Affiliate Disclosure

PinnedPicks™ participates in affiliate programs with Shopee and other selected ecommerce platforms, via Involve Asia's affiliate network. Some outbound product links may generate a commission when purchases are made through affiliate referrals, **at no additional cost to you**.

All product selections and editorial recommendations are curated independently. Affiliate relationships do not influence which products are featured.

---

## Local Storage Usage

PinnedPicks™ uses `localStorage` in the browser for two things only:

| Key | Purpose |
|-----|---------|
| Theme preference | Remembers light or dark mode between visits |
| Saved Pins | Persists bookmarked products locally on your device |

This data **never leaves your device** and is not transmitted to any external server. You can clear it at any time through your browser settings.

The product catalog itself is served read-only from Supabase and does not identify or track individual visitors.

---

## Feedback & Suggestions

Community feedback plays an important role in improving the platform. Bug reports, usability issues, and feature suggestions are all appreciated.

**[Submit Feedback →](https://forms.gle/m9ZJ9iqkeFS1zyig6)**

---

## License

The PinnedPicks™ brand, logo, and platform assets are **proprietary**. Please do not redistribute branded assets, platform identity elements, or curated content without permission.

The underlying HTML/CSS/JS structure and backend architecture are independently developed by **Centrilign**.

---

<div align="center">

**PinnedPicks™ by Centrilign** · Founded May 2026 · Philippines 🇵🇭

[pinnedpicks.gt.tc](https://www.pinnedpicks.gt.tc/) · [Pinterest](https://pinterest.com/centrilign_pinnedpicks/) · [Facebook](https://www.facebook.com/profile.php?id=61589260348084) · [Instagram](https://www.instagram.com/pinnedpicks.centrilign/)

</div>