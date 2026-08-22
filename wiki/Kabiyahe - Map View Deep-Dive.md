---
tags: [kabiyahe, maps, maplibre, vector-tiles, postgis, layers, mobile]
---

# Kabiyahe — Map View Deep-Dive

Part of [[Kabiyahe - Overview]].

## The Core Behavior

Tap anywhere on the map → SBH text appears → tap the SBH → bottom-sheet opens with content cards (shared snaps + comments) — stacked map + content, not a page redirect.

## The SBH Reveal Rule

1. User taps map location
2. SBH text appears at tap location (confirming a real location was targeted)
3. User taps SBH text
4. **Then** bottom-sheet opens
5. User dismisses sheet → SBH hidden until next tap

## MapLibre + pg_tileserv

A self-hosted, open-source geospatial stack:

- `pg_tileserv` generates vector tiles directly from PostGIS-enabled Supabase tables
- PostGIS spatial index eliminates full-table scans for viewport queries
- `host.docker.internal:3000` for dev
- Search + map restack = unified PostGIS query

## Layer Strategy

- First visual layer visible at city zoom (`z12–z14`)
- Verified local layer visible at regional zoom
- Bigger zoom → more markers, different marker treatments, fine-tuned
- Place detail sheet: custom map or Mapbox image, quick-view actions

## Mobile vs Desktop

**Mobile:** full-screen map overlay or embedded map, map as secondary trigger behind "I want to go."

**Desktop:** map can be primary view (sidebar triggers map response). Top nav for page switching.

## Related Nodes

- [[Kabiyahe - Overview]]
- [[Kabiyahe - Core Features]]
- [[Kabiyahe - Tech Stack]]
- [[Mapbox + Maps Patterns]]
- [[Geospatial Data Patterns]]
