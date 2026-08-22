---
tags: [content-moderation, submissions, admin, review-states, user-generated-content]
---

# Content Moderation Patterns

Workflows for managing user-generated content across [[Varix - Overview]] projects.

## Projects with Moderation

| Project | Content Type | Moderation Model |
|---------|-------------|-----------------|
| [[Veavii - Overview\|Veavii]] | Literary submissions | Admin review (pending → approved/rejected → published) |
| [[Istoria Coffee - Overview\|Istoria]] | Freedom Wall notes | Community posts with admin oversight |
| [[CafeLive - Overview\|CafeLive]] | Social pings, messages | Consent-gated, RLS-enforced |

## State Machine Pattern

```
User Submits → Pending → Admin Reviews → Approved / Rejected
                                  ↓
                            Published (visible to public)
```

### Key Rules
- Submitters cannot approve their own content
- Admin decisions are final (no user appeal flow in current implementations)
- Rejected content is soft-deleted (preserved for audit, hidden from UI)

Source: [[Veavii - Overview]]

## Admin Authorization

Server-side authorization checks against an allowlist table on every privileged call. Pattern: `requireAdmin()` middleware that verifies the current user's ID against the admin allowlist before any moderation action.

Source: [[Istoria Coffee - Overview]]

## Freedom Wall Pattern (Istoria)

Multi-tier fallback data design:
1. **Supabase** — primary data store
2. **Upstash Redis** — cache layer for read-heavy public display
3. **Local JSON** — fallback for offline/degraded states

User-submitted notes go through admin review before appearing on the public wall.

Source: [[Istoria Coffee - Overview]]

## Consent-Gated Messaging (CafeLive)

Request → accept/decline state machine enforced at the RLS layer:
- Neither party can self-grant acceptance
- Not just hidden in the UI — enforced at the database level
- Anonymous guests and registered users in the same channel

Source: [[CafeLive - Overview]]

## Related Nodes

- [[Security Review Patterns]] — authorization patterns
- [[Supabase RLS Patterns]] — RLS enforcement for moderation
- [[Next.js + Supabase Stack]] — the foundation
