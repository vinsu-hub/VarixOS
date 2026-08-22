---
tags: [rag, architecture, embedding, retrieval, chromadb, ollama, ai]
---

# RAG Architecture Patterns

Cross-project knowledge base for retrieval-augmented generation systems built under [[Varix - Overview]].

## Core Pipeline

```
Documents → Ingestion → Chunking → Embedding → Vector Store → Retrieval → Re-ranking → Generation → Validation
```

## Projects Using RAG

| Project | Type | Vector Store | LLM | Status |
|---------|------|-------------|-----|--------|
| [[MPI RAG System - Overview\|MPI RAG]] | Geospatial poverty data | ChromaDB | Ollama (local) | Thesis eval |
| [[Tessora - Overview\|Tessora]] | Enterprise doc intelligence | ChromaDB | Groq | Phase 1 |
| [[Oishii Nori - Overview\|Oishii Nori]] | Menu/knowledge Q&A | — | Groq | Paused |
| [[Kabiyahe - Overview\|Kabiyahe]] | Tourism Q&A | Supabase pgvector | Groq | Planning |

## Hybrid Retrieval

Dense vector search + sparse BM25 keyword search, fused with minimum-score floor tuning.

- **Dense**: ChromaDB + `sentence-transformers` (BAAI bge-m3, 1024-dim multilingual embeddings)
- **Sparse**: BM25 keyword matching for exact-match queries
- **Fusion**: Score-weighted combination with configurable floor thresholds

Source: [[MPI RAG System - Overview]]

## Cross-Encoder Re-ranking

Post-retrieval relevance layer using `ms-marco-MiniLM-L-6-v2`. Applied after hybrid retrieval to refine top-k results before generation.

Source: [[MPI RAG System - Overview]]

## Citation Validation

Post-generation step: check LLM claims against retrieved sources before surfacing to user. Includes source-diversity enforcement across retrieved chunks to prevent single-source hallucination.

Source: [[MPI RAG System - Overview]]

## Local LLM Serving

Ollama-based local inference (llama3.2:1b, CPU-only) with production hardening:
- Circuit breaker (failure threshold + recovery window)
- Request queueing with overflow rejection
- Health/service monitoring endpoints
- Hardware-aware auto-tuning (CPU/RAM/GPU detection → thread count)

Source: [[MPI RAG System - Overview]]

## Multi-Format Ingestion

- PDF: text extraction + OCR fallback (`pdfplumber`, `PyMuPDF`, `pytesseract`)
- Excel/CSV: `pandas`, `openpyxl`
- Semantic chunking with metadata extraction
- Geospatial: NAMRIA/PSA shapefiles, `geopy`/`shapely`, GeoJSON boundaries

## Evaluation Methodology

- Precision, MRR, NDCG via `scikit-learn`
- Embedding-space visualization (UMAP + K-means clustering) for qualitative retrieval debugging
- Evaluation harness built from scratch for benchmarking

## Related Nodes

- [[LLM Integration Patterns]] — model selection, proxy patterns, structured generation
- [[Supabase RLS Patterns]] — vector DB access control
- [[Philippine Business Rules]] — domain-specific data grounding
