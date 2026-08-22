---
tags: [philippine, business-rules, DOLE, statutory, labor-law, retail]
---

# Philippine Business Rules

Statutory and regulatory computations implemented in [[Varix - Overview]] projects.

## Projects with Regulatory Requirements

| Project | Rules Applied |
|---------|--------------|
| [[SMFC - Overview\|SMFC POS]] | DOLE holiday pay, Senior/PWD discounts, Employee discount |
| [[BeautyBooth - Overview\|BeautyBooth]] | GCash payment compliance |
| [[Kabiyahe - Overview\|Kabiyahe]] | Tourism regulations (planned) |

## DOLE Holiday Pay Multipliers

Philippine labor law (Department of Labor and Employment) requires specific pay multipliers for holidays:

| Day Type | Multiplier |
|----------|-----------|
| Regular Holiday | 200% of daily rate |
| Special Non-Working Day | 130% of daily rate |
| Regular Holiday + Rest Day | 260% of daily rate |
| Special Non-Working Day + Rest Day | 150% of daily rate |

### Implementation
Server-side engine gated behind `engine_enabled` flag. When disabled, flat-rate legacy path is provably unaffected. When enabled, byte-identical computation to DOLE reference.

Source: [[SMFC - Overview]]

## Senior Citizen / PWD Discounts

Mandatory VAT-exempt discounts for senior citizens and persons with disabilities:

| Discount | Rate |
|----------|------|
| Senior Citizen | 20% discount + VAT exemption |
| PWD | 20% discount + VAT exemption |
| Employee Discount | Configurable % (varies by company) |

### Implementation
Computed server-side as the source of truth — never trusted from the client. Applied after subtotal calculation, before final total.

Source: [[SMFC - Overview]]

## GCash Payment Compliance

BeautyBooth integrates GCash for beauty-service bookings:
- QR code generation for payment
- Transaction reference tracking
- Receipt generation

Source: [[BeautyBooth - Overview]]

## Related Nodes

- [[FastAPI + Python Backend]] — server-side computation patterns
- [[Multi-Tenant Platform Design]] — applying rules across 5 companies
- [[SMFC - Overview]] — full implementation details
