# Data Model

Core entities, relationships, and lifecycle for Access To Experts. See [`../../schemas/`](../../schemas/) for canonical JSON Schema definitions.

---

## Entity List

| Entity | Purpose | Primary Store |
|---|---|---|
| `User` | Authenticated person (seeker, expert, or staff) | Postgres |
| `Organization` | Enterprise tenant | Postgres |
| `OrgMembership` | User's role in an org | Postgres |
| `Expert` | Expert profile (extends User) | Postgres |
| `ExpertCredential` | Verified credential record | Postgres |
| `Playbook` | Logical playbook (may have many versions) | Postgres + S3 |
| `PlaybookVersion` | Immutable playbook version | S3 (content) + Postgres (metadata) |
| `Step` | Atomic unit within a PlaybookVersion | Embedded in PlaybookVersion |
| `Session` | User's execution of a PlaybookVersion | DynamoDB |
| `StepExecution` | One step run within a session | DynamoDB |
| `Artifact` | Generated output from a session | S3 + DynamoDB metadata |
| `CreditLedgerEntry` | Immutable credit transaction | DynamoDB |
| `Review` | User review of a playbook | Postgres |
| `ExpertReview` | Peer review of a playbook | Postgres |
| `JurisdictionTag` | Country/state/region scope | Postgres (reference data) |
| `PracticeArea` | Domain taxonomy | Postgres (reference data) |
| `Vertical` | Top-level domain | Postgres (reference data) |
| `Subscription` | Active subscription state | Postgres (mirrored from Stripe) |
| `AuditLogEntry` | Security-relevant event | CloudWatch + S3 archive |

---

## Entity Definitions

### User

```
User {
  id: UUID
  email: string (unique, encrypted at rest)
  display_name: string
  role: enum [ 'seeker', 'expert', 'org_admin', 'platform_admin' ]
  auth_provider: enum [ 'email', 'google', 'saml' ]
  email_verified: boolean
  mfa_enabled: boolean
  locale: string (BCP 47, e.g., 'en-US')
  timezone: string (IANA, e.g., 'America/Chicago')
  consent_flags: { marketing: boolean, research: boolean, ... }
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp | null (soft delete for data subject rights)
}
```

### Organization

```
Organization {
  id: UUID
  name: string
  slug: string (unique)
  tier: enum [ 'pilot', 'corporate', 'government', 'white_label' ]
  seat_limit: integer
  data_residency: enum [ 'us', 'eu', 'ca', 'au' ]
  sso_config: JSON | null
  branding: { logo_url, primary_color, domain } | null
  contract_starts_at: timestamp
  contract_ends_at: timestamp
  created_at: timestamp
}
```

### OrgMembership

```
OrgMembership {
  id: UUID
  user_id: UUID
  org_id: UUID
  role: enum [ 'member', 'admin', 'billing_admin' ]
  status: enum [ 'active', 'invited', 'suspended' ]
  created_at: timestamp
}
```

### Expert

```
Expert {
  id: UUID
  user_id: UUID (1:1 with User)
  tier: enum [ 'anchor', 'certified', 'emerging' ]
  status: enum [ 'applied', 'under_review', 'active', 'suspended', 'retired' ]
  professional_name: string
  bio: string
  headshot_url: string
  linkedin_url: string | null
  website_url: string | null
  jurisdictions: JurisdictionTag[] (licensed in)
  practice_areas: PracticeArea[]
  insurance_policy_expires_at: timestamp | null
  revenue_share_override: decimal | null (default 0.70)
  verified_at: timestamp | null
  created_at: timestamp
}
```

### ExpertCredential

```
ExpertCredential {
  id: UUID
  expert_id: UUID
  credential_type: enum [ 'bar_license', 'medical_license', 'board_certification',
                         'professional_membership', 'degree', 'other' ]
  issuing_authority: string (e.g., 'Missouri Bar', 'FSMB', 'APA')
  credential_number: string (encrypted)
  jurisdiction: JurisdictionTag
  verified_at: timestamp | null
  verification_method: enum [ 'api_lookup', 'manual', 'document_upload' ]
  verification_evidence_url: string (S3 reference) | null
  status: enum [ 'verified', 'pending', 'expired', 'revoked' ]
  expires_at: timestamp | null
  last_checked_at: timestamp
  created_at: timestamp
}
```

### Playbook

```
Playbook {
  id: UUID
  expert_id: UUID (author; co-authors tracked separately)
  co_author_expert_ids: UUID[]
  current_version_id: UUID (points to active PlaybookVersion)
  slug: string (unique per expert)
  vertical_id: UUID
  practice_area_ids: UUID[]
  jurisdiction_tag_ids: UUID[] (scope)
  title: string
  subtitle: string
  description: string (markdown)
  outcome_statement: string  // "By the end of this playbook you will have..."
  credit_cost_estimate: { min: integer, max: integer }
  estimated_duration_minutes: integer
  status: enum [ 'draft', 'in_review', 'published', 'unlisted', 'deprecated' ]
  published_at: timestamp | null
  created_at: timestamp
  updated_at: timestamp
}
```

### PlaybookVersion

```
PlaybookVersion {
  id: UUID
  playbook_id: UUID
  version_number: string (semver-like, e.g., '1.2.0')
  content_s3_uri: string
  content_hash: string (for integrity)
  changelog: string (markdown)
  review_status: enum [ 'pending', 'approved', 'rejected' ]
  reviewed_by_expert_id: UUID | null
  reviewed_at: timestamp | null
  steps: Step[] (embedded; also stored in content_s3_uri)
  disclaimers: string[] (auto-injected for legal/clinical)
  required_inputs: InputSpec[]
  expected_artifacts: ArtifactSpec[]
  created_at: timestamp
  published_at: timestamp | null
}
```

### Step (embedded in PlaybookVersion content)

```
Step {
  id: string (stable within playbook)
  order: integer
  title: string
  instruction: string (markdown; shown to user)
  ai_prompt_template: string (system prompt for AI execution)
  inputs: InputSpec[]
  branch_conditions: BranchCondition[] | null
  artifact_generation: ArtifactSpec | null
  credit_cost: integer (base cost for step)
  estimated_seconds: integer
}

InputSpec {
  key: string
  type: enum [ 'short_text', 'long_text', 'number', 'date', 'boolean',
               'select', 'multiselect', 'file_upload', 'jurisdiction' ]
  label: string
  required: boolean
  validation: { regex, min, max, options } | null
  placeholder: string | null
  help_text: string | null
}

BranchCondition {
  when: { input_key: string, op: string, value: any }
  goto_step_id: string
}

ArtifactSpec {
  key: string
  type: enum [ 'docx', 'pdf', 'markdown', 'json', 'html' ]
  template_s3_uri: string
  title_template: string
}
```

### Session

```
Session {
  id: UUID
  user_id: UUID
  org_id: UUID | null
  playbook_id: UUID
  playbook_version_id: UUID (pinned)
  status: enum [ 'active', 'paused', 'completed', 'abandoned', 'refunded' ]
  current_step_id: string | null
  inputs: { [step_id]: { [input_key]: value, timestamp, edited_count } }
  step_path: string[] (ordered list of visited step_ids)
  credits_consumed: integer
  credits_reserved: integer
  visibility: enum [ 'private', 'shared_link', 'org_shared' ]
  share_token: string | null (opaque)
  forked_from_session_id: UUID | null
  started_at: timestamp
  last_activity_at: timestamp
  completed_at: timestamp | null
  outcome_self_report: enum [ 'successful', 'partial', 'unsuccessful', 'unknown' ] | null
  outcome_rating: integer (1-5) | null
  deleted_at: timestamp | null
}
```

### StepExecution

```
StepExecution {
  id: UUID
  session_id: UUID
  step_id: string
  step_version: string (from playbook version)
  inputs: JSON
  ai_prompt: string (resolved, final)
  ai_response: string (raw)
  ai_model: string (e.g., 'claude-opus-4-7')
  ai_latency_ms: integer
  ai_cost_usd: decimal
  ai_tokens_in: integer
  ai_tokens_out: integer
  credits_deducted: integer
  artifact_ids: UUID[] (created by this step)
  status: enum [ 'pending', 'running', 'completed', 'failed', 'rolled_back' ]
  error: string | null
  started_at: timestamp
  completed_at: timestamp | null
  idempotency_key: string (for retry safety)
}
```

### Artifact

```
Artifact {
  id: UUID
  session_id: UUID
  step_execution_id: UUID
  user_id: UUID
  artifact_type: enum [ 'docx', 'pdf', 'markdown', 'json', 'html' ]
  title: string
  s3_uri: string
  size_bytes: integer
  content_hash: string
  generated_from_template_version: string
  redacted: boolean
  expires_at: timestamp | null (based on retention policy)
  created_at: timestamp
}
```

### CreditLedgerEntry

```
CreditLedgerEntry {
  id: UUID
  user_id: UUID
  org_id: UUID | null
  entry_type: enum [ 'purchase', 'subscription_grant', 'consumption',
                     'refund', 'adjustment', 'expiration', 'bonus' ]
  amount: integer (positive for credits added, negative for credits consumed)
  balance_after: integer
  related_session_id: UUID | null
  related_step_execution_id: UUID | null
  related_stripe_charge_id: string | null
  description: string
  created_at: timestamp (immutable append-only)
}
```

### Review

```
Review {
  id: UUID
  playbook_id: UUID
  playbook_version_id: UUID
  session_id: UUID
  user_id: UUID
  rating: integer (1-5)
  outcome: enum [ 'successful', 'partial', 'unsuccessful', 'unknown' ]
  content: string (markdown, optional)
  flagged: boolean (anti-gaming signal)
  created_at: timestamp
}
```

### ExpertReview (peer review)

```
ExpertReview {
  id: UUID
  playbook_id: UUID
  playbook_version_id: UUID
  reviewer_expert_id: UUID
  decision: enum [ 'approve', 'approve_with_revisions', 'reject' ]
  review_content: string (markdown)
  specific_concerns: JSON
  created_at: timestamp
}
```

### JurisdictionTag

```
JurisdictionTag {
  id: UUID
  code: string (e.g., 'US-MO', 'US-MO-189', 'GB', 'CA-ON')
  name: string (e.g., 'Missouri')
  parent_id: UUID | null (hierarchical)
  level: enum [ 'country', 'state_province', 'county_region', 'city' ]
  iso_3166_1: string | null (country code)
  iso_3166_2: string | null (subdivision code)
  fips_code: string | null (US counties)
  active: boolean
}
```

### PracticeArea

```
PracticeArea {
  id: UUID
  slug: string (unique)
  name: string
  vertical_id: UUID
  parent_id: UUID | null (hierarchical)
  description: string
  compliance_flags: string[] (e.g., 'UPL_RISK', 'HIPAA', 'FINRA')
  active: boolean
}
```

### Vertical

```
Vertical {
  id: UUID
  slug: string (unique)
  name: string  // Legal, Clinical, Business, Civic, Education, Specialty
  description: string
  compliance_posture: enum [ 'standard', 'elevated', 'regulated' ]
  active: boolean
  launch_phase: integer  // 1, 2, 3, 4
}
```

### Subscription

```
Subscription {
  id: UUID
  user_id: UUID | null (consumer)
  org_id: UUID | null (enterprise)
  stripe_subscription_id: string
  tier: enum [ 'explorer', 'builder', 'operator',
               'corporate', 'government', 'white_label' ]
  status: enum [ 'active', 'past_due', 'canceled', 'trialing' ]
  monthly_credit_allotment: integer
  seat_count: integer (for org)
  current_period_start: timestamp
  current_period_end: timestamp
  cancel_at_period_end: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### AuditLogEntry

```
AuditLogEntry {
  id: UUID
  actor_user_id: UUID | null
  actor_type: enum [ 'user', 'system', 'api_key', 'admin' ]
  action: string (e.g., 'playbook.published', 'expert.credential_verified',
                        'session.shared', 'credit.refunded')
  resource_type: string
  resource_id: UUID | null
  ip_address: string (hashed for privacy)
  user_agent: string | null
  metadata: JSON
  created_at: timestamp
}
```

---

## Key Relationships

```
User ─┬─< OrgMembership >─┬─ Organization
      │                   │
      ├─── Expert ───< Playbook ───< PlaybookVersion ──embeds── Step
      │               │                    │
      │               └─< ExpertCredential │
      │                                    │
      ├─< Session ──pinned─────────────────┘
      │       │
      │       ├─< StepExecution ───(1:1)─── Step (ref)
      │       ├─< Artifact
      │       └─< Review
      │
      ├─< CreditLedgerEntry
      ├─< Subscription
      └─< AuditLogEntry
```

---

## Lifecycle Diagrams

### Playbook Lifecycle

```
  Draft ──submit──> In Review ──approve──> Published ──deprecate──> Deprecated
    │                  │  │                    │
    │                  │  └─reject──> Draft    └─version──> New PlaybookVersion
    │                  │                                          │
    └──discard──> Deleted                                         └──(same flow)
```

### Session Lifecycle

```
  (user starts)
      │
      ▼
   Active ──pause──> Paused ──resume──> Active
      │
      ├──complete──> Completed
      │                 │
      │                 └──review──> Review created
      │
      ├──abandon──> Abandoned (auto after 90 days inactive)
      │
      └──refund──> Refunded (admin action)
```

### Expert Onboarding Lifecycle

```
  (apply)
      │
      ▼
   Applied ──review──> Under Review ──verify──> Active
      │                    │
      │                    └─reject──> Rejected
      │
      └──withdraw──> Withdrawn

   Active ──suspend──> Suspended ──reinstate──> Active
          └──retire──> Retired (voluntary)
```

---

## Retention & Deletion Policy

| Entity | Default Retention | Notes |
|---|---|---|
| User (soft deleted) | 30 days | Then hard delete |
| Session (completed) | 2 years (consumer), 7 years (enterprise) | Configurable per contract |
| StepExecution | Matches Session | |
| Artifact | Matches Session | Can be explicitly deleted earlier by user |
| CreditLedgerEntry | 7 years | Tax / financial requirement; immutable |
| Subscription | Indefinite | For billing audit |
| AuditLogEntry | 1 year hot, 7 years cold | Security / compliance |
| PlaybookVersion | Indefinite | Immutable; historical sessions reference |
| Review | Indefinite unless user deletes account | |
| Expert profile (retired) | 7 years post-retirement | |

Data subject rights (GDPR/CCPA) override default retention with user-initiated deletion, within legal boundaries (tax, regulatory).

---

## Privacy Classification

| Category | Fields | Handling |
|---|---|---|
| **Highly sensitive** | Credential numbers, payment methods, health info in session inputs | Encrypted at rest (KMS field-level); redacted from logs |
| **Sensitive** | Email, name, IP, session inputs | Encrypted at rest; accessed via least-privilege |
| **Confidential** | Playbook content (for experts), org data | Per-tenant access control |
| **Internal** | Aggregate metrics, anonymized usage | Internal use |
| **Public** | Playbook metadata, expert public profile | Published |

See [`../compliance/privacy-data.md`](../compliance/privacy-data.md) for privacy framework.

---

## Schema Files

Canonical JSON Schema definitions live in [`../../schemas/`](../../schemas/):

- `playbook.schema.json`
- `session.schema.json`
- `expert.schema.json`
- `credit-ledger.schema.json`
- `review.schema.json`

Example playbooks in [`../../schemas/examples/`](../../schemas/examples/).
