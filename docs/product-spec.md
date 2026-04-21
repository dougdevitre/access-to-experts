# Product Specification — Access To Experts

**Status:** v0.1 — Specification phase
**Owners:** Founding team
**Last updated:** Month of initial authoring

---

## 1. Goals

Access To Experts (A2X) shall:

1. Enable credentialed experts to package their methodology as executable playbooks with versioning, jurisdiction scope, and peer review.
2. Enable users to discover, execute, and resume playbooks through an AI-guided three-pane interface.
3. Meter usage via a credit system backed by a transparent ledger.
4. Support multi-tier expert credentialing (Anchor, Certified, Emerging) with clear revenue share and promotion criteria.
5. Enforce jurisdiction awareness and content compliance as first-class platform constraints.
6. Generate verifiable artifacts (documents, decisions, plans) with audit trails.
7. Support enterprise deployment via corporate licenses, white-label, and API access.
8. Provide outcome data products that power a defensible data moat.
9. Operate under enterprise-grade compliance posture (SOC 2, GDPR, HIPAA-ready).
10. Launch with a child-centered, trauma-informed design posture across sensitive verticals.

## 2. Non-Goals

A2X v1 explicitly will **not**:

1. Provide 1:1 live consultations with experts (separate product surface, out of v1 scope).
2. Function as a matchmaking service for long-term engagements (v1 is session-based).
3. Replace regulated professional services (law, medicine, etc.) — framed as educational information, not personalized advice.
4. Support HIPAA-covered clinical workflows in v1 (deferred to Phase 4 with full HIPAA stack).
5. Operate in jurisdictions without clear regulatory frameworks (deferred until legal review complete).
6. Publish user-generated playbooks without credential verification and content review.
7. Offer a free tier in v1 beyond preview access (credit-first monetization preserves quality signal).
8. Build native mobile apps in Phase 1 (mobile-web first).
9. Support offline execution in v1.
10. Generate playbooks autonomously via AI without expert authorship and review.

## 3. Personas & User Stories

### 3.1 Seeker Personas

**P1 — Self-Advocate Parent**
> A parent in St. Louis responding to a custody modification motion. Cannot afford full attorney representation. Needs guided, jurisdiction-accurate help to respond pro se.

**P2 — Professional Under Pressure**
> A mid-career manager preparing for a termination conversation. Needs a structured, legally-reviewed script and checklist.

**P3 — Solo Business Owner**
> A consultant preparing a Series A pitch. Needs a framework-based approach from a proven operator.

**P4 — Professional Buyer**
> An attorney using A2X to accelerate intake and case preparation with peer-reviewed playbooks.

### 3.2 Expert Personas

**E1 — Anchor Expert**
> A nationally-recognized family law attorney who wants to scale her impact beyond her practice.

**E2 — Certified Practitioner**
> A licensed clinical social worker who specializes in co-parent coaching. Wants to monetize his methodology.

**E3 — Emerging Expert**
> A recent bar admit in a specialized area (immigration, elder law) building reputation and income.

### 3.3 Enterprise Personas

**EN1 — Professional Body Buyer**
> Director of CLE at a state bar association. Wants to license a playbook library for member benefit.

**EN2 — Corporate Buyer**
> General counsel at a Fortune 500. Wants compliance playbooks deployed across legal team.

**EN3 — Government Buyer**
> Director of workforce development at a state agency. Wants reentry and employment playbooks for constituents.

### 3.4 User Stories

**Seeker stories:**

- As a Seeker, I can describe my situation in natural language and get 3–5 relevant playbook recommendations.
- As a Seeker, I can preview the first 3 steps of a playbook before spending credits.
- As a Seeker, I can see the expert's credentials, ratings, and outcome data before starting.
- As a Seeker, I can start a playbook and pause at any step, resuming days later.
- As a Seeker, I can generate artifacts (documents, plans) and download them in standard formats.
- As a Seeker, I can share a read-only session view with a third party (attorney, family member).
- As a Seeker, I can see exactly how many credits a step will cost before running it.
- As a Seeker, I can fork a completed session to try alternate paths.
- As a Seeker, I am warned if a playbook is outside my jurisdiction.
- As a Seeker, I can rate and review a playbook after completion.

**Expert stories:**

- As an Expert, I can apply to the platform and have my credentials verified.
- As an Expert, I can author a playbook using a visual builder or Markdown.
- As an Expert, I can test my playbook as a user before publishing.
- As an Expert, I can version my playbook and flag old versions as outdated.
- As an Expert, I can see live analytics on completions, revenue, and user outcomes.
- As an Expert, I can respond to user questions routed through the platform.
- As an Expert, I can set my own credit pricing within platform bounds.
- As an Expert, I can restrict playbooks to specific jurisdictions I am licensed in.
- As an Expert, I can see how my ranking is computed and what improves it.
- As an Expert, I can get paid on a regular schedule with clear deductions.

**Enterprise stories:**

- As an Enterprise buyer, I can license a curated playbook library for my team.
- As an Enterprise buyer, I can white-label the interface with my organization's branding.
- As an Enterprise buyer, I can see aggregate usage and outcome data for my seats.
- As an Enterprise buyer, I can integrate A2X into my existing tools via API.
- As an Enterprise buyer, I can enforce data residency requirements (EU, US).
- As an Enterprise buyer, I can require SSO and MFA for my users.
- As an Enterprise buyer, I can receive SOC 2 Type II reports and complete my vendor due diligence.

## 4. Scope — v1 (Phase 1)

### 4.1 In Scope

- Web-based three-pane interface (responsive, mobile-web)
- Playbook authoring (Markdown import + visual builder)
- Session execution with Claude-powered AI guidance
- Credit ledger with Stripe billing
- Expert identity verification and credential verification for legal/clinical verticals
- Content QA pipeline (automated + peer review)
- Jurisdiction enforcement at playbook and session level
- Artifact generation (DOCX, PDF, JSON)
- Session persistence, resume, fork, share
- Ranking algorithm (completion rate, rating, recency)
- Invite-only expert onboarding
- Institutional pilot support (one partnership in v1)

### 4.2 Deferred

- Native mobile apps
- Real-time collaboration on a session
- Multi-language support (launching English-only)
- 1:1 expert consultation booking
- Complex branching with external API calls (v2)
- Multi-tenant white-label (v2)
- Full enterprise SSO (SAML/OIDC) — v1 supports email/password + Google OAuth
- FedRAMP authorization
- HIPAA covered workflows

## 5. Data Model

See [`architecture/data-model.md`](architecture/data-model.md) for full detail. Summary:

### Core entities

- **Expert** — credentialed practitioner, tiered, jurisdiction-scoped
- **Playbook** — versioned, expert-authored methodology with steps and metadata
- **PlaybookVersion** — immutable version of a playbook
- **Step** — atomic unit within a playbook version (prompt, inputs, branches, artifacts)
- **Session** — user's execution of a specific playbook version
- **StepExecution** — record of user input and AI output for one step in one session
- **Artifact** — generated output (document, structured data) belonging to a session
- **User** — authenticated seeker, expert, or enterprise user
- **Organization** — enterprise tenant (multi-user)
- **CreditLedgerEntry** — immutable credit transaction
- **Review** — user review of a playbook post-completion
- **ExpertReview** — peer review of a playbook by another credentialed expert
- **JurisdictionTag** — first-class entity for country/state/region scoping
- **PracticeArea** — taxonomy of domains (family law, trial advocacy, etc.)

### Key relationships

```
Expert (1) ───< (N) Playbook (1) ───< (N) PlaybookVersion (1) ───< (N) Step
                                                                       │
User (1) ───< (N) Session (N) ─── (1) PlaybookVersion                  │
Session (1) ───< (N) StepExecution (1) ─── (1) Step ◄───────────────────┘
Session (1) ───< (N) Artifact
User (1) ───< (N) CreditLedgerEntry
Playbook (N) ───< (M) JurisdictionTag
```

## 6. API Surface

See [`architecture/api-routes.md`](architecture/api-routes.md) for full detail. Summary:

### Public REST API

```
# Discovery
GET    /v1/playbooks                      List / search playbooks
GET    /v1/playbooks/:id                  Get playbook details
GET    /v1/playbooks/:id/preview          Get free preview
GET    /v1/experts                        List experts
GET    /v1/experts/:id                    Get expert profile

# Sessions (authenticated)
POST   /v1/sessions                       Start a session
GET    /v1/sessions                       List user's sessions
GET    /v1/sessions/:id                   Get session detail
POST   /v1/sessions/:id/steps/:stepId     Execute a step (consumes credits)
POST   /v1/sessions/:id/pause             Pause session
POST   /v1/sessions/:id/resume            Resume session
POST   /v1/sessions/:id/fork              Fork a completed session
POST   /v1/sessions/:id/share             Generate share link
GET    /v1/sessions/:id/artifacts         List session artifacts
GET    /v1/artifacts/:id                  Download artifact

# Credits & billing
GET    /v1/credits/balance                Current balance
GET    /v1/credits/ledger                 Transaction history
POST   /v1/credits/purchase               Buy credits
POST   /v1/billing/subscribe              Start subscription
POST   /v1/billing/cancel                 Cancel subscription

# Expert authoring
POST   /v1/experts/me/playbooks           Create playbook
PUT    /v1/experts/me/playbooks/:id       Update playbook draft
POST   /v1/experts/me/playbooks/:id/submit   Submit for review
GET    /v1/experts/me/analytics           Expert earnings & analytics

# Reviews
POST   /v1/playbooks/:id/reviews          Submit user review
POST   /v1/playbooks/:id/peer-reviews     Submit peer review (experts only)

# Enterprise
GET    /v1/orgs/:id/seats                 Manage seats
POST   /v1/orgs/:id/playbook-library      Curate org library
GET    /v1/orgs/:id/analytics             Org usage & outcomes
```

### MCP Surface (for Claude integration)

```
a2x_search_playbooks      Search and filter playbooks
a2x_get_playbook          Retrieve full playbook definition
a2x_start_session         Start a new session
a2x_execute_step          Execute a step within a session
a2x_get_session_state     Fetch current session state
a2x_generate_artifact     Generate an artifact from session data
a2x_get_credit_balance    Check credit balance
```

## 7. Security

See [`architecture/security.md`](architecture/security.md) for full detail. Summary:

- **Authentication:** Email/password + OAuth (Google) in v1. SAML/OIDC SSO in Phase 2.
- **Authorization:** Role-based (Seeker, Expert, Admin, Enterprise Admin). Resource-level ACLs.
- **Data in transit:** TLS 1.2+ everywhere. HSTS.
- **Data at rest:** AES-256 via AWS KMS. Per-tenant encryption keys for enterprise.
- **Secrets:** AWS SSM SecureString only. No hardcoded credentials. No secrets in logs.
- **IAM:** Least-privilege. Service roles scoped per function. Quarterly access review.
- **PII handling:** Automated detection and redaction utilities. User-controlled retention.
- **Audit logging:** All security-relevant events to CloudWatch with 1-year retention.
- **Incident response:** Documented runbook. 72-hour notification for data incidents per GDPR.
- **Vendor review:** All third-party processors reviewed and listed in DPA.

## 8. Edge Cases

| # | Case | Handling |
|---|---|---|
| 1 | Expert deletes playbook mid-session | Session continues on pinned version; user warned at completion |
| 2 | Credit exhaustion mid-step | Step rolls back; user prompted to add credits; partial progress preserved |
| 3 | Jurisdiction mismatch detected mid-session | Warning banner; user can proceed with acknowledgment or exit |
| 4 | Statute change invalidates published playbook | Flagged "outdated" automatically; users notified; expert prompted to update |
| 5 | Expert loses credential mid-publication | Playbooks unlisted but preserved; active sessions complete; users refunded if not yet completed |
| 6 | User disputes a generated artifact | Ticket routed to Expert + A2X support; full session audit available |
| 7 | AI generates content outside playbook scope | Guardrails constrain AI to playbook context; out-of-scope requests return "not covered in this playbook" |
| 8 | Enterprise user exceeds seat count | Soft block with admin notification; overage billing option |
| 9 | Suspicious review pattern detected | Review held for moderator review; flagged for gaming detection |
| 10 | Data subject access request (GDPR/CCPA) | Automated export; 30-day response SLA |
| 11 | Right-to-delete request | Session data deleted within 30 days; expert revenue records retained for 7 years for tax |
| 12 | Expert and platform dispute over content takedown | Ethics Board review; expert can appeal |
| 13 | Network failure during step execution | Idempotent step execution with retry; credits not double-deducted |
| 14 | Shared session link accessed after user revokes | Access denied; audit logged |
| 15 | Minor inadvertently creates account | Age verification at signup; account suspended pending parental consent |

## 9. Test Plan

### 9.1 Unit tests

- Schema validators for Playbook, Session, CreditLedgerEntry
- Credit calculation logic (step cost, AI turn cost, artifact cost)
- Jurisdiction matching logic
- Branching logic evaluator
- Artifact template rendering
- Target: 80%+ coverage on core packages

### 9.2 Integration tests

- Full session lifecycle (start → execute → complete → artifact)
- Session fork and share
- Expert authoring → review → publish workflow
- Credit purchase → consumption → balance reconciliation
- Stripe webhook handling

### 9.3 E2E tests

- Seeker journey: discover → preview → start → complete → rate
- Expert journey: apply → verify → author → submit → publish → earn
- Enterprise journey: license → seat assign → usage report

### 9.4 Security tests

- OWASP Top 10 for web (automated + manual pentest Phase 2)
- Authentication bypass attempts
- Authorization escalation attempts
- Injection attacks on playbook content
- PII exfiltration attempts
- Rate limiting validation

### 9.5 Compliance tests

- GDPR data subject rights (access, deletion, portability)
- CCPA disclosures
- WCAG 2.2 AA accessibility audit
- Jurisdiction enforcement validation

### 9.6 Content quality tests

- Expert credential verification accuracy
- Peer review workflow validation
- Automated lint rules (PII, inflammatory language, required disclaimers)
- Outcome reporting accuracy

## 10. Rollout Plan

### Phase 0 — Specification (current)

- Publish specs, schemas, governance
- Identify founding experts (10–15)
- Secure first institutional letter of intent

### Phase 1 — Closed alpha (Months 3–6)

- Internal use only (Doug + invited experts)
- CoTrackPro as anchor publisher
- 10 playbooks live in family law vertical
- 50 invited alpha users
- Feedback loop: weekly iteration

### Phase 1 — Closed beta (Months 6–9)

- Invite-only expert program (15–25 experts)
- Institutional pilot launched
- Second vertical content authoring begins
- 1,000 beta users
- SOC 2 Type I readiness

### Phase 2 — Public launch (Month 9+)

- Open to public with consumer tiers
- Second vertical live
- First paid enterprise contract
- Marketing launch
- Content velocity: 10 new playbooks/week

### Rollout safeguards

- Feature flags for all new capabilities
- Staged rollout (5% → 25% → 100%)
- Rollback plan for every deploy
- Synthetic monitoring on core flows
- Incident response on-call rotation

## 11. Success Metrics

### Phase 1

- 1,000 active users
- 50+ playbooks across flagship vertical
- 15+ active experts
- First institutional pilot live
- <5% session abandonment rate
- NPS > 40

### Phase 2

- 10,000 active users
- 200+ playbooks, 75+ experts, 2 verticals
- $500K ARR
- First enterprise contract > $25K
- SOC 2 Type I
- <3% session abandonment

### Phase 3+

- See [`ROADMAP.md`](../ROADMAP.md)

## 12. Open Questions

1. **Naming architecture.** Keep "Access To Experts" for consumer and enterprise, or segment with enterprise brand?
2. **AI provider.** Claude-primary with fallback, or multi-provider from v1?
3. **Credit vs flat pricing.** Are there verticals where flat per-playbook works better than credits?
4. **Expert-set pricing bounds.** How much pricing discretion to give experts without fragmenting UX?
5. **Free preview length.** 3 steps, or dynamic based on playbook length?
6. **Peer review tier.** All playbooks peer-reviewed, or only sensitive verticals?
7. **Anchor expert equity.** Do some anchor experts receive platform equity instead of revenue share?

These will be resolved via RFCs during Phase 0–1.

## Appendix: Related Documents

- [`vision.md`](vision.md)
- [`enterprise-strategy.md`](enterprise-strategy.md)
- [`unit-economics.md`](unit-economics.md)
- [`architecture/system-overview.md`](architecture/system-overview.md)
- [`architecture/data-model.md`](architecture/data-model.md)
- [`architecture/api-routes.md`](architecture/api-routes.md)
- [`architecture/security.md`](architecture/security.md)
- [`compliance/trust-safety.md`](compliance/trust-safety.md)
- [`verticals/v1-family-law.md`](verticals/v1-family-law.md)
