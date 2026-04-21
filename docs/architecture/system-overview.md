# System Overview

Architectural overview of Access To Experts. See sibling documents for deeper detail on data model, APIs, playbook engine, credit system, and security.

---

## High-Level Architecture

```
                    ┌─────────────────────────────────┐
                    │          Web Client              │
                    │    (React/Vite, responsive)      │
                    │                                  │
                    │  Guide  │  Marketplace │ Workspace│
                    └─────────────┬────────────────────┘
                                  │
                                  │ HTTPS / REST + WS
                                  │
                    ┌─────────────▼────────────────────┐
                    │      API Gateway (AWS)           │
                    │  Auth, rate limit, WAF, routing  │
                    └─────────────┬────────────────────┘
                                  │
          ┌───────────────────────┼────────────────────────┐
          │                       │                        │
          ▼                       ▼                        ▼
    ┌──────────┐           ┌──────────┐            ┌──────────┐
    │ API      │           │ Playbook │            │ Billing  │
    │ Service  │◄─────────►│ Engine   │            │ Service  │
    │ (Node)   │           │ (Node)   │            │ (Stripe) │
    └────┬─────┘           └────┬─────┘            └────┬─────┘
         │                      │                       │
         │                      │                       │
    ┌────▼──────────────────────▼───────────────────────▼────┐
    │                    Data Layer                            │
    │                                                          │
    │   DynamoDB        S3            RDS (Postgres)    KMS    │
    │   (sessions,     (artifacts,    (auth, orgs,             │
    │    ledger)        playbooks)     analytics)              │
    └──────────────────────────────────────────────────────────┘
                                │
                                │
                    ┌───────────▼────────────┐
                    │  External Services      │
                    │                         │
                    │  Claude API (AI)        │
                    │  Stripe (payments)      │
                    │  Persona/Jumio (ID)     │
                    │  SES (email)            │
                    │  Sentry (errors)        │
                    └─────────────────────────┘
```

## Three-Pane Interface

A2X's core UX pattern is a three-pane interface inspired by TripAdvisor's discovery → comparison → action flow:

### Left Pane — Guide

- AI assistant (Claude-powered) that helps the user scope their need
- Natural language intake
- Filters: jurisdiction, practice area, budget (credit range), complexity, time
- Suggestion engine routes to relevant playbooks
- Persistent across navigation

### Center Pane — Marketplace

- Playbook cards with expert credentials, ratings, completion stats, credit cost, preview
- Infinite scroll with ranking-driven order
- Detail view on card tap/click
- Filter/sort controls
- Expert profile drill-down

### Right Pane — Workspace

- Active session: current step, inputs, generated artifacts, progress bar
- Saved sessions: list of paused, completed, shared sessions
- Artifacts: generated files with download and share controls
- Chat log: persistent conversation history for the active session

On mobile, panes collapse into stacked views with quick-swipe navigation.

## Component Services

### Web Client (`apps/web/`)

- React 18 + Vite + TypeScript
- Tailwind CSS with design system tokens
- Zustand or Redux Toolkit for state management
- React Query for server state
- Socket.io client for real-time session updates
- Accessibility: WCAG 2.2 AA baseline

### API Service (`apps/api/`)

- Node 20 + Express + TypeScript
- JWT authentication (AWS Cognito or Auth0 in v1)
- OpenAPI spec published for partner integrations
- Rate limiting per user and per org
- Idempotency keys on mutating endpoints
- Structured logging via pino

### Playbook Engine (`packages/playbook-engine/`)

- Core library, not a standalone service
- Pure functions with explicit state
- Parses Playbook JSON → runtime state machine
- Evaluates branching logic
- Computes credit cost per step
- Orchestrates AI calls (Claude) with prompt scaffolding
- Generates artifact templates
- See [`playbook-engine.md`](playbook-engine.md) for detail

### Billing Service

- Stripe integration (subscriptions + one-time purchases)
- Webhook handling for payment events
- Credit ledger write coordination
- Invoice generation for enterprise
- Refund handling

### AI Layer

- Claude API primary (model choice per task: Opus for complex reasoning, Sonnet for standard, Haiku for lightweight)
- Structured prompt templates stored with playbook content
- Context injection: playbook step + session inputs + user profile (consented attributes only)
- Output validation against expected artifact schema
- Cost tracking per call (for credit accounting)
- Guardrails to constrain responses to playbook scope

## Data Stores

### DynamoDB

- Sessions
- StepExecutions
- Credit ledger entries (append-only)
- Rate limit counters

### RDS (Postgres)

- Users, Experts, Organizations
- Playbook metadata (with JSONB for flexible fields)
- Reviews and peer reviews
- Credential records
- Analytics aggregates

### S3

- Playbook content (JSON + assets) — versioned bucket
- Generated artifacts (PDF, DOCX)
- Session exports
- Backup snapshots

### Cache

- Redis (AWS ElastiCache) for session state, rate limits, and hot playbook content

### KMS

- Customer-managed keys for enterprise tenants (future)
- Encryption of PII fields at rest
- Encryption of session state

## Security Model

See [`security.md`](security.md) for full detail.

- TLS 1.2+ everywhere
- JWT with short expiry + refresh token rotation
- Resource-level authorization
- Least-privilege IAM for all service roles
- Secrets via AWS SSM SecureString only
- Audit log to CloudWatch with 1-year retention
- WAF on API Gateway
- Encryption at rest via KMS

## Observability

- **Logs:** CloudWatch + structured JSON
- **Metrics:** CloudWatch + custom metrics per service
- **Traces:** AWS X-Ray (optional Datadog or Honeycomb in Phase 2+)
- **Errors:** Sentry for client + server
- **Uptime:** Synthetic monitoring on core flows
- **Alerting:** PagerDuty or Opsgenie for on-call

## Deployment

- Infrastructure as Code: Terraform or AWS CDK
- Multi-account AWS organization: dev, staging, prod, security, backup
- Environments mirror production except scale
- Blue/green deployment for API
- Database migrations via flyway or prisma migrate
- Feature flags via LaunchDarkly or self-hosted (e.g., Flagsmith)

## Scalability Posture (Phase 1)

- API service: auto-scaling ECS Fargate or Lambda
- Playbook engine: invoked inline (no queue in v1)
- Session persistence: DynamoDB auto-scaling
- Target: 1,000 concurrent sessions, 10,000 MAU

## Scalability Posture (Phase 3+)

- Event-driven architecture for high-volume flows
- SQS/SNS or EventBridge for async coordination
- Read replicas for Postgres
- Multi-region active-passive with failover
- Target: 100,000 concurrent sessions, 500,000 MAU

## Disaster Recovery

- RTO target: 4 hours
- RPO target: 15 minutes
- Cross-region backup (DynamoDB PITR, RDS automated backups to secondary region, S3 cross-region replication)
- Runbook tested quarterly

## MCP Surface

A2X exposes an MCP server for direct integration with Claude and MCP-compatible clients. See [`api-routes.md`](api-routes.md) for the MCP tool list.

This enables:

- Claude.ai users to access A2X playbooks directly
- CoTrackPro and other A2X ecosystem tools to invoke playbooks as sub-workflows
- Enterprise partners to embed playbook execution in their own AI products

## Future Architecture Considerations

- **Event sourcing** for session state (considered for Phase 3)
- **GraphQL API** layer for complex read patterns (considered for Phase 3)
- **Edge compute** for marketing pages and free content (Phase 2+)
- **Dedicated tenant deployments** for top-tier enterprise customers (Phase 3+)
- **AI model diversity** — routing across Claude, OpenAI, and domain-specific models (Phase 2+)

---

## Related Documents

- [`data-model.md`](data-model.md)
- [`api-routes.md`](api-routes.md)
- [`playbook-engine.md`](playbook-engine.md)
- [`credit-system.md`](credit-system.md)
- [`security.md`](security.md)
