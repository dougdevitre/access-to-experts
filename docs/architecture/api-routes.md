# API Routes

REST and MCP API surface for Access To Experts. See [`data-model.md`](data-model.md) for entities referenced.

---

## Conventions

- Base URL: `https://api.access-to-experts.com/v1`
- Auth: Bearer token (JWT) for user contexts; API key for machine contexts
- Content type: `application/json`
- Error format: RFC 7807 Problem Details
- Rate limits: returned in `RateLimit-*` headers (per RFC)
- Idempotency: `Idempotency-Key` header supported on `POST` mutations
- Pagination: cursor-based via `?cursor=` and `?limit=`
- Filtering: `?filter[field]=value`
- Sorting: `?sort=field` or `?sort=-field`

---

## Authentication

```
POST   /v1/auth/register                 Create user account
POST   /v1/auth/login                    Email/password login → JWT + refresh
POST   /v1/auth/oauth/callback           OAuth provider callback
POST   /v1/auth/refresh                  Refresh JWT
POST   /v1/auth/logout                   Revoke refresh token
POST   /v1/auth/password-reset/request   Initiate password reset
POST   /v1/auth/password-reset/confirm   Confirm with token
POST   /v1/auth/mfa/setup                Enroll MFA (TOTP)
POST   /v1/auth/mfa/verify               Verify MFA challenge
GET    /v1/auth/me                       Current user profile
PATCH  /v1/auth/me                       Update profile
DELETE /v1/auth/me                       Delete account (soft)
```

---

## Discovery

Public (no auth required for browse; auth required for execution).

```
GET    /v1/playbooks
       Query: ?vertical=&practice_area=&jurisdiction=&expert=&q=&sort=&cursor=
       Returns: paginated list of playbook summaries

GET    /v1/playbooks/:id
       Returns: full playbook metadata + public steps preview

GET    /v1/playbooks/:id/preview
       Returns: first N free preview steps

GET    /v1/playbooks/:id/reviews
       Query: ?cursor=&limit=
       Returns: user reviews for playbook

GET    /v1/experts
       Query: ?vertical=&practice_area=&jurisdiction=&tier=&q=&sort=&cursor=
       Returns: paginated expert profiles

GET    /v1/experts/:id
       Returns: expert profile (public fields)

GET    /v1/experts/:id/playbooks
       Returns: expert's published playbooks

GET    /v1/verticals
       Returns: list of verticals with counts

GET    /v1/practice-areas
       Query: ?vertical=
       Returns: practice areas within vertical

GET    /v1/jurisdictions
       Query: ?parent=&level=
       Returns: jurisdiction tree
```

---

## Sessions (authenticated)

```
POST   /v1/sessions
       Body: { playbook_id, playbook_version_id (optional — pins to latest if omitted) }
       Returns: Session object (status: 'active', current_step_id: first step)
       Consumes: session_start credits (5–15)

GET    /v1/sessions
       Query: ?status=&cursor=
       Returns: user's sessions

GET    /v1/sessions/:id
       Returns: full session state

POST   /v1/sessions/:id/steps/:stepId
       Body: { inputs: { input_key: value, ... }, idempotency_key }
       Headers: Idempotency-Key
       Returns: StepExecution result + next_step_id + generated artifacts
       Consumes: step credits + AI credits + artifact credits

POST   /v1/sessions/:id/pause
       Returns: Session with status='paused'

POST   /v1/sessions/:id/resume
       Returns: Session with status='active'

POST   /v1/sessions/:id/abandon
       Returns: Session with status='abandoned' (no refund)

POST   /v1/sessions/:id/fork
       Returns: new Session forked from this one

POST   /v1/sessions/:id/share
       Body: { visibility: 'shared_link' | 'org_shared', expires_at? }
       Returns: { share_url, share_token, expires_at }

DELETE /v1/sessions/:id/share
       Revoke share token

GET    /v1/sessions/:id/artifacts
       Returns: list of artifacts for this session

GET    /v1/artifacts/:id
       Returns: artifact metadata

GET    /v1/artifacts/:id/download
       Returns: 302 redirect to S3 signed URL

POST   /v1/sessions/:id/complete
       Body: { outcome_self_report, outcome_rating? }
       Returns: Session with status='completed'

POST   /v1/sessions/:id/review
       Body: { rating, outcome, content }
       Returns: Review object
```

### Shared session access (no auth required with valid token)

```
GET    /v1/shared/sessions/:share_token
       Returns: read-only session view
```

---

## Credits & Billing

```
GET    /v1/credits/balance
       Returns: { balance, allotment_this_period, next_reset_at }

GET    /v1/credits/ledger
       Query: ?cursor=&limit=
       Returns: paginated ledger entries

POST   /v1/credits/purchase
       Body: { credit_pack_id }
       Returns: Stripe checkout session URL

POST   /v1/billing/subscribe
       Body: { tier, payment_method_id? }
       Returns: Subscription + Stripe checkout URL

GET    /v1/billing/subscription
       Returns: current subscription

POST   /v1/billing/subscription/change
       Body: { new_tier }
       Returns: updated Subscription

POST   /v1/billing/subscription/cancel
       Body: { at_period_end: true | false }
       Returns: Subscription

GET    /v1/billing/invoices
       Returns: list of invoices

GET    /v1/billing/invoices/:id
       Returns: invoice detail

POST   /v1/billing/portal
       Returns: Stripe customer portal URL
```

---

## Expert Authoring

```
POST   /v1/experts/apply
       Body: { name, credentials, jurisdictions, practice_areas, ... }
       Returns: Expert (status='applied')

GET    /v1/experts/me
       Returns: my expert profile

PATCH  /v1/experts/me
       Body: partial expert fields
       Returns: updated Expert

POST   /v1/experts/me/credentials
       Body: { credential_type, issuing_authority, credential_number, jurisdiction, evidence }
       Returns: ExpertCredential (status='pending')

GET    /v1/experts/me/credentials
       Returns: my credentials

POST   /v1/experts/me/playbooks
       Body: { slug, title, vertical_id, practice_area_ids, jurisdictions, ... }
       Returns: Playbook (status='draft')

GET    /v1/experts/me/playbooks
       Returns: my playbooks

PUT    /v1/experts/me/playbooks/:id
       Body: full playbook update
       Returns: Playbook (draft)

POST   /v1/experts/me/playbooks/:id/versions
       Body: { content, changelog, version_number }
       Returns: PlaybookVersion (status='pending')

POST   /v1/experts/me/playbooks/:id/submit
       Submit current draft version for review
       Returns: PlaybookVersion (status='in_review')

POST   /v1/experts/me/playbooks/:id/test-run
       Body: { inputs_by_step }
       Returns: simulated session (no credits deducted, author-only)

GET    /v1/experts/me/analytics
       Query: ?playbook_id=&from=&to=
       Returns: { completions, revenue, ratings, outcomes, ... }

GET    /v1/experts/me/earnings
       Query: ?from=&to=
       Returns: earnings summary + payout history

POST   /v1/experts/me/playbooks/:id/peer-review-requests
       Body: { reviewer_expert_ids[] }
       Returns: request records
```

---

## Peer Review (expert-to-expert)

```
GET    /v1/peer-reviews/pending
       Returns: peer review requests awaiting my review

POST   /v1/peer-reviews/:id
       Body: { decision, review_content, specific_concerns }
       Returns: ExpertReview
```

---

## Enterprise / Organization

```
POST   /v1/orgs
       Body: { name, tier, seat_limit, data_residency }
       Platform admin only; orgs are normally provisioned out-of-band.

GET    /v1/orgs/:id
       Returns: Organization

PATCH  /v1/orgs/:id
       Body: partial org fields
       Org admin only

GET    /v1/orgs/:id/members
       Returns: org memberships

POST   /v1/orgs/:id/members
       Body: { email, role }
       Sends invite; returns pending OrgMembership

DELETE /v1/orgs/:id/members/:member_id
       Remove member

POST   /v1/orgs/:id/library
       Body: { playbook_ids[] }
       Curate org library (pinned playbooks for org members)

GET    /v1/orgs/:id/library
       Returns: curated playbooks

GET    /v1/orgs/:id/usage
       Query: ?from=&to=
       Returns: seat usage, credit consumption, top playbooks

GET    /v1/orgs/:id/outcomes
       Returns: aggregate outcome data (anonymized)

GET    /v1/orgs/:id/sso/config
       Returns: SSO config (admin only)

PUT    /v1/orgs/:id/sso/config
       Body: SAML/OIDC config
```

---

## Platform Administration

All `/admin` routes require `platform_admin` role.

```
GET    /v1/admin/experts/pending
POST   /v1/admin/experts/:id/approve
POST   /v1/admin/experts/:id/reject
POST   /v1/admin/experts/:id/suspend

GET    /v1/admin/playbooks/pending
POST   /v1/admin/playbooks/:id/approve
POST   /v1/admin/playbooks/:id/reject
POST   /v1/admin/playbooks/:id/takedown

GET    /v1/admin/sessions/flagged
POST   /v1/admin/sessions/:id/refund

GET    /v1/admin/users/:id
POST   /v1/admin/users/:id/suspend

GET    /v1/admin/audit-log
       Query: ?actor=&action=&from=&to=&cursor=

GET    /v1/admin/metrics
       Returns: platform-wide metrics
```

---

## Webhooks

### Outbound (A2X → partners)

Enterprises and partners can register webhooks for event notifications.

```
POST   /v1/webhooks
       Body: { url, events[], secret }

GET    /v1/webhooks
DELETE /v1/webhooks/:id
```

Event types include:
- `session.created`
- `session.completed`
- `artifact.generated`
- `expert.published_playbook`
- `subscription.updated`
- `credit.low_balance`

Webhooks sent as `POST` with `X-A2X-Signature` header (HMAC-SHA256 of payload with shared secret).

### Inbound

```
POST   /v1/webhooks/stripe           Stripe events
POST   /v1/webhooks/persona          Persona identity verification events
POST   /v1/webhooks/jumio            Jumio identity verification events
```

---

## MCP Surface

A2X exposes an MCP server at `https://mcp.access-to-experts.com` for Claude and MCP-compatible clients.

### Tools

```
a2x_search_playbooks
  Inputs: { query, vertical?, practice_area?, jurisdiction?, limit? }
  Returns: playbook summaries matching filters

a2x_get_playbook
  Inputs: { playbook_id }
  Returns: playbook detail including preview steps

a2x_start_session
  Inputs: { playbook_id, playbook_version_id? }
  Returns: session_id, current_step_id, initial_prompt

a2x_execute_step
  Inputs: { session_id, step_id, inputs }
  Returns: ai_response, generated_artifacts, next_step_id, credits_remaining

a2x_get_session_state
  Inputs: { session_id }
  Returns: full session state

a2x_list_sessions
  Inputs: { status?, limit? }
  Returns: user's sessions

a2x_generate_artifact
  Inputs: { session_id, step_id, artifact_key }
  Returns: artifact metadata + download URL

a2x_get_credit_balance
  Inputs: {}
  Returns: { balance, allotment_this_period, next_reset_at }

a2x_get_expert
  Inputs: { expert_id }
  Returns: expert profile

a2x_submit_review
  Inputs: { session_id, rating, outcome, content? }
  Returns: review record
```

### Auth

MCP clients authenticate via OAuth 2.1 authorization code flow with the A2X MCP server, scoping to the user's account.

---

## Error Responses (RFC 7807)

```json
{
  "type": "https://access-to-experts.com/errors/insufficient-credits",
  "title": "Insufficient Credits",
  "status": 402,
  "detail": "This step requires 15 credits but your balance is 8.",
  "instance": "/v1/sessions/abc/steps/intro",
  "required_credits": 15,
  "balance": 8,
  "credit_purchase_url": "/v1/credits/purchase"
}
```

Common error types:

| Status | Type | Description |
|---|---|---|
| 400 | `/errors/invalid-input` | Validation failed |
| 401 | `/errors/unauthenticated` | Missing or invalid auth |
| 403 | `/errors/forbidden` | Authenticated but not authorized |
| 403 | `/errors/jurisdiction-mismatch` | Playbook outside user's jurisdiction |
| 403 | `/errors/credential-required` | Expert credential required for this action |
| 402 | `/errors/insufficient-credits` | Not enough credits for operation |
| 404 | `/errors/not-found` | Resource missing |
| 409 | `/errors/conflict` | Idempotency or state conflict |
| 410 | `/errors/playbook-deprecated` | Playbook no longer published |
| 422 | `/errors/unprocessable` | Semantically invalid request |
| 429 | `/errors/rate-limit` | Too many requests |
| 500 | `/errors/internal` | Server error |
| 503 | `/errors/upstream-unavailable` | AI provider unavailable |

---

## Rate Limits

| Endpoint class | Authenticated | Unauthenticated |
|---|---|---|
| Discovery (GET) | 120 req/min | 60 req/min |
| Session start (POST) | 20 req/min | N/A |
| Step execution (POST) | 60 req/min | N/A |
| Expert authoring | 30 req/min | N/A |
| Admin | 600 req/min | N/A |

Enterprise contracts may negotiate higher limits.

---

## OpenAPI

The OpenAPI 3.1 spec is published at `/v1/openapi.json` once API implementation begins. Partner SDKs will be generated from this spec (TypeScript, Python, Go).
