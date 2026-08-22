---
tags: [kabiyahe, stack, nextjs, supabase, mapbox, postgres, maplibre]
---

# Kabiyahe — Tech Stack

Part of [[Kabiyahe - Overview]].

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js App Router + React 19 | Server Components, quick iteration |
| Styling | Tailwind CSS v4 | Fast, default stack |
| Data/state | Supabase | Single backend for search, maps, auth, media |
| Auth | Supabase Auth | Google Sign-In, email link, no passwords |
| DB | Postgres via Supabase | Native PostGIS, learned from SMFC |
| Maps SDK | Mapbox GL JS | Routing and directions are core feature |
| Search/maps UX | MapLibre GL JS + `pg_tileserv` | Open-source self-hosted map rendering |
| Geocoding | Mapbox Geocoding API | Forward/reverse addresses and POIs |
| Hosting | Vercel | Default hosting |

## Database Foundation

Every table carries a `geom` column — PostGIS is the platform.

## Data Model Summary

- **`places`** — primary POI. `id, user_id, name, address, category, tags, geom, images, website, hours, links, verified`
- **`reviews`** — threaded comments with nested replies, `geom` on every row
- **`photos`** — per-review media. `geom` on every row. Place link **not required**
- **`itineraries`** — pre-made or DIY trips. `likes, bookmarks, is_public, shared, verification_status`
- **`itinerary_stops`** — ordered stops. `geom, duration_minutes, transport_mode`
- **`regions`** — PH regional boundaries with `geom`
- **`sbh_counts`** — materialized per place and per photo, updated by trigger

**RLS:** enabled on every table. No public reads. RLS is the API contract.

## Key Performance Notes

- MapLibre renders tiles locally — fast even on poor connections
- `pg_tileserv` only serves precomputed tiles, no per-request DB queries
- PostGIS spatial index eliminates full-table scans for viewports
- Postgres EXPLAIN shows the query planner choosing index scans on bbox intersection

## Related Nodes

- [[Kabiyahe - Overview]]
- [[Kabiyahe - Core Features]]
- [[Supabase RLS Patterns]]
- [[Mapbox + Maps Patterns]]
- [[Next.js + Supabase Stack]]
- [[Geospatial Data Patterns]]
