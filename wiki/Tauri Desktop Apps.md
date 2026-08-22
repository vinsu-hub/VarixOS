---
tags: [tauri, desktop, local-first, rust, sidecar, tessora]
---

# Tauri Desktop Apps

Desktop application patterns for [[Tessora - Overview]].

## Why Desktop-First

Tessora targets enterprise document intelligence — documents often contain sensitive data that shouldn't leave the user's machine. Local-first architecture means:
- No cloud dependency for core functionality
- Data stays on-device by default
- Optional cloud sync for collaboration features

Source: [[Tessora - Overview]]

## Architecture

```
┌─────────────────────────────────────┐
│         Tauri Shell (Rust)          │
│  ┌───────────────┐ ┌─────────────┐  │
│  │  Webview UI   │ │  Python     │  │
│  │  (React/TS)   │ │  Sidecar    │  │
│  └───────┬───────┘ └──────┬──────┘  │
│          │    IPC          │         │
│          └────────┬────────┘         │
│                   │                  │
│  ┌────────────────┼───────────────┐  │
│  │           SQLite + ChromaDB    │  │
│  └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Components
- **Tauri Shell**: Rust-based desktop wrapper, IPC bridge
- **Webview UI**: React/TypeScript frontend
- **Python Sidecar**: RAG pipeline, embedding, retrieval (Ollama + ChromaDB)
- **Local Storage**: SQLite for metadata, ChromaDB for vectors

Source: [[Tessora - Build Plan]]

## IPC Contract

The boundary between Tauri shell and Python sidecar is defined by a strict IPC contract. This is a current blocker — the contract needs to be finalized before Phase 2 can proceed.

Source: [[Tessora - Overview]]

## Agent Harness

Two-agent delegation pattern for development:
- **Claude Code** = Architect (design, specs, review)
- **OpenCode** = Executor (implementation, testing)
- **Ruflo** = Coordinator (task routing, memory)

Source: [[Tessora - Build Plan]]

## Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Tauri shell scaffold | Partial |
| 1 | Core RAG pipeline | In Progress |
| 2 | RBAC + permissions | Blocked |
| 3 | Context mapping | Planned |
| 4 | Pilot deployment | Planned |

## Related Nodes

- [[RAG Architecture Patterns]] — the retrieval engine inside the sidecar
- [[LLM Integration Patterns]] — Groq integration for generation
- [[Supabase RLS Patterns]] — reference for permission model design
