---
tags: [tessora, company, overview]
---

# Tessora

Index note for everything related to Tessora — a [[Varix - Overview|Varix]] subcompany. See linked notes for detail.

## Quick Links
- [[Tessora Mission & Vision]]
- [[Tessora Brand Identity]]
- [[Tessora Voice & Positioning]]
- [[Tessora Problem & Solution]]
- [[Tessora Services]]
- [[Tessora Roadmap]]
- [[Tessora Business Model]]

## One-liner
Enterprise Document Intelligence — a centralized, AI-searchable document system that gives executives cross-document decision support and gives operational teams fast, accurate, permission-safe document retrieval.

## Tagline
*"Every document. One picture."*

Alt options:
- "From fragments to foresight."
- "The whole picture, from every document."

## Capabilities & Use Cases
**Capabilities**
- Ingest and index PDF/DOCX documents: parse, chunk (600 words, 90-word overlap), auto-embed on upload
- Hybrid search — dense vector similarity (sentence-transformers, 384-dim) fused with sparse BM25 keyword search (0.7/0.3 weighting)
- Natural-language Q&A (RAG) over uploaded documents via Groq Llama 3.1 70B, answers grounded with source citations
- Role-based access control enforced per-query at document/collection level, four roles: **EXEC** (full read, writes briefings only), **ADMIN** (full read/write, user mgmt, config), **HR** (scoped to HR/policy/public docs), **STAFF** (public + own-department read-only)
- Dual-view interface: Executive Dashboard (metrics, query analytics, briefing feed) vs. Staff Portal (conversational chat) over the same index
- Vault/workspace UI: document library, "Context Map" knowledge-graph view, Reports, Insights, Flags, Activity
- Deployment flexibility (per marketing site): cloud-managed, self-hosted, or air-gapped on-prem — architecture is local-first (Tauri desktop + local Python sidecar + local ChromaDB/SQLite, with Groq as the only network call)
- **Roadmap, not yet built:** OCR for scanned docs, HTML/CSV/Excel ingestion, multi-turn conversational memory, hallucination detection, audit logging, meeting-transcript ingestion → structured reports

**Use cases** (from marketing-site copy)
- Leadership locating past architectural/business decisions buried across scattered docs without asking colleagues
- Legal counsel surfacing every contract containing a specific clause (e.g. auto-renewal) for risk review
- HR business partner answering policy questions instantly instead of routing through a ticket queue
- Compliance officer auditing who accessed which sensitive documents and when

**Note:** the "Philippine companies" framing and the SOC 2/HIPAA/GDPR/ISO 27001 compliance claims are marketing-site positioning — not yet reflected in repo code. The live Tauri frontend is still mostly scaffolded (chat input is currently disabled); most of the above is implemented in an older FastAPI/Next.js prototype or specified for the in-progress rebuild, not all live simultaneously. Verify current state against `D:\tessora` before quoting capabilities as shipped.

## Relationship to Varix
Tessora is a product/subsidiary of [[Varix - Overview|Varix]]. It leverages Varix's AI integration and RAG systems expertise (see [[Services#AI Integration & RAG Systems]]) as the technical foundation for a verticalized enterprise product.

## Base
Philippines — built for mid-to-large Philippine enterprises (BPOs, conglomerates, logistics, manufacturing, real estate).
