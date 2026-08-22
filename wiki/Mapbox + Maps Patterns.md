---
tags: [mapbox, maps, gl-js, globe, markers, cafe, cafevelive]
---

# Mapbox + Maps Patterns

Map implementation patterns for [[CafeLive - Overview]] and geospatial features.

## CafeLive — Globe-First Map

Full Mapbox GL JS implementation for live cafe discovery:

### Globe Projection
- Custom fog/atmosphere settings
- Idle auto-spin that pauses on user interaction
- Smooth zoom transitions

### DOM Marker Layers
- Markers reconciled against live data (not just placed once)
- Custom marker elements with interactive popups
- Tier-based styling (T1/T2/T3 pins)

### Style Re-Theming on Live Codebase
Migrated from "cosmic globe" dark theme to "warm editorial" light theme:
- Full token/motion/typography rewrite
- Re-derived from Design Read taste framework
- Applied on `style.load` event without touching underlying map/data logic
- Product logic remained untouched throughout

Source: [[CafeLive - Overview]]

## MPI RAG — Leaflet.js

Interactive map for geospatial poverty data:
- Leaflet.js for rendering
- GeoJSON boundary overlays (barangay boundaries)
- LLM-generated answers cite actual geographic locations
- Map highlights referenced locations

Source: [[MPI RAG System - Overview]]

## Kabiyahe (Planned)

AI tourism planner with map-first UI:
- Tourist spot discovery for Laguna
- Route planning
- Integration with local business data
- Mapbox GL JS planned (reusing CafeLive patterns)

Source: [[Kabiyahe - Overview]]

## Common Patterns

| Pattern | CafeLive | MPI RAG | Kabiyahe |
|---------|----------|---------|----------|
| Library | Mapbox GL JS | Leaflet.js | Mapbox GL JS |
| Markers | DOM elements | GeoJSON layers | Planned |
| Interactivity | Click/hover popups | Click for details | Planned |
| Data binding | Live Supabase queries | Static + RAG | Planned |
| Style | Custom theme | Default | Planned |

## Related Nodes

- [[Geospatial Data Patterns]] — data sources and boundary handling
- [[Real-Time Systems]] — live data binding for markers
- [[Next.js + Supabase Stack]] — data layer for map queries
