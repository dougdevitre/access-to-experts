# Liability Framework

How A2X handles liability across platform, experts, and users. This document describes the framework; the legal instruments (ToS, Expert Content Agreement, disclaimers) are implemented separately with counsel.

**Disclaimer:** This document is internal design and educational framing. It is not legal advice. Final terms are drafted by outside counsel.

---

## Framework Overview

A2X operates under a three-tier liability model:

1. **Platform liability** — A2X's obligations as a technology provider
2. **Expert liability** — The authoring expert's obligations for their content
3. **User responsibility** — The user's obligations for how they apply content

Each tier has defined responsibilities, defenses, and insurance coverage.

---

## Platform Liability (A2X)

### What A2X is responsible for

- Platform availability and security
- Enforcing its own content and safety policies
- Verifying expert credentials as claimed
- Processing payments accurately
- Providing a good-faith dispute resolution process
- Compliance with applicable laws (privacy, accessibility, etc.)
- Protecting user data

### What A2X is not responsible for

- The substantive correctness of expert-authored content (content is the expert's)
- User outcomes (no warranty that using a playbook will produce a specific result)
- User application of content in their specific situation
- Third-party AI provider outages (best-effort uptime, not guaranteed)

### Posture

A2X operates closer to a **conduit/marketplace** than a service provider:

- **Not** providing legal, medical, clinical, or financial advice
- **Not** a law firm, medical practice, or licensed professional service
- **Is** a platform that hosts expert-authored content and provides execution infrastructure

This is similar to Upwork (marketplace), Teachable (content platform), or Calendly (tooling) — not like a law firm or telemedicine provider.

### Platform insurance

- Errors and Omissions (E&O) / Professional Liability — platform-level coverage
- General Liability
- Cyber liability (data breach coverage)
- D&O (Directors and Officers) — once board seated

Coverage levels scale with stage:
- Seed/Phase 1: $1M/$3M
- Series A/Phase 3: $5M/$10M
- Later stages: aligned with enterprise customer requirements

---

## Expert Liability

### Expert obligations

By publishing a playbook, the expert agrees to:

- Personally stand behind the methodology as accurate and lawful
- Operate within their licensed jurisdictions and practice areas
- Include appropriate disclaimers and scope statements
- Maintain any required professional insurance (malpractice/E&O for regulated professions)
- Indemnify A2X for claims arising from expert's content (bounded — see below)
- Keep content current (update when material changes occur)
- Respond to content flags and user questions in a reasonable timeframe

### Expert insurance requirements

| Vertical | Requirement |
|---|---|
| Legal | Malpractice insurance with A2X named as additional insured OR evidence of bar-required coverage |
| Clinical (therapy, counseling) | Malpractice coverage required |
| Medical (if ever active) | Malpractice coverage required; elevated standards |
| Business coaching, speaking, strategy | Recommended, not required |
| Civic, education | Recommended, not required |

Insurance proof is verified at onboarding and annually re-verified.

### Bounded indemnification

Expert indemnification is bounded so as not to chill authoring:

- Expert indemnifies for claims arising directly from the substantive content of their playbook (e.g., misstatement of law, failure to include required disclosures)
- Expert does **not** indemnify for platform-level issues (security, billing, downtime)
- Indemnification cap: typically 12 months of platform earnings from the expert, or a fixed floor (e.g., $10,000), whichever is greater — subject to counsel finalization
- No indemnification where A2X was negligent

### Expert content license

- Expert retains ownership of their underlying methodology and content
- Expert grants A2X a non-exclusive license to host, display, execute, and adapt the content for platform purposes
- License includes right to store session-generated derivative data (with user consent)
- License terminates on content takedown, subject to session-completion obligations
- A2X does not claim ownership of the expert's methodology outside platform-specific adaptations

---

## User Responsibility

### User agreement

By starting a session, the user acknowledges:

- Content is educational information, not personalized professional advice
- They are responsible for their application of content to their specific situation
- They should consult a licensed professional for binding advice
- They agree to accurate input (false input → poor output; no warranty against garbage-in-garbage-out)

### User indemnification

Users indemnify A2X for:

- Their misuse of the platform (abuse, fraud, illegal activity)
- Claims arising from their violation of the ToS or applicable law

Users do **not** indemnify A2X for platform failures.

### Consumer protections respected

Nothing in A2X's user agreement waives consumer protections that are not waivable under applicable law (e.g., state consumer protection statutes, EU consumer rights).

---

## Disclaimers (embedded in product)

### Universal disclaimer (every session)

> Access To Experts provides educational information and structured workflows authored by credentialed experts. The content you see and the artifacts you generate are not personalized professional advice. Apply this to your situation only after considering your specific facts; consult a licensed professional for binding advice where needed.

### Vertical-specific disclaimers (examples)

**Legal (all legal playbooks):**

> This playbook is authored by a licensed attorney and provides educational information about the law in the jurisdiction noted above. It does not create an attorney-client relationship with the expert or with Access To Experts. It is not a substitute for advice from your own attorney. If you are in a legal proceeding, consider consulting a lawyer licensed in your jurisdiction.

**Clinical / mental health:**

> This playbook is authored by a licensed clinician and provides educational information, structured tools, and self-reflection prompts. It is not psychotherapy, diagnosis, or clinical treatment. It does not create a clinician-patient relationship. If you are in crisis or experiencing severe symptoms, contact a licensed mental health professional or a crisis resource such as 988 (US).

**Family law (additional):**

> The best interests of any children involved are paramount. This playbook is designed to support child-centered decision-making. If children are experiencing harm or risk of harm, contact appropriate authorities immediately.

**Business / strategy:**

> This playbook provides business guidance authored by an experienced practitioner. Applying this guidance is at your risk. For specific legal, tax, or regulatory decisions, consult a licensed professional.

### Jurisdiction disclaimers

When a user's apparent jurisdiction differs from a playbook's scope:

> This playbook is scoped to [jurisdiction]. You appear to be in [user jurisdiction]. The law and best practices differ between jurisdictions. Consider whether this playbook fits your situation or whether you should seek one specific to your jurisdiction.

---

## Specific Risk Areas

### Unauthorized Practice of Law (UPL)

High-attention area. Mitigations:

- Every legal playbook authored by an attorney licensed in the playbook's jurisdiction
- Content framed as educational, not advice
- Users directed to retain their own attorney for case-specific decisions
- No live 1:1 legal advice through platform in v1
- Partnership with state bar associations to establish defensible posture
- Explicit "educational information only" framing in UI
- No appearance of forming an attorney-client relationship with A2X or the expert

A2X consults with legal ethics scholars and bar counsel on UPL posture per vertical and jurisdiction.

### Clinical safety

- No diagnostic assertions in playbook content
- No treatment protocols that could be unsafe if misapplied
- Crisis resources surfaced proactively
- Eating-disorder, self-harm, and psychosis-specific content handled with extreme caution (v1 defers most of these)

### Financial / regulated advice

- Financial planning playbooks operate in educational framing
- No specific investment recommendations
- No securities advice from non-RIAs
- Tax content educational, not return-preparation

### AI output correctness

- AI output is caveated as AI-generated and expert-framed
- Users prompted to review output before applying
- Errors identified are correctable by restart or expert appeal
- Platform does not claim AI output is infallible

---

## Dispute Resolution

### User complaints

- First: in-product support ticket
- Second: platform moderation review (5 business days)
- Third: appeal to platform admin (10 business days)
- Fourth: (for unresolved serious complaints) Ethics Board review

### Expert-platform disputes

- First: direct conversation with expert success team
- Second: Ethics Board review
- Final: binding arbitration per ToS (for monetary disputes above a threshold)

### Enterprise disputes

- Per contract; typically direct negotiation, then mediation, then arbitration

### Class action waiver

- ToS includes class action waiver and arbitration clause (subject to enforceability by jurisdiction)
- Users retain right to small-claims court per jurisdiction
- Opt-out option provided as required

---

## Regulatory Cooperation

### Subpoenas and law enforcement requests

- A2X responds only to legally valid requests
- User notification where permitted
- Transparency report aggregates
- Public policy on data requests published

### Data subject requests

- Automated portal for access, deletion, portability
- 30-day response SLA (GDPR/CCPA aligned)
- Identity verification required before fulfilling

### Regulators

- Privacy: DPIA maintained; engage supervisory authority if required
- Bar counsel: engage proactively in legal vertical
- FTC: general compliance with FTC Act, online marketplace guidance
- State AGs: cooperate on inquiries

---

## Exit and Continuity

### Platform failure

- Data portability: users can export all their data
- Playbook portability: experts can export their playbook content
- Payout completion: outstanding expert earnings paid per contract

### Expert departure

- Active sessions continue on pinned playbook version
- Future revenue ceases
- Earnings through departure date paid per schedule
- Expert's name and bio removed from listings; historical session attribution preserved

### Enterprise contract end

- Data export provided in standard format
- Data deletion per contract (typically 90 days post-termination)
- Ongoing user sessions handled per individual user licenses

---

## Documents to Finalize (Legal Phase)

These legal documents flow from this framework and are authored with outside counsel:

- **Terms of Service** (consumer)
- **Enterprise Master Services Agreement**
- **Data Processing Agreement** (for controllers processing user data)
- **Expert Content Agreement**
- **Peer Reviewer Agreement**
- **Acceptable Use Policy**
- **Privacy Notice** (consumer-facing)
- **Cookie Notice**
- **Copyright / DMCA Policy**
- **Vertical-specific addenda** (legal, clinical)

---

## Related

- [`trust-safety.md`](trust-safety.md)
- [`privacy-data.md`](privacy-data.md)
- [`../../GOVERNANCE.md`](../../GOVERNANCE.md)
