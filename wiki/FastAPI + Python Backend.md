---
tags: [python, fastapi, backend, api, async, uvicorn]
---

# FastAPI + Python Backend

Python backend patterns used across [[Varix - Overview]] projects.

## Projects Using FastAPI

| Project | Use Case | Status |
|---------|----------|--------|
| [[SMFC - Overview\|SMFC POS]] | Multi-brand restaurant POS backend | Production |
| [[MPI RAG System - Overview\|MPI RAG]] | Geospatial RAG engine | Thesis eval |
| [[Tessora - Overview\|Tessora]] | Document intelligence sidecar | Phase 1 |

## Multi-Router Architecture (SMFC)

A single FastAPI backend serving multiple operational domains through separate routers:
- Branches, transactions, HR/payroll, inventory movements, loss records, stock requests, kitchen workflow
- Role-based access control: employee / manager / executive
- Multi-schema Postgres: `public` + dedicated `hr` schema for domain separation

Source: [[SMFC - Overview]]

## LLM Proxy Pattern

Server-side LLM proxy with API key kept server-only:
- Location-aware prompt construction
- Graceful degradation when no key configured
- Client-side request throttling (serial queue, ~12.5/min)
- Exponential backoff on 429

Used in: CafeLive (Gemini), SMFC Malaya AI (Groq), MPI RAG (Ollama)

Source: [[CafeLive - Overview]], [[LLM Integration Patterns]]

## Structured Data Business Analyst

LLM-powered structured-data pattern (distinct from retrieval-based RAG):
- Backend pre-computes live business data into JSON snapshot
- LLM constrained to answer only from that block
- Forced JSON response schema (short answer + optional chart spec)
- "Data field guide" in system prompt disambiguating similarly-named fields

Source: [[SMFC - Overview]] — Malaya AI

## PDF Generation

`reportlab` for legal/business documents (payslips) with conditional breakdown sections — only rendered when non-zero.

Source: [[SMFC - Overview]]

## Document Ingestion

Multi-format pipelines for RAG systems:
- PDF: text extraction + OCR fallback (`pdfplumber`, `PyMuPDF`, `pytesseract`)
- Excel/CSV: `pandas`, `openpyxl`
- Semantic chunking with metadata extraction

Source: [[MPI RAG System - Overview]]

## Regulatory Business Rules

PH labor law (DOLE holiday-pay multipliers) and retail discount law (Senior/PWD VAT exemption) implemented server-side, made byte-identical-when-disabled via `engine_enabled` flag.

Source: [[SMFC - Overview]], [[Philippine Business Rules]]

## Related Nodes

- [[RAG Architecture Patterns]] — embedding, retrieval, generation
- [[LLM Integration Patterns]] — model selection, proxy, structured output
- [[Philippine Business Rules]] — regulatory computation patterns
