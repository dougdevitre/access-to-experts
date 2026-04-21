# Unit Economics

This document models the unit economics of A2X at three levels: **per-completion**, **per-user**, and **platform-level**. All figures are working assumptions based on comparable legal tech and workflow SaaS benchmarks; they will be refined with real data in Phase 1.

**Status:** ASSUMPTIONS — figures are working estimates to be validated with pilot data.

---

## Credit System Design

### Credit Unit

- **1 credit ≈ $0.15 retail value** to end users
- Credits purchased in bundles (subscription includes a monthly allotment; one-time purchases available)
- Enterprise credits priced at bulk rate (~$0.08–$0.12 depending on volume)

### Credit Consumption (v1 reference)

| Action | Credits |
|---|---|
| Preview playbook (first 3 steps) | 0 (free) |
| Start playbook session | 5–15 |
| Execute step (standard) | 2–5 |
| Execute step with AI reasoning | 5–15 |
| Generate artifact (document) | 10–30 |
| Premium expert playbook step | +5–20 per step |
| Peer review unlock | +10 |
| Export pack (PDF bundle) | 10 |

**Typical playbook completion:** 30–50 credits (range: simple checklist 10; complex legal filing 80+)

### Credit Cost Floor

Credits must price at a level that covers platform costs:

| Cost Component | $ per credit |
|---|---|
| AI inference (avg) | $0.025 |
| Storage + bandwidth | $0.005 |
| Stripe fee (amortized) | $0.005 |
| Misc infra | $0.010 |
| **Total platform cost** | **$0.045 / credit** |
| Retail price | $0.150 / credit |
| **Gross margin before expert share** | **70%** |

---

## Per-Completion Economics

### Consumer Completion (Reference Scenario)

Assumes a 40-credit playbook completion purchased via Explorer tier ($0.19/credit effective) or mid-tier direct purchase ($0.15/credit).

| Line item | Amount |
|---|---|
| Credits consumed | 40 |
| User-paid revenue (@ $0.15/credit) | $6.00 |
| **Expert share (70%)** | **$4.20** |
| Platform share (30%) | $1.80 |
| AI inference cost | $0.35 |
| Storage + bandwidth | $0.05 |
| Stripe fee (2.9% + $0.30 amortized) | $0.25 |
| Support + ops allocation | $0.15 |
| **Platform contribution margin** | **$1.00 (~17%)** |

### Anchor Expert Premium Adjustment

For anchor expert playbooks, users pay ~1.5x the credit rate (via premium step pricing), and expert share is often 60% (not 70%) due to negotiated anchor deals:

| Line item | Amount |
|---|---|
| Credits consumed (premium) | 60 |
| User-paid revenue | $9.00 |
| Expert share (60%) | $5.40 |
| Platform share (40%) | $3.60 |
| Costs (AI, storage, Stripe) | $0.90 |
| **Platform contribution margin** | **$2.70 (30%)** |

### Enterprise Completion (Reference Scenario)

Enterprise buyers purchase credits in bulk (often seat-based licenses with per-user monthly credit allotments). Effective realization is lower per credit but volume and LTV are much higher.

| Line item | Amount |
|---|---|
| Credits consumed | 40 |
| Enterprise contract revenue allocation | $4.00 |
| Expert share (70%) | $2.80 |
| Platform share (30%) | $1.20 |
| Costs | $0.75 |
| **Platform contribution margin** | **$0.45 (~11%)** |

Enterprise contribution margin per completion is thinner but offset by:

- Multi-year contracts (guaranteed revenue)
- Low churn (enterprise NRR >110% target)
- Expansion revenue (new seats, new verticals)
- Lower CAC at scale

---

## Subscription Tier Economics

### Explorer — $19/month, 100 credits

| Line item | Amount |
|---|---|
| Monthly revenue | $19.00 |
| Credits allotted | 100 |
| Max credit cost (if fully consumed) | $15.00 |
| Expert share on consumed credits (70%) | $10.50 |
| Platform gross revenue after expert share | $8.50 |
| Stripe (2.9% + $0.30) | $0.85 |
| **Effective platform margin (full consumption)** | **~$7.65** |
| **If 60% consumption** | **~$10.50** |

Unused credits drive healthy margin for A2X; overuse (rare — users typically consume 60–70% of allotment) is bounded by credit cap.

### Builder — $49/month, 400 credits

| Line item | Amount |
|---|---|
| Monthly revenue | $49.00 |
| Credits allotted | 400 |
| Effective $/credit | $0.1225 |
| Expert share @ 70% full consumption | $42.00 |
| Platform share | $18.00 |
| Costs + Stripe | ~$3.50 |
| **Platform margin (full consumption)** | **~$14.50** |
| **If 60% consumption** | **~$22.00** |

### Operator — $149/month, 1,200 credits

| Line item | Amount |
|---|---|
| Monthly revenue | $149.00 |
| Credits allotted | 1,200 |
| Effective $/credit | $0.124 |
| Expert share @ 70% full consumption | $126.00 |
| Platform share | $54.00 |
| Costs + Stripe | ~$8.00 |
| **Platform margin (full consumption)** | **~$46.00** |

### Subscription LTV Assumptions

- Average subscriber tenure: 14 months (blended across tiers)
- Explorer LTV: ~$110
- Builder LTV: ~$300
- Operator LTV: ~$650
- Blended LTV (by mix): ~$240

### Target CAC

- Target CAC payback: <18 months
- Blended target CAC: ~$80
- Target LTV/CAC: 3:1 minimum (blended 3.0:1 at $80 CAC and $240 LTV)

---

## Platform-Level Model

### Year 1 (Phase 1 Beta)

- Users: 1,000 active (mostly free or founder-invited)
- Paid subscribers: 200
- Avg revenue per paid user: $40/month
- **Consumer ARR: ~$96K**
- Institutional pilot revenue: $25K
- **Total Year 1 revenue: ~$120K**
- Burn: $500K–$1M (founder-led, lean)

### Year 2 (Phase 2 Public Launch)

- Users: 10,000 active
- Paid subscribers: 2,500
- Avg revenue per paid user: $45/month
- **Consumer ARR: ~$1.35M**
- Enterprise contracts (3–5): $250K ARR
- White-label / institutional: $100K
- **Total Year 2 ARR: ~$1.7M**
- Burn: $2M–$4M (small team, Series A closes mid-year)

### Year 3 (Phase 3 International + Series A)

- Users: 50,000 active
- Paid subscribers: 15,000
- Avg revenue per paid user: $50/month
- **Consumer ARR: ~$9M**
- Enterprise: $4M ARR
- Institutional/white-label: $1.5M
- API/ecosystem: $500K
- Data products (nascent): $300K
- **Total Year 3 ARR: ~$15M**
- Burn: $6M–$10M (growing team, international launch)

### Year 5 (Phase 4 Scale)

- Users: 250,000 active
- Paid subscribers: 80,000
- **Consumer ARR: ~$55M**
- Enterprise: $25M ARR
- Institutional/white-label: $8M
- API/ecosystem: $3M
- Data products: $5M
- **Total Year 5 ARR: ~$95–100M**
- Operating margin: break-even to slightly profitable

---

## Expert Earnings Model

### Solo Expert (Certified Practitioner)

- Publishes 10 playbooks in specialized area
- 50 completions/month avg per playbook
- 500 completions/month total
- Avg earnings per completion: $4.20
- **Monthly earnings: ~$2,100**
- Annual: ~$25K

This tier supplements income or supports part-time practice. Not a replacement for main practice income typically.

### High-Volume Certified Expert

- Publishes 25 playbooks
- 200 completions/month avg
- 5,000 completions/month total
- Monthly earnings: ~$21K
- Annual: ~$250K

This tier represents a meaningful revenue channel.

### Anchor Expert

- 10 premium playbooks with co-branded positioning
- 500 completions/month avg
- 5,000 completions/month total
- Premium pricing: ~$5.40/completion expert share
- Monthly earnings: ~$27K
- Annual: ~$325K

Plus:
- Platform equity (advisor shares)
- Speaking fees on A2X platform
- Content licensing bonuses
- Revenue guarantees during ramp

---

## Sensitivity Analysis

### Downside scenarios

**Scenario 1: Lower completion rate**
- Users complete 50% of started sessions (not 80%)
- Revenue per session drops 37%
- Platform contribution margin drops to ~$0.60 per completion
- Mitigation: UX improvements, better matching, onboarding

**Scenario 2: Higher AI costs**
- Claude pricing rises 2x
- AI cost per completion rises to $0.70
- Contribution margin drops to ~$0.65
- Mitigation: Caching, prompt optimization, multi-model strategy

**Scenario 3: Expert supply slower than forecast**
- Only 50% of targeted playbook count by Phase 2
- Revenue 40% lower than plan
- Mitigation: Anchor tenancy with founder content, institutional partnerships for supply

**Scenario 4: Higher expert share pressure**
- Anchor experts demand 80/20 splits (not 70/30 or 60/40)
- Platform margin drops to ~$0.60 per completion
- Mitigation: Tier differentiation, non-cash compensation (equity, marketing support)

### Upside scenarios

**Scenario 1: Enterprise outperformance**
- Hit 2x enterprise ARR target
- Enterprise reaches 55% of revenue mix
- Much better cash flow due to multi-year contracts
- Accelerates Series A terms

**Scenario 2: Data product success**
- Outcome benchmarking reaches $10M ARR by Year 5
- 80%+ margin on data products
- Transforms overall unit economics

**Scenario 3: White-label channel**
- 20+ professional bodies license white-label
- Distribution without CAC
- Adds $5–15M ARR with minimal marginal cost

---

## Key Economic Levers

### Levers to improve margin

1. **Reduce AI cost per step** — prompt engineering, caching, smaller models for simple steps
2. **Increase playbook completion rate** — better UX, better matching, onboarding
3. **Drive subscribers toward higher tiers** — value ladder, consumption nudges
4. **Scale enterprise** — higher LTV, lower CAC once motion is proven
5. **Launch data products** — 80%+ margin, compounds platform moat

### Levers to improve growth

1. **Expand vertical coverage** — each new vertical adds addressable market
2. **Add international markets** — 3–5x total addressable market
3. **Partner distribution** — institutional and white-label reduce CAC
4. **Expert economics clarity** — better expert earnings attract better supply
5. **Outcome reputation** — users who succeed refer others

---

## Financial Modeling Assumptions Log

All assumptions in this doc should be revisited:

| Assumption | Current value | When to revisit |
|---|---|---|
| Credit retail price | $0.15 | After first 1,000 paid completions |
| Avg credits per completion | 40 | Monthly analysis |
| Expert share | 70/30 standard | Quarterly; anchor tier individually negotiated |
| AI cost per completion | $0.35 | Monthly; provider pricing changes |
| Subscriber tenure | 14 months | Quarterly after first cohort exits |
| Blended CAC | $80 | Monthly as paid acquisition scales |
| Enterprise average contract | $25K Phase 2, $100K Phase 3 | Per-deal |
| Playbook completion rate | 80% target | Weekly |
| Expert content velocity | 10/week | Monthly |

All assumptions will be tracked in internal financial model with live validation against observed data.
