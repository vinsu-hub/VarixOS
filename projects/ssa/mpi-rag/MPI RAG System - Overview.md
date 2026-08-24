---
tags: [mpi-rag-system, research, project, status]
---

# MPI RAG System

Part of [[Varix - Overview]] â€” the deployed system behind the portfolio entry in [[Varix Featured Work]]. Local project lives at `D:\mpi_rag_system`.

## What it is
**MPI** = Medical, Policy, Intelligence â€” a **geospatial poverty-intervention recommendation engine** for Los BaÃ±os, Laguna, Philippines. It combines a Retrieval-Augmented Generation pipeline with an interactive Leaflet.js map to help decision-makers identify which barangays need intervention, which MPI dimensions apply, how budgets should be allocated, and to generate structured, citation-backed recommendations.

Built on local government CBMS (Community-Based Monitoring System) data spanning 37,000+ households and 109,000+ individuals across 14 barangays.

## Stack
FastAPI (Python 3.12) + Uvicorn Â· ChromaDB (persistent vector store) Â· sentence-transformers (BAAI/bge-m3, 1024-dim multilingual embeddings) Â· Ollama (`llama3.2:1b`, local CPU-only inference) Â· cross-encoder re-ranking (ms-marco-MiniLM-L-6-v2) Â· rank-bm25 for sparse/keyword retrieval Â· Leaflet.js + OpenStreetMap for the map frontend, vanilla JS/Canvas 2D for UMAP scatter visualization Â· pdfplumber/PyMuPDF/pytesseract for PDF ingestion + OCR fallback.

## Capabilities & Use Cases
**Capabilities**
- Natural-language Q&A with citations â€” hybrid retrieval (BGE-M3 dense + BM25 sparse + cross-encoder rerank), LLM answer with inline bracketed citations, auto-injected onto uncited claims (99.6%â†’100% citation pass rate)
- Barangay-specific recommendations â€” selecting a barangay deterministically pulls its full CBMS-2025 fact block (Health, Education, Living Standards/WASH, Economic, Disaster Risk, Recommended Budget) into the prompt, guaranteeing ground-truth data reaches the LLM regardless of what semantic search retrieves
- Budget allocation planning â€” a supplied budget produces a phased breakdown, deterministically verified (regex/arithmetic, no LLM) to sum to the requested total with a â‰¥10% contingency line
- Guided prompt suggestions grouped by dimension, contextualized to the barangay clicked on the map
- Interactive Leaflet map of the 14 Los BaÃ±os barangays (clickable polygons pre-fill the prompt panel; not yet shaded by MPI severity)
- UMAP 2D projection of document-chunk embeddings with query-neighbor highlighting, plus K-means cluster analysis â€” lets a user see which document clusters an answer drew from
- Reasoning-trace/transparency panel â€” exposes the model's extracted reasoning and full deduplicated source list per answer, for auditability
- Ops resilience surfaced to the user: circuit breaker + queue ("system warming up" messaging instead of raw errors), response caching with a "cached" badge, health/calibration status endpoints

**MPI dimensions & sources** (naming differs slightly between eval docs and frontend, same 3 groupings):
- **Health/WASH** ("medical") â€” water, sanitation, hygiene, child mortality, malnutrition â€” PSA/PIDS Facts & Figures, FIES, CALABARZON reports
- **Education/Poverty** ("policy") â€” poverty thresholds, employment, 4Ps, education access â€” FIES Technical Notes, APIS, DSWD Guidelines
- **Living Standards/Targeting** ("intelligence") â€” geospatial targeting, barangay ranking, housing quality, CBMS methodology â€” GeoMS docs, Small Area Estimates tables, socio-economic reports

Corpus is official government survey/statistical data and policy documentation (CBMS 2025 barangay CSVs, PSA/PIDS PDFs, FIES releases, SAE poverty tables) plus a thesis-specific evaluative report â€” not primary interviews.

**Use cases**
- LGU planning officer deciding where to target anti-poverty interventions (e.g. "rank the 14 barangays of Los BaÃ±os by MPI poverty score")
- Budget/program designer allocating a fixed peso amount to a specific barangay's interventions, with the allocation validated before being trusted
- DSWD/4Ps or social-protection staff checking eligibility/program-coordination questions
- Researcher/analyst doing exploratory poverty-statistics lookups
- Thesis defense/demo audience â€” the reasoning-trace tab, citation panel, and UMAP/cluster views exist primarily to demonstrate RAG faithfulness and retrieval quality for academic evaluation

## Relationship to Varix
Featured as Varix's specialized RAG research deployment â€” demonstrates the AI Integration & RAG Systems expertise (see [[Services#AI Integration & RAG Systems]]) that also underpins [[Tessora - Overview|Tessora]]'s document intelligence product.
