---
tags: [tessora, company, overview, document-intelligence, RAG]
---

# Tessora — Overview

Varix's flagship internal product — enterprise document intelligence platform for Philippine companies. A [[Varix - Overview]] subcompany.

## One-liner
Enterprise Document Intelligence — a centralized, AI-searchable document system that gives executives cross-document decision support and gives operational teams fast, accurate, permission-safe document retrieval.

## Tagline
*"Every document. One picture."*

## Capabilities

| Capability | Description |
|-----------|-------------|
| Document Ingestion | Parse, chunk (600 words, 90-word overlap), auto-embed on upload |
| Hybrid Search | Dense vector similarity (384-dim) + BM25 keyword (0.7/0.3 weighting) |
| Grounded Q&A | RAG via Groq Llama 3.1 70B, answers with source citations |
| Role-Based Access | 4 roles: EXEC, ADMIN, HR, STAFF — enforced per-query |
| Dual-View Interface | Executive Dashboard (metrics, briefings) vs Staff Portal (chat) |
| Deployment Flexibility | Cloud, self-hosted, or air-gapped — local-first architecture |

## Technology

| Component | Choice |
|-----------|--------|
| App Shell | Tauri (Rust + native webview) |
| Frontend | React + Tailwind |
| Backend | Python (local sidecar) |
| Vector Store | ChromaDB (embedded, local) |
| Relational Store | SQLite (bundled, local) |
| Embeddings | all-MiniLM-L6-v2 (local, CPU-friendly) |
| Keyword Search | rank_bm25 (local) |
| LLM | Groq API (Llama 3.1) — only network call |
| Doc Parsing | PyMuPDF (PDF), python-docx (Word) |

## Use Cases

- Leadership locating past decisions buried across scattered docs
- Legal counsel surfacing every contract containing a specific clause
- HR answering policy questions instantly instead of routing through tickets
- Compliance auditing who accessed which sensitive documents

## Relationship to Varix

Tessora leverages [[Varix Services|Varix's AI integration and RAG systems expertise]] as the technical foundation for a verticalized enterprise product.

**Base:** Philippines — built for mid-to-large PH enterprises (BPOs, conglomerates, logistics, manufacturing, real estate).

**Status:** Phase 0 (Setup) — in progress. Desktop-first, local-first architecture.

## Related Nodes

- [[Tessora Mission & Vision]] — why Tessora exists
- [[Tessora Brand Identity]] — mosaic motif, visual identity
- [[Tessora Voice & Positioning]] — verbal identity
- [[Tessora Problem & Solution]] — the problem being solved
- [[Tessora Services]] — two-tier service model
- [[Tessora Business Model]] — pricing and target verticals
- [[Tessora Roadmap]] — phased build plan
- [[Tessora Build Plan]] — technical architecture and delegation
- [[Tessora Agent Harness]] — Claude Code/OpenCode/Ruflo loop
