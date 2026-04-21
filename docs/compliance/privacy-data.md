# Privacy & Data Governance

How A2X collects, uses, stores, and shares data. This document informs the user-facing Privacy Notice and the design of data controls in product.

**Disclaimer:** This document is internal design framing. The authoritative user-facing privacy notice is published separately.

---

## Scope

A2X processes data about:

- **Users** (seekers, experts, enterprise users)
- **Organizations** (enterprise customers)
- **Session participants** (third parties mentioned in user inputs — e.g., a co-parent named in a custody playbook)

A2X is:

- **Data controller** for platform operations, analytics, and payment data
- **Data processor** (on behalf of enterprise customers) for enterprise-tenant user data where configured
- **Joint controller** (with the authoring expert) for playbook content and session outcome data where consented

---

## Data Categories

### Account data

- Name, email, password hash, locale, timezone
- OAuth provider IDs (if applicable)
- MFA configuration
- Consent flags (marketing, research)
- Account creation, last login timestamps
- IP address (at signup / login events)

### Billing data

- Payment method (tokenized at Stripe; A2X stores last 4 digits and brand only)
- Billing address
- Invoice history
- Subscription state
- Credit ledger entries

### Usage data

- Playbook views, sessions started, steps executed
- Search queries, clicks, time-on-step
- Device type, browser, OS
- Feature flags served

### Session content data

- User inputs to playbook steps (may include sensitive facts)
- AI prompts and outputs
- Generated artifacts
- Step path and branching decisions
- Session-generated notes and reviews

### Expert data (for expert accounts)

- Credentials (license numbers, certifications)
- Jurisdictions of practice
- Bio, headshot, professional URLs
- Insurance policy metadata
- Earnings history
- Tax identification (for 1099 reporting)

### Third-party data in session inputs

- Names, relationships, facts about others mentioned in user inputs (e.g., a co-parent, a supervisor, a family member)
- Not collected from the third party; collected via the user

### Audit data

- Security events, admin actions, access logs
- Device/IP/User-Agent for security-relevant actions

---

## Data Use

### Permitted uses (platform)

- **Provide the service** — account auth, session execution, artifact generation, billing, support
- **Improve the service** — aggregate analytics, A/B testing (with consent)
- **Safety and fraud prevention** — detect abuse, enforce policy
- **Legal compliance** — respond to lawful requests, satisfy tax and records requirements
- **Communications** — transactional (always), marketing (with consent)

### Conditional uses (with opt-in consent)

- **Research aggregates** — anonymized data for outcome research, published with privacy board review
- **Training data** — consented, anonymized, expert-validated data for AI model improvement (future product line)
- **Marketing case studies** — user-opt-in with explicit approval of any content

### Prohibited uses

- Sale of individual-level data (never)
- Use of session content for advertising profiles
- Cross-platform tracking beyond A2X
- Surveillance on behalf of third parties outside a lawful request

---

## Legal Bases (GDPR-aligned)

| Use | Legal basis |
|---|---|
| Account creation and service delivery | Contract (GDPR Art. 6(1)(b)) |
| Billing and financial records | Contract + Legal obligation |
| Security and fraud prevention | Legitimate interest |
| Transactional email | Contract |
| Marketing email | Consent |
| Research / training data | Consent |
| Anonymized aggregates | Legitimate interest (where truly anonymized) |
| Legal compliance disclosures | Legal obligation |

EU/UK users' data processed with DPA and SCCs where transfer to US is involved.

---

## Data Subject Rights

Users can exercise the following rights via `/settings/privacy`:

- **Access** — export all data tied to account in machine-readable format (JSON + artifacts)
- **Correction** — update account data, request correction of content data
- **Deletion** — soft delete account; data hard-deleted after 30-day reversal window, except legally-required retention
- **Portability** — export playbook sessions, artifacts, credit ledger
- **Objection** — opt out of marketing, research use, AI training
- **Restriction** — limit processing pending a dispute
- **Consent withdrawal** — at any time for consent-based processing
- **Complain to supervisory authority** — link provided

### Response times

- Acknowledgment: within 3 days
- Completion: within 30 days (may extend once by 30 days for complex requests, with notice)

### Identity verification

- Requests authenticated via account credentials
- Sensitive requests (deletion, access) may require MFA or email re-verification
- Unauthenticated requests require identity proof (government ID) before action

---

## Retention

Summary (see [`../architecture/data-model.md`](../architecture/data-model.md) for detail):

| Data | Retention | Trigger |
|---|---|---|
| Active account data | Life of account | Account deletion starts clock |
| Session data (consumer) | 2 years from last activity | Rolling |
| Session data (enterprise) | Per contract (typically 5–7 years) | Contract end |
| Artifacts | Matches session retention | |
| Credit ledger | 7 years | Financial records requirement |
| Audit logs | 1 year hot, 7 years cold | |
| Expert profile (retired) | 7 years | For tax and session history reference |
| Security incident data | 7 years | |
| Backup snapshots | 90 days | |

Users can request earlier deletion (subject to legal retention requirements).

---

## Data Residency

- **v1:** US-hosted (AWS us-east-1 primary, us-west-2 failover)
- **Phase 3:** EU residency option (eu-west-1) for EU users and enterprise
- **Phase 3+:** Canada, Australia options for respective regions
- **Per-enterprise-contract:** Residency commitments in MSA/DPA

Cross-border transfers governed by:

- SCCs (Standard Contractual Clauses) for EU-US
- Jurisdiction-specific frameworks where available
- User consent where required

---

## Subprocessors

Current planned subprocessors (see [`../architecture/security.md`](../architecture/security.md)):

- AWS — infrastructure
- Stripe — payments
- Anthropic — AI inference
- Persona / Jumio — identity verification
- SES or Postmark — transactional email
- Sentry — error tracking
- PagerDuty or Opsgenie — operational alerts

### Subprocessor due diligence

- SOC 2 Type II review
- DPA execution
- Privacy and security policy review
- Subprocessor's own subprocessors reviewed
- Data residency confirmation
- Exit plan documented

Subprocessor list maintained publicly on a dedicated page (Phase 2). Customers notified of changes with 30-day advance notice.

---

## Session Content Privacy

Session inputs may contain highly sensitive facts (custody disputes, clinical reflections, legal positions, trade secrets). Special controls:

- **Encryption:** Sensitive fields encrypted at application layer with KMS
- **Access control:** Only the session owner (and org admins for org-owned sessions with user consent) can read session content
- **Platform staff access:** Break-glass only, with ticket and user notification where permitted
- **No platform use for advertising or profiling**
- **No AI training** unless user opt-in with clear consent
- **Minimal logging:** Session content not written to application logs

### Incognito sessions

Selected sensitive verticals (DV, some clinical) default to incognito:

- Minimal retention (30 days, then deleted)
- Excluded from recommendations and history
- Not shareable
- Artifacts flagged as sensitive

Users can toggle any session to incognito.

### Third-party data in session inputs

When users enter facts about third parties (co-parents, opposing counsel, colleagues):

- Users are instructed to enter only necessary, accurate information
- Third parties may have limited rights under applicable law (e.g., GDPR Art. 15); A2X will facilitate reasonable requests
- Users are asked not to enter sensitive categories (health, race, sexual orientation) about third parties unless essential

---

## Children's Privacy

- Service not directed to users under 18
- Account terms require 18+ (or age of majority in user's jurisdiction)
- Accidental minor accounts: disabled on detection; parental contact attempted
- COPPA posture: not a covered service (no collection from children under 13 with intent); defense: age gate + ToS
- Child-related content (co-parenting, family law, education): adults use on behalf of understanding their children's situation; child welfare prioritized in content design

---

## Marketing & Communications

- Transactional email: always sent (account, billing, security) — not opt-out
- Marketing email: opt-in; unsubscribe via one click
- Push notifications: opt-in
- SMS: opt-in, with CAN-SPAM and TCPA compliance
- Do Not Track: honored where applicable
- GPC (Global Privacy Control): honored

---

## Cookies & Tracking

Minimal cookie footprint:

- **Strictly necessary** — auth, CSRF, session (no consent needed)
- **Preferences** — locale, UI settings (consent default acceptable)
- **Analytics** — first-party, aggregated (consent requested; privacy-preserving by default)
- **Marketing / advertising** — none first-party; no third-party pixels

Consent banner on first visit with granular controls.

---

## Breach Notification

- Internal detection → incident response per [`../architecture/security.md`](../architecture/security.md)
- **GDPR:** 72-hour notification to supervisory authority; notification to affected data subjects without undue delay if high risk
- **CCPA:** notification without unreasonable delay to California AG and residents if covered breach
- **US state laws:** per-state notification timing and thresholds followed
- **Enterprise customers:** per DPA; typically 48–72 hours
- **Content of notification:** what happened, what data, what we're doing, what they should do, how to learn more

---

## Data Protection Officer

A Data Protection Officer (DPO) will be designated when processing reaches thresholds requiring one under GDPR Art. 37 or when customer/regulator requests require. Role may initially be combined with legal/compliance lead; separated in Phase 3.

---

## Privacy by Design

Every new feature passes privacy review:

- What data does it collect? Is it necessary?
- Who can access it? With what controls?
- How long is it retained?
- What legal basis?
- What are the user controls?
- What are the failure modes?

DPIAs (Data Protection Impact Assessments) conducted for high-risk processing (new verticals, AI features processing sensitive data, third-party integrations).

---

## Related

- [`trust-safety.md`](trust-safety.md)
- [`liability-framework.md`](liability-framework.md)
- [`../architecture/security.md`](../architecture/security.md)
- [`../architecture/data-model.md`](../architecture/data-model.md)
