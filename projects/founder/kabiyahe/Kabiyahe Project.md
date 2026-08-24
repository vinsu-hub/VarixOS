---
tags: [varix, kabiyahe, product, project, status, tourism, ai]
---

# Kabiyahe

Part of [[Varix - Overview]] — an internal product build, an AI-powered tourism itinerary planner and booking platform starting with Laguna.

## Quick Links
- [[Kabiyahe - Core Features]] — feature breakdown by phase, destination directory, AI itinerary engine, bundles, booking
- [[Kabiyahe - Tech Stack]] — Next.js, Supabase, RAG + Groq, PayMongo/Xendit, n8n
- [[Kabiyahe - Strategy & Rollout]] — 5-step rollout plan, Laguna-first MVP, anchor partner strategy
- [[Kabiyahe - Map View Deep-Dive]] — hub pins + live heatmap layer, privacy design, discovery value

## What it is
A one-stop AI-powered itinerary planner and booking platform for Philippine tourism, starting with Laguna. Combines AI-personalized trip planning with unified payment for tickets, tour guides, and food reservations — solving the fragmentation problem where travelers currently juggle separate apps/calls/FB messages for each part of a trip.

*Core insight from competitor research:* no existing player (local or global) combines AI itinerary planning + unified booking/payment for tickets + guides + food in one checkout, especially at a regional/local level. That gap is the opportunity — not "another AI planner."

## One-liner
AI-powered Philippine tourism — plan itineraries, book everything, pay once.

## Tagline
*"Plan it. Book it. Go."*

Alt options:
- "Your trip, one tap."
- "Laguna awaits — planned by AI, booked by you."

## Business Model

### Revenue Streams
- **Booking commission** — % cut on tickets, tour guide bookings, and food reservations made through the platform (primary revenue driver)
- **Partner subscription/dashboard fee** — venues pay for analytics, capacity management, and premium placement (later phase, mirrors Bantay/SMFC dashboard model)
- **Featured bundle placement** — tourism boards or venues pay to promote a curated itinerary bundle
- **Affiliate layer** (optional, later) — commission from adjacent bookings (transport, accommodations) via partner APIs (Klook/Grab-style integration) rather than building those rails yourself

### Go-to-Market Wedge
Laguna Tourism Council relationship (Cynthia Mamon) as anchor partner — gives credibility and a path to multiple venues at once instead of cold-pitching one by one.

### Key Cost Centers
- AI/LLM API costs (mitigate via bundle caching)
- Payment gateway fees (PayMongo/Xendit, standard ~2-3.5%)
- Partner onboarding effort (relationship-driven, not automatable early on)

## Competitor Analysis

| Competitor | Strength | Gap to exploit |
|---|---|---|
| **GalaGPT.ph** | Philippines-specific AI planner; real-time weather/event updates; sustainability/local-community angle | No unified booking/payment — planning only |
| **Mindtrip** | Well-funded, OpenAI partnership, 11M+ POI database, conversational AI, group voting | No flight/hotel booking; not Philippines-specific; no regional depth |
| **Travel Philippines (official DOT app)** | Government-backed, destination/guide directory, "near me" feature | Not AI-driven; no unified payment; clunky UX (per reviews) |
| **Klook / Viator** | Instant tickets, strong cancellation policies, established trust | Not itinerary-planning focused; generic global platform, no local depth |
| **Sakay.ph** | Established PH brand in trip/route planning since 2013 | Focused on public transport routing, not tourism/leisure itineraries |

### Kabiyahe's Positioning
The only player combining AI-personalized planning + unified payment for tickets/guides/food + deep regional (Laguna) curation, backed by a real tourism council relationship rather than generic global content.

## Core Components

| Component | Function |
|---|---|
| Destination directory | Curated database of spots — hours, pricing, location, category |
| AI itinerary engine | RAG-based, grounded in curated destination data — generates day-by-day plans |
| Bundle itinerary library | Pre-made, proven itinerary templates users can clone/customize |
| Booking & payment layer | Unified checkout for tickets, guides, food — single transaction |
| Guide marketplace | Local tour guides list availability/pricing (manual → self-serve over phases) |
| Partner dashboard | Venue-facing analytics: bookings, revenue, capacity (Phase 2+) |

## Status
Planning / pre-development phase. The Laguna Tourism Council relationship (Cynthia Mamon) is the anchor partnership. No code committed yet — the project is in validation and planning.

### Open Items
- [ ] Finalize app name — run an actual IPOPHL Philippine Trademark Database search before committing (informal web search found no conflicts for "Kabiyahe," but this is not a legal clearance)
- [ ] Confirm anchor partner (Enchanted Kingdom / Laguna Tourism Council) interest before finalizing Phase 1 scope
- [ ] Decide manual vs. API booking flow for launch partners based on what's actually available
- [ ] Validate before building — one-pager/mockup of Laguna spots + bundles to test appetite with Cynthia Mamon / Laguna Tourism Council before committing dev months
- [ ] Secure 1-2 anchor partners (Enchanted Kingdom ideal) rather than trying to onboard dozens at launch

## Relationship to Varix
An internal product build by [[Varix - Overview|Varix]], an AI-powered tourism platform for the Philippine market. Leverages Varix's existing RAG systems expertise (see [[MPI RAG System - Overview]]) and dashboard patterns (see [[Saint Michael POS - Overview|Saint Michael POS]]).

## Base
Laguna, Philippines — starting regional, expanding to other provinces after Phase 1-2 metrics justify it.
