---
tags: [tessora, roadmap, phases, status]
---

# Tessora Roadmap

Part of [[Tessora - Overview]]. See also [[Tessora Services]].

## Phase 1 — Core RAG Pipeline
Document ingestion, chunking, embedding, hybrid search, grounded Q&A with citations.
**Milestone:** Demo-able.

## Phase 2 — Role-Based Access
Authentication with roles, document-level sensitivity tagging, permission-filtered retrieval, separate exec vs. staff UI views.

## Phase 3 — Context Mapping
Entity/topic extraction, auto-generated document relationship graph, graph visualization.
**Note:** Highest-risk, highest-differentiation phase.

## Phase 4 — Pilot Readiness
Seeded realistic sample documents, source citations on every answer, exec "briefing" summary view, first pilot customer onboarding.

---

## Current Status

- **Phase:** Phase 0 — Setup (in progress)
- **Architecture:** Desktop-first, local-first (Tauri + Python sidecar + ChromaDB + SQLite)
- **Created:** 2026-07-22

## Open Decisions Blocking Progress

1. **Target vertical** — BPO / real estate / manufacturing-logistics (blocks sample dataset)
2. **Founder role split** — backend/sidecar vs. frontend/Tauri shell
3. **Phase 2 auth model** — desktop app doesn't naturally support multi-user shared KB
4. **On-prem/data-residency** — deferred until pilot customer conversations

See [[Tessora Build Plan]] for full technical architecture.

## Related Nodes

- [[Tessora - Overview]] — product index
- [[Tessora Build Plan]] — technical implementation
- [[Tessora Business Model]] — target verticals and pricing
- [[Tessora Services]] — what the phases deliver
