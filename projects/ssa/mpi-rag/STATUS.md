# MPI RAG System

## Last Session Summary
Thesis evaluation / benchmarking phase. Fresh 30-query RAG-vs-NoRAG benchmark run completed. New reconciliation infrastructure built (metric definitions, script-based number generation). Citation-validator bug found and fixed (sentence splitter not splitting on newlines). Human-expert evaluation workbook rebuilt against PDPA-safe query set. One genuine hallucination confirmed (Q26 — fabricated housing project) diagnosed as retrieval-breadth problem (only 2 distinct sources behind 8 chunks for a hard 3-sub-topic query). Citation pass rate dropped to 69% (from 100%) — groundedness regression from wider context (3→8 reranked chunks). Full architecture documented: FastAPI + Leaflet.js + Ollama + ChromaDB + BGE-M3 embeddings.

## Current Phase
Thesis evaluation / benchmarking. 6 session handoffs tracked.

## Key Blockers
- [ ] Human expert evaluation session not run (thesis defense blocker)
- [ ] 12 golden answers needed for revised query sample
- [ ] Q26 hallucination diagnosed but not fixed at pipeline level
- [ ] Citation-validator fix changed headline numbers — data needs re-reconciliation
- [ ] GPU acceleration not working (CPU-only Ollama, CUDA installer failed on disk space)

## Last Updated
2026-08-18
