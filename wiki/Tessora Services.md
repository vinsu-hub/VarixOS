---
tags: [tessora, services, product, tiers, RBAC]
---

# Tessora Services

Part of [[Tessora - Overview]]. See also [[Tessora Problem & Solution]].

## Two-Tier Service Model

One knowledge base, two very different experiences depending on who's asking. The same RAG pipeline underneath — prompt scaffolding, output format, and access scope change by role.

### Executive Tier (CEO / CTO / COO)
- **Cross-document synthesis** — "Summarize procurement risk across all supplier contracts this quarter"
- **Pattern surfacing** — trends across departments, not single-document lookup
- **Decision support** — flags contradictions, anomalies, or outdated policies still in circulation
- **Briefing experience** — dashboard/summary view, not a chat window buried in files

### Operational Tier (HR, Admin, Compliance, Ops)
- **Fast retrieval** — "Where's the updated leave policy?" / "Pull all signed contracts with Vendor X"
- **Document lifecycle** — version control, expiry tracking (permits, contracts, IDs), approval workflows
- **Speed and precision** — optimized for day-to-day accuracy over synthesis

## Key Differentiators

| | Global Tools (Glean, Copilot, Notion AI) | Tessora |
|---|---|---|
| Pricing | USD, enterprise-scale | PHP, sized for PH mid-market |
| Compliance | US/EU norms | Localized for RA 10173 / NPC |
| Language | English-first | English + Filipino + Taglish mixing |
| Data residency | Foreign-hosted | PH-hosted / on-prem options |
| User model | Flat, single-mode search | Two-tier: exec synthesis vs. operational retrieval |

## Technology Foundation (Non-Technical)

- Documents parsed, chunked, and embedded for meaning-based search (not just keywords)
- Hybrid search: meaning-based + keyword-based for accuracy
- LLM-generated answers grounded in company documents, with citations
- Entity/topic extraction powers the auto-generated document relationship graph
- Role-based permission filtering on every query

See [[Tessora Roadmap]] for the phased build plan.

## Related Nodes

- [[Tessora - Overview]] — product index
- [[Tessora Problem & Solution]] — what we're solving
- [[Tessora Business Model]] — pricing
- [[Supabase RLS Patterns]] — RBAC implementation patterns
