# Trust & Safety

How A2X verifies experts, reviews content, handles abuse, and protects users — especially in sensitive verticals (family law, clinical, immigration, children).

---

## Guiding Principles

1. **Credibility is earned.** Every expert-facing claim must trace to a verifiable credential.
2. **Safety over growth.** No playbook reaches production if it can foreseeably harm a user.
3. **Child-centered and trauma-informed.** Where content touches children or trauma survivors, their interests are paramount and override commercial considerations.
4. **Transparency in enforcement.** Users and experts know why enforcement actions are taken.
5. **Due process.** Experts have the right to appeal content and status decisions.

---

## Expert Verification

### Step 1 — Identity verification

- Government-issued ID + live selfie match via Persona or Jumio
- Name on ID must match account name
- Liveness check to prevent deepfake bypass
- One verified identity per account; duplicate detection across the platform

### Step 2 — Credential verification

Automated API lookups wherever possible; manual verification fallback.

| Credential Type | Primary Source | Fallback |
|---|---|---|
| US bar license | State bar association APIs / ABA lookup | Direct bar verification |
| Medical license | FSMB DocInfo (when live), state medical boards | State board direct |
| Psychologist license | ASPPB PSY\|Book / state psychology boards | State board direct |
| LCSW / LMFT | State licensing boards | Manual verification |
| International credentials | Per-country regulatory bodies | Document review by team |
| Academic degrees | NSC Student Clearinghouse; institution registrar | Transcript review |
| Professional memberships | Association APIs where available | Member directory lookup |
| Certifications | Issuing organization APIs | Document review |

### Step 3 — Continuous monitoring

Monthly re-check of all credentials:

- Bar: active, in good standing, no disciplinary actions
- Medical: active, no board actions
- Associations: membership current
- Document expirations flagged 60 days in advance

Adverse findings trigger automatic suspension of active listings and notification to the expert.

### Step 4 — Practice attestations

Experts attest to:

- Jurisdictions of active practice (not just license-holding)
- Practice areas of demonstrated competence
- Professional liability insurance policy number and expiration (required for legal/clinical verticals)
- No pending disciplinary actions
- Compliance with professional code of ethics
- Accuracy of bio and claimed experience

Attestations are re-confirmed annually.

### Step 5 — Tier assignment

- **Emerging:** Basic verification complete; probationary listing
- **Certified:** 6+ months active + 25+ completions with 4.3+ rating + peer review of at least one playbook
- **Anchor:** Negotiated; requires recognition (e.g., published author, major firm partner, board-certified specialist, academic appointment, etc.) and platform strategic fit

Demotion is possible based on performance, complaints, or loss of underlying credential.

---

## Content Quality Assurance

### Automated lint (pre-submission)

Every playbook draft is scanned for:

- Required disclaimers (per vertical and jurisdiction)
- Prohibited phrases ("you should do X" for legal content; "diagnose" for clinical)
- PII markers (SSN patterns, credit card numbers)
- Unverifiable citations (claims to statutes/cases that don't exist)
- Inflammatory or inappropriate language
- Missing jurisdictional scope
- Missing outcome statement

Draft cannot be submitted until lint passes.

### Peer review (pre-publication)

For most playbooks:

- Required for: legal playbooks, clinical playbooks, high-stakes practice areas (immigration, child welfare, criminal)
- Optional but encouraged for: business, civic, education, speaking
- Reviewer: another Certified or Anchor expert in the same vertical
- Reviewer selected by author or auto-matched by platform

Peer reviewer:

- Executes the playbook end-to-end as a test user
- Evaluates: accuracy, jurisdiction-correctness, scope, disclaimer adequacy, quality of AI prompts, artifact correctness
- Submits `approve`, `approve_with_revisions`, or `reject`
- Provides written feedback

### Staff review (pre-publication)

For sensitive verticals or flagged content:

- Legal review for UPL risk (unauthorized practice of law)
- Clinical review for safety (e.g., eating disorder playbooks — explicitly not supported in v1)
- Ethics review for vulnerable populations
- Accessibility review

### Publication decision

Playbook publishes only when:

- Lint passes
- Required peer review(s) approved
- Staff review passed (if required)
- Expert has accepted current Expert Content Agreement
- Jurisdictions and practice areas match expert's credentials

---

## Prohibited Content

The following content categories are **not permitted** on A2X:

- **Unauthorized practice of law:** Playbooks that provide legal advice specific to an individual case without attorney representation are framed as educational only. Hard limit: anything functioning as "legal advice" from a non-attorney.
- **Unauthorized practice of medicine:** Diagnostic or treatment-directive content without physician oversight.
- **Content harmful to minors:** No playbook sexualizes, grooms, or facilitates harm to minors.
- **Eating disorder facilitation:** Explicitly excluded in v1.
- **Self-harm or suicide methods:** Explicitly excluded.
- **Weapons of mass destruction:** Explicitly excluded.
- **Illegal activity facilitation:** Drug manufacture, fraud, evasion of lawful authority, etc.
- **Discrimination:** Playbooks structured to enable illegal discrimination.
- **Deceptive content:** Playbooks whose stated purpose masks an actual manipulative goal.

Content flagged as prohibited triggers immediate takedown and Ethics Board review of the expert.

---

## Sensitive-Population Protections

### Minors

- No A2X account permitted under 18 (account terms)
- If a playbook execution reveals the user is a minor, session is paused and resources provided
- Playbooks involving minors (co-parenting, education, child safety) must be child-centered:
  - Decisions and recommendations framed around child's wellbeing
  - No content that could enable grooming or isolation
  - No content that sexualizes minors in any way
  - Adult users coached to support trusted-adult relationships in the child's life

### Trauma survivors

- Content is trauma-informed where applicable:
  - Avoid triggering detail in prompts
  - Offer pause/resume frequently
  - Surface crisis resources when indicated
  - Do not pressure disclosure of trauma details
- Specific protections in domestic violence, abuse, and trafficking contexts:
  - No public "shared session" option by default
  - Warnings before session recording
  - Clear path to exit and clear session history

### Mental health crisis

- Automated detection of crisis language in session inputs
- Immediate interrupt with crisis resources (988 in US, appropriate regional lines)
- Non-judgmental, calm, brief messaging
- Session paused until user confirms they are safe; option to connect to human support deferred until staffed (Phase 2+)
- Never reflective listening in a way that amplifies negative emotions; never provide methods of self-harm under any framing

### Intimate partner violence

- Safety-planning playbooks reviewed by DV specialists
- "Quick exit" button on all IPV-related pages
- No session sharing that could alert an abuser
- Reduced session footprint (minimized browser history, incognito recommendations)
- Legal disclaimers in appropriate form (safety before forms)

---

## Reporting & Moderation

### User reports

Users can report:

- Inappropriate playbook content → routed to content review
- Expert misconduct → routed to platform admin + Ethics Board
- Platform bug or abuse → routed to support
- Crisis concerns about another user → routed to safety team

Reports acknowledged within 24 hours. Triage within 72 hours.

### Expert reports

Experts can report:

- Peer review concerns
- Platform policy questions
- Suspected fraud or scraping

### Enforcement actions

| Action | Trigger examples | Due process |
|---|---|---|
| **Warning** | Minor policy violation | Written notice, acknowledge receipt |
| **Playbook takedown** | Content violates policy | Notice with reason; appeal available |
| **Listing suspension** | Pattern of issues | Notice; appeal; remediation plan possible |
| **Account suspension** | Serious misconduct | Notice; Ethics Board review |
| **Permanent ban** | Egregious misconduct or repeated violation | Ethics Board decision; final |

### Appeals

- Takedowns and suspensions appealable within 30 days
- Appeals reviewed by a decision-maker not involved in original action
- Ethics Board has final authority on contested cases
- All appeals logged for pattern analysis

---

## Review Integrity

### Review authenticity

- Reviews submitted only by users who completed the session
- One review per user per playbook per version
- Reviews editable within 30 days of submission
- Suspicious patterns (rapid bursts, geolocation anomalies, employer-correlated reviewer networks) flagged

### Anti-gaming measures

- Experts cannot review their own playbooks
- Referral-based reviews weighted lower in ranking
- Reviews from verified completions weighted higher
- Review history public on expert profile

### Removal criteria

Reviews removed only for:

- Violating content policy (harassment, PII disclosure, etc.)
- Not a verified completion
- Demonstrably false (e.g., review references a playbook the reviewer never touched)

Reviews are **not** removed for:

- Expressing disagreement with the expert
- Negative but accurate feedback
- Criticism of the platform (except harassment/defamation)

---

## Ethics Board Involvement

The Ethics Board (see [`../../GOVERNANCE.md`](../../GOVERNANCE.md)) is engaged for:

- Expert deplatforming decisions
- Content takedowns that may implicate expert rights
- New verticals or practice areas with sensitive dimensions
- Policy changes affecting vulnerable populations
- Major incidents involving user harm

Ethics Board decisions are logged publicly (redacted where necessary).

---

## Transparency Reports

Published annually (starting Phase 2):

- Expert applications: received, approved, rejected, average time
- Content submissions: received, approved, rejected, appeals
- Takedowns: by category, by vertical, with anonymized case summaries
- Data requests from law enforcement: received, complied, challenged
- Security incidents: summary of any user-impacting events

Not included:
- Individual user or expert names
- Specific dollar amounts that would reveal commercial confidences
- Information that would compromise investigations in progress

---

## Child-Centered & Trauma-Informed Commitments (Platform-Wide)

A2X commits to these standards across all verticals:

1. When a conflict arises between an adult user's stated goal and the welfare of a child involved, the child's welfare is prioritized in playbook design, outputs, and disclaimers.
2. Content does not frame trauma responses as character flaws or manipulation.
3. No content encourages isolation of children from trusted adults or vice versa.
4. Crisis resources are surfaced automatically when distress signals are detected.
5. Session data involving minors or trauma survivors has the most restrictive retention and access defaults.
6. Advertising and promotional content does not weaponize fear or hopelessness.

---

## Related Documents

- [`../../GOVERNANCE.md`](../../GOVERNANCE.md)
- [`privacy-data.md`](privacy-data.md)
- [`liability-framework.md`](liability-framework.md)
- [`jurisdiction-taxonomy.md`](jurisdiction-taxonomy.md)
