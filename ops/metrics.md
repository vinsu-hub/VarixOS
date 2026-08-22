# Metrics

Pipeline value, open tasks, and portfolio snapshot.
Last scanned: 2026-08-21

## Portfolio Snapshot
- **Shipped:** 3 (SMFC, Veavii, Istoria Coffee)
- **Building:** 8 (CafeLive, Mangara, PokeCard PH, BeautyBooth, Tessora, Oishii Nori, MPI RAG, SSA)
- **Planning:** 1 (Kabiyahe)

## Open Tasks

### High Priority (blockers)
- [ ] **Oishii Nori** — Build resumed. 2 manual steps outstanding: GitHub auth (`gh auth login`), expose `hr` schema in Supabase Dashboard
- [ ] **PokeCard PH** — Not deployed. 43 local commits, needs Vercel deploy + migration 0019 applied + Google OAuth setup + gh auth
- [ ] **Tessora** — Target vertical undecided (BPO/real estate/manufacturing), founder role split not finalized
- [ ] **MPI RAG** — Human expert evaluation not run (thesis defense blocker). 12 golden answers needed
- [ ] **Kabiyahe** — Need Laguna Tourism Council validation before committing dev months

### Medium Priority (next steps)
- [ ] **CafeLive** — Build admin moderation UI (reports/shop-claims sit unreviewed in DB)
- [ ] **Mangara** — Build Reviewing tab (Phase 1). Gemini API key needed for Prompt Studio
- [ ] **BeautyBooth** — Replace demo auth, configure real GCash, validate prod Google Maps creds
- [ ] **Oishii Nori** — Frontend build 2/6 milestones done (shell + POS Terminal); next: Kitchen Display (Milestone 3)

### Low Priority (minor fixes)
- [ ] **Veavii** — Custom domain, password rotation (minor)
- [ ] **Istoria Coffee** — Custom domain (`www.istoria.site`), staging env, Reveal component not wired into all pages

## Pipeline Value
*(Active proposals + deals in motion — fill manually)*

## Per-Domain Status

| # | Domain | Status | Phase | Deployed | Codebase | Key Next Step |
|---|--------|--------|-------|----------|----------|---------------|
| 1 | **Varix** (parent) | In Progress | — | — | — | Reconcile varix.work vs varixph.com, SEO plan |
| 2 | **SSA** | In Progress | — | — | — | *(needs scan)* |
| 3 | **SMFC Command Suite** | **Complete** | All phases | Yes (prod) | `D:\SMFC_POS` | Ongoing maintenance |
| 4 | **Tessora** | In Progress | Phase 0/4 | No | `D:\tessora` | Decide target vertical |
| 5 | **CafeLive** | In Progress | Core built | Yes (Vercel) | `D:\CAFETEMP` | Build admin moderation UI |
| 6 | **Veavii** | **Complete** | All phases | Yes (Vercel) | `D:\Vi vea` | Custom domain (minor) |
| 7 | **Mangara** | In Progress | M0-3 done | Yes (Vercel) | `D:\mangara` | Build Reviewing tab |
| 8 | **PokeCard PH** | In Progress | Phases 0-7 | **No** | `D:\POKECARDPH` | Deploy + apply migration |
| 9 | **BeautyBooth** | In Progress | RC complete | No (dev) | Manus platform | Replace demo auth |
| 10 | **Kabiyahe** | Planning | None | No | None | Validate with tourism council |
| 11 | **Oishii Nori** | In Progress | Phases 0-2 + FE 2/6 | No | `D:\ioshinori` | Kitchen Display (Milestone 3) |
| 12 | **MPI RAG** | In Progress | Built | No (local) | `D:\mpi_rag_system` | Human expert evaluation |

## Open Items (Varix Business)
- [ ] Domain canonicalization: `varix.work` vs `varixph.com`
- [ ] SEO implementation plan
