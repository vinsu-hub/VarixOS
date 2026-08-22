---
tags: [pokecard-ph, marketplace, pokemon, nextjs, supabase, xendit]
---

# PokeCard PH — Overview

A two-sided marketplace for Pokémon cards and collectibles in the Philippines. A [[Varix - Overview]] internal product build. Local project at `D:\POKECARDPH`.

## What It Is

Connects verified vendors (shops, resellers, high-volume collectors) with buyers. One Supabase backend serves **two faces**:

- **Buyer face** — browse, buy, trade, bid, track orders. Top-nav layout.
- **Vendor face** — list cards, manage orders, scan/grade, view analytics. Sidebar + main + right-rail dashboard.

Three transaction modes: fixed-price sales, card-for-card trades with meetup coordination, and auctions.

## The Differentiator

**Trust mechanism:** condition is *vendor-declared* — honest grading by the seller, deliberately **not** an AI score — optionally backed by a photometric 3D scan the buyer can rotate and inspect before buying. The scan supports the vendor's stated grade; it never overrides it.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), TypeScript, React 19 |
| Styling | Tailwind v4 (tokens in `globals.css` `@theme`) |
| Backend | Supabase — Postgres, Auth, Storage, Realtime, RLS on every table |
| Payments | Xendit — checkout (Phase 1), invoicing/disbursement (Phase 5) |
| 3D | Three.js / `@react-three/fiber` (Phase 7 only) |
| Motion | Tailwind `transition` + Framer Motion for orchestrated sequencing |
| Data | Server Components by default; TanStack Query for interactive panels |
| Hosting | Vercel, auto-deploy on push to `main` |

## Scope

**Responsive website** — desktop and phone *browsers*. Native mobile app (React Native) is deferred to a separate future project.

## Status

**Phases 0–4 built and running locally** (15 commits, ~22 routes, 7 migrations). Not deployed.

Working end to end: browse → card detail → cart → checkout → order → vendor visibility → status advance. Plus trades, auctions with proxy bidding and anti-snipe, vendor dashboard, Add Listing wizard, and search.

**Not built:** Phase 5 monetization, Phase 6 events, Phase 7 scan/3D, messaging, Google OAuth.

## Sibling Notes

- [[PokeCard PH - Business Model]] — revenue streams, vendor onboarding
- [[PokeCard PH - Design System]] — tokens, motion, audio, responsive rules
- [[PokeCard PH - Build Phases]] — schema, RLS, phase ladder
- [[PokeCard PH - Auth]] — Google Sign-In, soft-gate pattern
- [[PokeCard PH - Trade Engine]] — card-for-card trading flow
- [[PokeCard PH - Auctions]] — real-time bidding
- [[PokeCard PH - Monetization]] — GMV-tiered vendor billing
- [[PokeCard PH - Events]] — "Who's That Pokémon?" giveaway

## Related Nodes

- [[Varix - Overview]] — parent company
- [[Next.js + Supabase Stack]] — the foundation
- [[Supabase RLS Patterns]] — security layer
- [[Real-Time Systems]] — Supabase Realtime for auctions
