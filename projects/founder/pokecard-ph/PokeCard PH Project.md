---
tags: [varix, pokecard-ph, marketplace, pokemon, nextjs, supabase, xendit, project, status]
---

# PokeCard PH

Part of [[Varix - Overview]] — an internal product build, separate codebase from the Varix site
itself. Local project lives at `D:\POKECARDPH`. Specification source of truth is
`D:\POKECARDPH\CONTEXT\` (8 documents, 1,853 lines).

## What it is

A two-sided marketplace for Pokemon cards and collectibles in the Philippines, connecting verified
vendors (shops, resellers, high-volume individual collectors) with buyers. One Supabase backend
serves **two faces**:

- **Buyer face** — browse, buy, trade, bid, track orders. Top-nav layout, full-width content.
- **Vendor face** — list cards, manage orders, scan/grade, view analytics, handle billing.
  Sidebar + main + right-rail dashboard layout.

Three transaction modes run across both faces: fixed-price sales, card-for-card trades with
in-person meetup coordination, and auctions. See [[PokeCard PH - Business Model]].

The differentiator is the **trust mechanism**: condition is *vendor-declared* — honest grading by
the seller, deliberately **not** an AI score — optionally backed by a photometric 3D scan the buyer
can rotate and inspect before buying. The scan supports the vendor's stated grade; it never
overrides it. That distinction is a product decision, not a technical limitation, and separates
PokeCard PH from flat photo listings on Shopee/Carousell.

## Scope

The build target is a **responsive website**, deployed and working end-to-end — desktop and phone
*browsers*. Confirmed 2026-08-11.

A **native mobile app (React Native) is deferred to a separate future project.** The website's
responsive behaviour is not a prototype of it; app patterns should not leak into the web build.

This distinction matters because the master prompt's phrase "mobile is out of scope" has been read
both ways. It means *no native app*. Responsive mobile web is very much in scope, and given the PH
market will skew mobile, it is arguably the primary surface. Rules are in
[[PokeCard PH - Design System]] under *Responsive & mobile web* — mobile is built from those rules
rather than from comps, because only one mockup includes a mobile view (see
[[PokeCard PH - Reference Gaps]]).

## Sibling notes

- [[PokeCard PH - Business Model]] — revenue streams, vendor onboarding, the 60-day free trial
- [[PokeCard PH - Design System]] — color/type/spacing tokens, layout shells, motion **and audio**
- [[PokeCard PH - Build Phases]] — full Supabase schema, RLS intent, and the phase ladder
- [[PokeCard PH - Auth]] — Phase 1b, Google Sign-In and the soft-gate pattern
- [[PokeCard PH - Trade Engine]] — Phase 3, the card-for-card trading flow
- [[PokeCard PH - Auctions]] — Phase 4, real-time bidding
- [[PokeCard PH - Monetization]] — Phase 5, GMV-tiered vendor billing
- [[PokeCard PH - Events]] — Phase 6, the "Who's That Pokemon?" weekly giveaway
- [[PokeCard PH - Scan and 3D]] — Phase 7 **and the divergence between what was built and its
  later-arriving spec**
- [[PokeCard PH - Messaging and Notifications]] — Phase 8
- [[PokeCard PH - Search and Polish]] — Phase 9
- [[PokeCard PH - Seed Data Plan]] — one coherent seed replacing per-phase fragments
- [[PokeCard PH - Reference Gaps]] — which screens have mockups, which must be derived, and the
  image-vs-spec conflicts
- [[PokeCard PH - Fidelity Review]] — QA results and the per-screen 1:1 verdict
- [[Session Handoff - PokeCard PH (2026-08-11)]] — build log, one section per phase gate

The single document to execute from is `D:\POKECARDPH\SESSION_PLAN.md` — it sequences every phase
below into one ordered runbook with gates between them.

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript, React 19
- **Styling:** Tailwind v4 (tokens in `globals.css` `@theme`)
- **Backend:** Supabase — Postgres, Auth, Storage, Realtime, Row Level Security on every table
- **Payments:** Xendit — checkout in Phase 1, invoicing/disbursement added in Phase 5
- **3D:** Three.js / `@react-three/fiber`, Phase 7 only
- **Motion:** Tailwind `transition` utilities for simple cases, Framer Motion for orchestrated
  sequencing (stepper fills, wizard transitions, stat count-up)
- **Data:** Server Components by default; TanStack Query for interactive client panels (cart,
  live dashboard widgets)
- **Hosting:** Vercel, auto-deploy on push to `main`, preview deploys per feature branch

## Repo structure

```
/app
  /(buyer)    home, card/[id], shops/[shopId], cart, checkout, orders, trade, messages
  /(vendor)   dashboard, listings (+add, +[id]/scan), orders, trade-requests,
              analytics, payouts, settings
  /(auth)     login, signup
  /api        webhooks/xendit
/components   /buyer /vendor /shared
/lib          /supabase /billing
```

## Shared systems

- **Auth** — Supabase Auth, one login flow, role in `profiles.role`. Vendor accounts additionally
  get a `shops` row at onboarding.
- **Nav switching** — "Sell" in the buyer nav routes to vendor onboarding if the user has no shop,
  or straight to the vendor dashboard if they do.
- **Notifications** — bell + count badge, backed by a `notifications` table: order status changes,
  new trade requests, outbid alerts, new messages.
- **Messages** — one shared component across both faces; only the conversation list differs.

## Reference images

**The master prompt is wrong about this path.** It refers to `/design-reference/buyer`,
`/design-reference/vendor`, and `/design-reference/shared`. The images actually sit flat in
`D:\POKECARDPH\REFERENCE IMAGES\` — 11 PNGs covering shop page, search results, item view with 3D,
trade home/view, buyer active trades, and the vendor dashboard/store/listing/scan screens.

Where multiple images show variants of one screen, these are canonical:
- **Add Listing** = the 4-step wizard (Card Information → Condition & Price → Photos & Description
  → Preview), with the live Listing Preview panel pinned right
- **Vendor Dashboard** = the version with Quick Actions grid, Recent Orders table, Sales Overview
  chart with 7D/30D/3M/1Y toggle, Recent Trade Requests, Top Selling Listings, and Shop Health score

Reference images show **layout intent only**. On any conflict, [[PokeCard PH - Design System]] wins.

## Deployment

Vercel, connected to the repo. Six environment variables:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`XENDIT_SECRET_KEY`, `XENDIT_WEBHOOK_TOKEN`, and `NEXT_PUBLIC_SITE_URL` (added by
[[PokeCard PH - Auth]] so OAuth redirects hit the right deployment).

Supabase migrations live in `/supabase/migrations`, applied with `supabase db push` before any
deploy that changes schema.

## Status

**Phases 0-4 built and running locally** (15 commits, ~22 routes, 7 migrations). Not deployed.

Working end to end: browse → card detail → cart → 4-step checkout → order created → tracked →
visible to the vendor → status advanced. Plus trades, auctions with proxy bidding and anti-snipe,
the vendor dashboard, the Add Listing wizard, and search.

QA and the per-screen 1:1 verdict are in [[PokeCard PH - Fidelity Review]] — 18/18 RLS assertions,
0 dead links, and two open findings (status-pill contrast, masthead touch target).

**Not built:** Phase 5 monetization, Phase 6 events, Phase 7 scan/3D, messaging, and Google OAuth.
Payment is a placeholder — Xendit isn't provisioned, and the checkout UI says so.

## Working notes

- `audio files/` holds 8 sound assets, renamed by intent on 2026-08-11 and now mapped to specific
  interaction moments in [[PokeCard PH - Design System]] under Audio system. Each has a role token
  and a target phase. Three caveats carried there: most need **trimming** (2-5s assets against a
  400ms motion cap), two need **re-encoding** (one is 1702kbps), and the set includes recognisable
  first-party Pokemon audio that should be replaced with commissioned sound-alikes before a
  commercial launch.
- The business model exists twice: `POKECARD_PH_BUSINESS_MODEL.md` and
  `PokeCard_PH_Business_Model.docx`. The Phase 5 spec cites the `.docx` as its source. Treat the
  markdown as canonical and the `.docx` as the exported artifact.
- Phase discipline is explicit in every spec doc: do not build a later phase's tables or UI while
  working an earlier one, even when a screenshot's sidebar shows the feature. Stub the nav link,
  leave the page unbuilt, move on.
