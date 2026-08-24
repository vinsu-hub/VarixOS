---
tags: [llm, ai, groq, gemini, ollama, structured-generation, model-selection]
---

# LLM Integration Patterns

Model selection, proxy patterns, and structured generation across [[Varix - Overview]] projects.

## Model Inventory

| Model | Provider | Project | Use Case |
|-------|----------|---------|----------|
| `llama-3.3-70b-versatile` | Groq | SMFC (Malaya AI) | Business data Q&A |
| `llama3.2:1b` | Ollama (local) | MPI RAG | Local inference, no API dependency |
| Gemini | Google | CafeLive (Pulse) | Server-side proxy |
| `ms-marco-MiniLM-L-6-v2` | Cross-encoder | MPI RAG | Re-ranking |

## Structured Data Business Analyst (SMFC)

Distinct from retrieval-based RAG — no embeddings or vector store:

1. Backend pre-computes live business data (sales, payroll, inventory, losses) into JSON snapshot
2. LLM constrained to answer only from that block
3. Forced JSON response schema: `{ short_answer: string, chart?: ChartSpec }`
4. "Data field guide" in system prompt disambiguates similarly-named fields (today-only vs. 30-day-trend vs. all-time-accumulated)

### Conditional Chart Generation
LLM decides whether a chart is warranted (comparison/trend/breakdown questions) vs. plain text, emitting a typed chart spec (`bar`/`line`, series/labels) the frontend renders directly.

Source: [[Saint Michael POS - Overview|SMFC]]

## Server-Side LLM Proxy (CafeLive)

- API key kept server-only
- Location-aware prompt construction
- Graceful degradation when no key configured
- Client-side request throttling: serial queue, ~12.5 requests/min
- Exponential backoff on 429

Source: [[CafeLive - Overview]]

## Local LLM Serving (MPI RAG)

Ollama-based, CPU-only, no external API dependency:
- Circuit breaker: failure threshold + recovery window
- Request queueing with overflow rejection
- Health/service monitoring endpoints
- Hardware-aware auto-tuning: CPU/RAM/GPU detection → thread count config

Source: [[MPI RAG System - Overview]]

## Model Selection Criteria

| Criteria | Groq | Ollama | Gemini |
|----------|------|--------|--------|
| Latency | Very fast | Slow (CPU) | Fast |
| Cost | Per-token | Free | Free tier |
| Privacy | Cloud | Local | Cloud |
| Quality | High (70B) | Lower (1B) | High |
| Dependency | API key | Hardware | API key |

### When to Use What
- **Groq**: Production Q&A where speed matters and API key is available
- **Ollama**: Offline/thesis scenarios, no external dependency
- **Gemini**: Server-side proxy for chat features with rate limiting

## Related Nodes

- [[RAG Architecture Patterns]] — retrieval pipeline for context-grounded generation
- [[FastAPI + Python Backend]] — backend implementation
- [[Tauri Desktop Apps]] — local-first LLM serving
