---
tags: [realtime, websockets, webrtc, supabase-realtime, presence, multiplayer]
---

# Real-Time Systems

Patterns for live, multi-client synchronization across [[Varix - Overview]] projects.

## Projects with Real-Time Features

| Project | Technology | Use Case |
|---------|-----------|----------|
| [[SMFC - Overview\|SMFC POS]] | Supabase Realtime | POS → Order Queue → Kitchen Display sync |
| [[CafeLive - Overview\|CafeLive]] | Supabase Realtime + WebRTC | Presence, messaging, peer-to-peer chat/video |

## Supabase Realtime

### Multi-Screen Sync (SMFC)
Real-time UI sync across POS Terminal / Order Queue / Kitchen Display — no manual refresh. Broadcast channels for order events, presence for staff status.

Source: [[SMFC - Overview]]

### Presence (CafeLive)
Ephemeral, broadcast-only, never persisted. Used for live user-location beacons. Distinguishes anonymous-guest vs. registered identity in the same channel.

Source: [[CafeLive - Overview]]

### Channel Collision Bug
Two independent subscriptions resolving to the same underlying channel topic → throws on second `.subscribe()` call. Traced from real browser console error, not guessed at.

Source: [[CafeLive - Overview]]

## WebRTC Peer-to-Peer

Signaling handshake over server-coordinated HTTP polling (no WebSockets, serverless-compatible). ICE candidate queuing/flush ordering. Custom data-channel message-type protocol extended to power in-app mini-games.

Source: [[CafeLive - Overview]] — "Pulse"

### Distributed-Presence Bugs
- Stale/ghost state from partial heartbeat scoping
- `busy` flag that drifts permanently stuck with no reconciliation
- Dropped session that vanishes instead of self-healing on reconnect
- **Fix**: self-reporting client state + server-side reconciliation

Source: [[CafeLive - Overview]]

## Consent-Gated Messaging

Request → accept/decline state machine enforced at the RLS layer. Neither party can self-grant acceptance — not just hidden in the UI.

Source: [[CafeLive - Overview]]

## Security Considerations

Ranked findings for real-time systems:
1. Identity spoofing
2. Mailbox IDOR/eavesdropping
3. Resource-griefing via spoofed state changes
4. Missing rate limiting
5. Raw-location/PII-in-transit

**Mitigation**: ephemeral session-secret auth (issue/verify/rotate, Node `crypto`, constant-time compare) without breaking "no accounts" product constraint.

Source: [[CafeLive - Overview]]

## Related Nodes

- [[Next.js + Supabase Stack]] — the foundation for Realtime
- [[Supabase RLS Patterns]] — security layer
- [[LLM Integration Patterns]] — async patterns for AI features
