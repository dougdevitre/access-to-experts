# Roadmap

This roadmap outlines the phased build plan for Access To Experts (A2X). Dates are aspirational and will shift based on funding, partnerships, and market signal.

**Current phase:** Phase 0 — Specification & scaffolding

---

## Phase 0: Foundation (Months 0–3)

**Goal:** Establish the specification, schemas, and flagship playbook authoring capability. Prove the model with CoTrackPro as the anchor publisher.

### Deliverables

- [x] Repository scaffold with vision, product spec, enterprise strategy
- [x] Data schemas: Playbook, Session, Expert, Credit Ledger, Review
- [x] Governance documents: Code of Conduct, Contributing, Security, Governance
- [ ] Playbook schema validator (CLI)
- [ ] Playbook authoring guide (Markdown-based)
- [ ] 10–15 flagship family-law and co-parenting playbooks authored via CoTrackPro
- [ ] Jurisdiction taxonomy (US states + top 5 international jurisdictions)
- [ ] Expert verification framework spec
- [ ] Terms of Service (v1 draft)
- [ ] Expert Content Agreement (v1 draft)
- [ ] Unit economics model with sensitivity analysis

### Milestones

- Repository transferred to GitHub organization
- First 3 advisory board members identified
- Working relationship with 1 institutional partner (letter of intent)

---

## Phase 1: MVP Platform (Months 3–9)

**Goal:** Launch invite-only beta. Prove the three-pane interface works end-to-end. Establish content QA pipeline.

### Deliverables

- [ ] React/Vite frontend (three-pane interface)
- [ ] Node/Express API
- [ ] Playbook execution engine (MVP)
- [ ] Credit ledger and Stripe billing integration
- [ ] Claude integration for AI-guided step execution
- [ ] Artifact generation (DOCX, PDF, structured JSON)
- [ ] Expert authoring interface (visual + Markdown)
- [ ] Session persistence (DynamoDB)
- [ ] Expert identity verification (Persona or Jumio)
- [ ] Automated credential verification for legal (bar lookup) and clinical (NPI/FSMB)
- [ ] Content QA pipeline (lint + peer review workflow)
- [ ] Basic ranking algorithm (completion rate, rating, recency)
- [ ] 50+ playbooks live across flagship verticals
- [ ] 15–25 founding experts onboarded
- [ ] First institutional pilot launched (AFCC, state bar, or EAP provider)

### Infrastructure

- AWS account structure (dev, staging, prod)
- CI/CD via GitHub Actions
- Observability (CloudWatch, Sentry)
- Secrets management (AWS SSM Parameter Store)
- Data residency posture (US-first, EU-ready)

### Compliance

- Privacy Policy (GDPR + CCPA ready)
- Cookie consent and preference center
- WCAG 2.2 AA baseline
- SOC 2 Type I readiness assessment begun

### Milestones

- 1,000 beta users with active sessions
- 3 institutional pilots signed
- Advisory Board fully seated (5–7 members)
- Ethics Board formed (initial 3 members)

---

## Phase 2: Public Launch & First Enterprise Contract (Months 9–18)

**Goal:** Open public launch. Second vertical live. First paid enterprise contract. SOC 2 Type I achieved.

### Deliverables

- [ ] Public launch with consumer tiers (Explorer, Builder, Operator)
- [ ] Second vertical live (trial advocacy via Metasystems, or speaking business via Lois247)
- [ ] Enterprise tier launched (Corporate License SKU)
- [ ] White-label pilot with one professional body
- [ ] API v1 public (for partner integrations)
- [ ] Mobile-responsive web (native apps deferred)
- [ ] CLE/CE credit partnership with at least one state bar
- [ ] Improved ranking algorithm with outcome signals
- [ ] Session forking and sharing features
- [ ] Basic outcome benchmarking (anonymized, opt-in)
- [ ] SOC 2 Type I certification
- [ ] HIPAA readiness (for future clinical vertical)

### Business

- First paid enterprise contract ($25K+ ARR)
- Grant Ad Grant or institutional grant secured
- Content library: 200+ playbooks, 75+ experts
- Expert Council elections held

### Milestones

- 10,000 active users
- $500K ARR run-rate across consumer + enterprise
- Series A conversation initiated

---

## Phase 3: International & Series A (Months 18–30)

**Goal:** International expansion (UK or Canada first). SOC 2 Type II. Raise Series A to accelerate.

### Deliverables

- [ ] Second country launch (UK preferred; EU-grade GDPR posture)
- [ ] Jurisdiction-localized playbook versions
- [ ] Multi-language support (English + Spanish at minimum)
- [ ] Regional data residency (EU-resident data in EU)
- [ ] Third and fourth verticals (civic, education, or clinical)
- [ ] SOC 2 Type II certification
- [ ] ISO 27001 certification work begun
- [ ] Partner program for consultancies and law firms
- [ ] First government contract (state or federal)
- [ ] Research partnership with 1 academic institution
- [ ] Annual "State of Expertise" report published
- [ ] Data product MVP (outcome benchmarking for sale)

### Business

- Series A raised ($8–15M)
- 50+ anchor experts, 500+ certified practitioners
- 10+ institutional partnerships
- $3–5M ARR

### Milestones

- 50,000 active users
- 20% international revenue
- Expert platform becomes primary income source for 50+ experts

---

## Phase 4: Multi-Vertical Scale (Months 30–48)

**Goal:** Scale to 5+ verticals, establish data moat, build ecosystem.

### Deliverables

- [ ] 5+ verticals fully operational
- [ ] Third country launch (Canada or Australia)
- [ ] API/SDK ecosystem with 20+ third-party integrations
- [ ] Developer marketplace
- [ ] Data products line: outcome benchmarking, regulatory intelligence, practice patterns
- [ ] Training data licensing to AI labs (consented, anonymized)
- [ ] Annual A2X conference (invite-only v1)
- [ ] FedRAMP Moderate authorization work
- [ ] Series B raised ($30–60M)

### Business

- $20M+ ARR
- Profitability at operating level
- 100+ enterprise contracts
- 200+ institutional partnerships
- 1,000+ anchor/certified experts

---

## Phase 5: Global Platform (Months 48+)

**Goal:** Establish A2X as the global system of record for expert-led workflows.

### Direction

- Geographic expansion to LATAM and APAC
- Deep vertical specialization (sub-platforms within legal, clinical, etc.)
- Potential foundation/stewardship structure separation
- Strategic partnerships or acquisition considerations (Thomson Reuters, LexisNexis, Wolters Kluwer)
- IPO path or mission-locked private structure

---

## Vertical Rollout Order

| # | Vertical | Anchor | Phase | Reasoning |
|---|---|---|---|---|
| 1 | Family Law / Co-Parenting | CoTrackPro | Phase 0–1 | Founder expertise, deep existing content, clear demand |
| 2 | Trial Advocacy | Metasystems / Eric Oliver | Phase 2 | Existing licensed product, NITA credibility |
| 3 | Speaking Business | Lois247 / Lois Creamer | Phase 2 | Existing client base, proven monetization |
| 4 | Civic / Government | Access To initiative | Phase 3 | Missouri reference implementation ready |
| 5 | Mediation & ADR | Access To Mediation | Phase 3 | Complementary to family law |
| 6 | Workforce & Jobs | MO Jobs / STC Jobs | Phase 3 | WIOA framework ready |
| 7 | Clinical / Mental Health | TBD | Phase 4 | Requires HIPAA; high compliance burden |
| 8 | Business Strategy | TBD | Phase 4 | Higher competition, bigger market |
| 9 | Education | Doug / AI Education Network | Phase 4 | DESE framework ready |
| 10+ | Trades, HR, Immigration, etc. | TBD | Phase 5 | Long-tail expansion |

---

## Risks & Dependencies

| Risk | Mitigation |
|---|---|
| Expert supply fails to materialize | Anchor tenancy with Doug's content; institutional partnerships for supply |
| Regulatory action on UPL (unauthorized practice of law) | Strong disclaimers, educational framing, attorney-reviewed content, bar partnerships |
| Content quality / liability incident | Peer review, insurance, Ethics Board, clear ToS |
| Credit model confuses users | A/B test simpler pricing (flat per-playbook option) |
| Enterprise sales cycle too long | Start with mid-market + state bar CLE libraries for faster revenue |
| Funding gap before Series A | Grant funding (civic tech), revenue-based financing, strategic partner investment |
| International regulatory complexity | Launch in jurisdictions with clear frameworks first (UK, Canada), build localization layer |

---

## Open Questions

- Naming & brand architecture: keep "Access To Experts" for all tiers, or segment with an enterprise brand?
- Mobile strategy: web-first vs. native apps in Phase 2 vs. Phase 3?
- AI provider strategy: Claude-primary, or multi-model from day one?
- Governance evolution: when to formalize foundation structure?

These questions will be addressed via RFCs as the roadmap progresses.
