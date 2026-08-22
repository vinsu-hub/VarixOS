---
tags: [tessora, build-plan, architecture, tauri, python, sidecar]
---

# Tessora Build Plan

Two-agent delegation workflow via [[Tessora Agent Harness|Ruflo orchestration]] to build [[Tessora - Overview|Tessora]] from scratch.

## Golden Rule

Tessora runs as an installed desktop app (Tauri), Obsidian-style. Everything is local-first except two API calls:
- **Groq API** for LLM generation (no local Ollama)
- **Interfaze API** for OCR, when scanned documents are involved (Phase 2+)

No hosted backend, no Vercel/Railway/Supabase hosting for the core app.

## Tech Stack

| Component | Choice | Notes |
|-----------|--------|-------|
| App shell | **Tauri** (Rust + native webview) | Desktop binary, not a website |
| Frontend | **React + Tailwind** | Runs inside Tauri webview |
| Backend logic | **Python** | Local Tauri sidecar process |
| Local vector store | **ChromaDB** | Embedded, local |
| Local relational store | **SQLite** | Bundled, local |
| Embeddings | **all-MiniLM-L6-v2** | Local, CPU-friendly |
| Keyword search | **rank_bm25** | Local |
| LLM | **Groq API** (Llama 3.1) | Only network call in Phase 1 |
| OCR (Phase 2+) | **Interfaze API** | OpenAI-SDK compatible |
| Doc parsing | **PyMuPDF** (PDF), **python-docx** (Word) | Local |
| Graph viz (Phase 3) | **react-force-graph** | |

## Project Structure

```
tessora/
├── src-tauri/              # Rust shell, Tauri config
├── backend/                # Python sidecar
│   ├── ingestion/          # file import, parsing, chunking
│   ├── retrieval/          # embeddings, hybrid search
│   ├── rag/                # Groq query orchestration, citations
│   └── auth/               # Phase 2+ only
├── frontend/
│   ├── components/
│   │   ├── VaultView/      # local document browser
│   │   ├── ChatQuery/      # chat interface
│   │   └── shell/          # dark theme layout
│   └── styles/
├── sample-data/            # synthetic docs
└── docs/
```

## Build Phases

### Phase 0 — Setup
Demo milestone: Tauri app launches, Python sidecar responds to React
- Initialize Tauri project, confirm Rust toolchain
- Set up Python sidecar process, confirm Tauri ↔ Python communication
- Scaffold backend/frontend structure
- Design local SQLite schema (no roles/auth yet)
- Local health check: Python sidecar responds to React

### Phase 1 — Core RAG Pipeline
Demo milestone: Cited Q&A over uploaded docs, running as desktop app
- Local vault structure + document import
- Text extraction (PyMuPDF, python-docx)
- Chunking (500–800 tokens, ~15% overlap)
- Local embeddings + ChromaDB storage
- Hybrid retrieval: vector similarity + BM25
- RAG query via Groq API with source citations
- 15–20 synthetic sample documents
- Package as installable desktop binary

### Phase 2 — Role-Based Access + OCR
Demo milestone: Role-conditioned output + scanned document support
- Auth/roles (exec, admin, HR, staff)
- Sensitivity + department metadata tagging
- Permission-filtered retrieval
- Exec view vs staff view
- OCR integration via Interfaze API
- Document lifecycle basics

### Phase 3 — Context Mapping
Demo milestone: Document relationship graph + activity heatmap
- LLM-based entity/topic extraction
- Auto-link documents by shared entities
- Graph visualization (react-force-graph)
- GitHub-style activity heatmap

### Phase 4 — Pilot Readiness
Demo milestone: Customer-ready demo
- Polish citations across all views
- Exec briefing auto-summary
- Seed realistic full dataset
- Prepare first pilot customer demo

## Working Principles

- Every phase must end in something demo-able
- Permission filtering happens at retrieval time, not after generation
- Keep synthetic sample data realistic to the chosen vertical
- Local-first: no network calls except Groq (Phase 1) and Interfaze (Phase 2+)

## Related Nodes

- [[Tessora - Overview]] — product index
- [[Tessora Agent Harness]] — delegation protocol
- [[Tessora Roadmap]] — phase overview
- [[Tauri Desktop Apps]] — Tauri patterns
- [[RAG Architecture Patterns]] — the retrieval engine
