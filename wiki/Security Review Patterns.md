---
tags: [security, review, authentication, authorization, rls, OWASP]
---

# Security Review Patterns

Security practices and lessons learned across [[Varix - Overview]] projects.

## Ranked Findings Framework

When reviewing a system, rank findings by exploitability:
1. **Critical** — identity spoofing, data exfiltration
2. **High** — IDOR, eavesdropping, privilege escalation
3. **Medium** — resource griefing, missing rate limiting
4. **Low** — PII in transit, information disclosure

Source: [[CafeLive - Overview]]

## Authentication Patterns

### JWT Sessions (Veavii)
- `jose` library, cookie-based
- Enforced through Next.js middleware
- Server-side authorization on every privileged call

### PIN-Based Kiosk Auth (SMFC)
- bcrypt hash verification server-side
- Tied to acting logged-in account (not shared kiosk PIN)
- Used for sensitive operations (owner's request flow)

### Ephemeral Session Secrets (CafeLive)
- Issue/verify/rotate pattern
- Node `crypto` with constant-time compare
- No accounts required — works with anonymous users

Source: [[SMFC - Overview]], [[CafeLive - Overview]]

## Row-Level Security

### Pattern: Asymmetric Policies
Two separate UPDATE policies OR'd together — sender and recipient have different, non-overlapping permissions on the same row.

### Debugging: Silent No-Op Writes
Missing RLS UPDATE policy on `anon`-role RPC → write silently fails. Fixed via `SECURITY DEFINER` or adding the missing policy.

Source: [[Supabase RLS Patterns]]

## Real-Time Security

Key concerns for WebSocket/Realtime systems:
- Identity spoofing on channels
- Mailbox IDOR/eavesdropping
- Resource-griefing via spoofed state changes
- Missing rate limiting on real-time events

Source: [[Real-Time Systems]]

## Incident: Oishii Nori Auth Exposure

Two subagent security incidents during Phase 2 development:
- HR schema exposed to client-side
- Required manual Supabase Dashboard intervention
- Led to build pause

Source: [[Oishii Nori - Overview]]

## Related Nodes

- [[Supabase RLS Patterns]] — deep-dive on RLS
- [[Real-Time Systems]] — real-time security concerns
- [[Multi-Tenant Platform Design]] — tenant isolation
