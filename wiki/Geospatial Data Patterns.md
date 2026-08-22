---
tags: [geospatial, GIS, CBMS, shapefiles, leaflet, mapping, MPI]
---

# Geospatial Data Patterns

Geospatial data handling for [[MPI RAG System - Overview]] and related mapping features.

## MPI RAG System

Geospatial poverty-intervention RAG engine for Los Baños, Laguna.

### Data Sources
- **CBMS (Community-Based Monitoring System)**: 37,000+ households, 109,000+ individuals, 14 barangays
- **NAMRIA/PSA shapefiles**: official Philippine administrative boundaries
- **Local government data**: barangay-level demographics and interventions

### Technology
- `geopy` / `shapely` for geometric operations
- GeoJSON boundary rendering
- Leaflet.js for interactive map UI
- ChromaDB for vector storage with geospatial metadata

Source: [[MPI RAG System - Overview]]

## Mapbox GL JS (CafeLive)

Advanced map implementation for cafe discovery:

### Features
- Globe projection with custom fog/atmosphere
- Idle auto-spin that pauses on interaction
- DOM marker layers reconciled against live data
- Full style re-theming on `style.load` without touching map/data logic

### Style Re-Theming
Cosmic dark → warm-light palette migration performed on a live, shipping codebase. Changed token/motion/typography while leaving map logic untouched.

Source: [[CafeLive - Overview]]

## Kabiyahe (Planned)

AI tourism planner with map-first UI for Laguna:
- Tourist spot discovery
- Route planning
- Integration with local business data

Source: [[Kabiyahe - Overview]]

## Geospatial Grounding in RAG

Combining retrieval pipeline with real administrative boundary data:
- LLM answers cite actual geographic locations
- Map UI highlights the locations referenced in generated responses
- Boundary-aware retrieval (query within specific barangay/region)

Source: [[MPI RAG System - Overview]]

## Related Nodes

- [[RAG Architecture Patterns]] — retrieval engine for geospatial queries
- [[Real-Time Systems]] — live map updates
- [[Philippine Business Rules]] — local data context
