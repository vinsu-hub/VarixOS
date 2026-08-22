---
tags: [varix, beautybooth, product, project, status]
---

# BeautyBooth

Part of [[Varix - Overview]] — an internal product build, a full-stack Philippine local beauty-services marketplace.

## Quick Links
- [[BeautyBooth - Booking & Payments]] — booking workflow, GCash payment, proof uploads, status transitions
- [[BeautyBooth - Vendor Workspace]] — vendor panel, service CRUD, portfolio, subscription limits
- [[BeautyBooth - Admin Operations]] — admin panel, vendor review, payment disputes, moderation

## What it is
A full-stack Philippine local beauty-services marketplace with a mobile-first pink/plum interface. Customers can discover approved vendors, browse by category, view vendor profiles, select live services, choose booking dates and times, submit GCash payment references and proof, and track booking progress.

## One-liner
Philippine beauty-services marketplace — discover, book, and pay local beauty vendors in one place.

## Tagline
*"Your beauty, your booking."*

Alt options:
- "Book local beauty."
- "Where beauty meets easy."

## Customer Experience
The customer side includes a branded home page, vendor discovery in list and map modes, Google Maps-based location search, Philippine service categories, vendor profiles, live service catalogs, booking flow, appointment-mode navigation, profile/account views, notifications, help center, GCash payment methods, privacy information, and edit-profile screens. The fixed bottom navigation remains available during scrolling on mobile and desktop.

### Live Catalog
Active offerings for **Nails, Makeup, Hair, Skin Care, and Brows & Lashes**. Each category has Philippine Peso pricing, service descriptions, durations, and customization metadata. A custom nail-extension offering is also available for customer selection and booking.

## Capabilities & Use Cases

**Capabilities**
- Vendor discovery in list and map modes with Google Maps integration
- Philippine service categories (Nails, Makeup, Hair, Skin Care, Brows & Lashes)
- Live service catalogs with PHP pricing, descriptions, durations, customization metadata
- Booking flow with date/time selection, booking totals, notes, and customization options
- GCash-only payment submission with reference number and proof upload
- Booking status tracking: `pending_payment`, `confirmed`, `in_progress`, `completed`, `cancelled`, `expired`, `no_show`
- Booking-overlap protection and server-authorized booking transitions
- 24-hour unconfirmed-payment dispute rule
- Customer profile with account views, notifications, help center
- Vendor workspace with service CRUD, portfolio management, subscription limits
- Admin panel with vendor review, payment disputes, service listings, subscriptions, moderation
- Customer review system with `pending`, `approved`, `flagged`, `hidden` moderation states
- Animated active-tab spotlight and cycling Book/View/Track appointment modes
- Smoother shared motion system with reduced-motion support

**Use cases**
- Customer browses beauty categories, discovers vendors by location, views vendor profiles and live services, selects services, books appointments, submits GCash payment, and tracks booking progress
- Vendor manages their service catalog, portfolio images, views bookings, and processes payments through the vendor dashboard
- Admin reviews vendor applications, manages payment disputes, moderates customer reviews, oversees service listings, and manages subscriptions and featured placements

## Stack
- **Framework:** React 19, Tailwind 4, tRPC 11
- **Backend:** Drizzle ORM, MySQL
- **Auth:** Manus OAuth (production), demo login for local testing (username `admin`, password `admin123` — blocked when `NODE_ENV=production`)
- **Maps:** Google Maps integration (discovery, geocoding, vendor onboarding, location-based search)
- **Storage:** S3-backed storage for image uploads
- **Testing:** Vitest (11 tests), production build verification, database category verification
- **UI:** Plum, pink, blush, mint, and gold visual system with custom BeautyBooth wordmark

## Authentication and Authorization
Production authentication is based on Manus OAuth. A development-only demo login is available for local testing (username `admin`, password `admin123`). It is blocked when `NODE_ENV=production`, while admin procedures remain role-gated on the server.

The earlier customer profile `JSON.parse` error was fixed by disabling tRPC request batching, preventing authenticated profile queries from being combined into a gateway request that could return an HTML timeout page instead of JSON.

## Navigation and Views
Dedicated destinations added for customer Help Center, Notifications, Payment Methods, Privacy Policy, and Edit Profile. Vendor Payments and Admin Subscriptions added to persistent dashboard navigation. Generic placeholder navigation entries removed.

Customer navigation includes an animated active-tab spotlight and cycling Book/View/Track appointment modes.

## UI and Responsive Design
The interface uses a plum, pink, blush, mint, and gold visual system with a custom BeautyBooth wordmark and mobile-first spacing. Route entrances, buttons, links, inputs, cards, hover states, focus states, and panels received a smoother shared motion system with reduced-motion support.

Responsive verification was performed at approximately **390x844 mobile** and **1440x900 desktop** across customer, vendor, and admin routes. The vendor and admin panels use desktop side navigation and responsive mobile layouts.

## Status
Feature-complete for the current release-candidate scope. Latest saved checkpoint: **3238c557**. Most recent catalog update passed typecheck, **11 Vitest tests**, production build, database category verification, and customer/vendor screenshots. The project has also passed earlier checkpoints covering the profile parsing fix, navigation audit, vendor workspace, admin demo login, and animation refinement.

### Open Items (pre-launch)
- [ ] Replace development demo login with secure administrator onboarding
- [ ] Configure real GCash merchant details and QR assets
- [ ] Add more approved vendors and live bookings
- [ ] Manually test service creation and explicit booking-service switching with a dedicated authenticated vendor account
- [ ] Add profile-update persistence
- [ ] Add deeper integration tests for payment disputes and booking overlaps
- [ ] Validate production Google Maps credentials and storage settings

### Live Links (development)
- Customer marketplace: `https://3000-ifsr47b3956z1lbl6jrie-7a75c21f.us3.manus.computer/customer/home`
- Vendor panel: `https://3000-ifsr47b3956z1lbl6jrie-7a75c21f.us3.manus.computer/vendor/dashboard`
- Admin panel: `https://3000-ifsr47b3956z1lbl6jrie-7a75c21f.us3.manus.computer/admin`

## Relationship to Varix
An internal product build by [[Varix - Overview|Varix]], a Philippine local beauty-services marketplace. Distinct from Varix's client work and other internal products.

## Base
Philippine market — beauty-services discovery and booking.
