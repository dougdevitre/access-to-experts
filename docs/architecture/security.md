# Security Architecture

This document describes the security posture, controls, and practices for Access To Experts. It complements [`SECURITY.md`](../../SECURITY.md) (disclosure policy) and [`../compliance/privacy-data.md`](../compliance/privacy-data.md) (privacy framework).

**Posture target:** SOC 2 Type II, ISO 27001, HIPAA-ready (Phase 3), FedRAMP Moderate (Phase 4).

---

## Threat Model

**Assets to protect:**

- User PII (email, name, session inputs that may contain legal/medical facts)
- Expert credentials and license numbers
- Generated artifacts (may contain sensitive case facts)
- Session state (may reveal strategy, diagnoses, situations)
- Payment and billing data
- Platform operational data (pricing, analytics, aggregate outcomes)
- Expert content and methodologies (their IP)
- Enterprise data (customer contracts, seat usage)

**Primary threat actors:**

- External: opportunistic criminals, credential-stuffing bots, adversarial researchers
- Insider: malicious or negligent employee, contractor, or expert
- Competitive: scraping for content replication
- Adversarial legal: opposing counsel requesting user data via subpoena
- Nation-state: low likelihood, high-impact (relevant once government contracts are active)

**Threats deprioritized in v1:** sophisticated APTs, zero-days in AWS primitives, supply chain attacks beyond standard CI/CD hardening.

---

## Identity & Authentication

### User authentication

- **v1:** Email/password with bcrypt (cost 12) + Google OAuth 2.0
- **Phase 2:** Add Microsoft OAuth, optional WebAuthn/Passkeys
- **Phase 2 (enterprise):** SAML 2.0 and OIDC SSO with SCIM provisioning

### Password policy

- Minimum 12 characters
- NIST 800-63B aligned (no forced complexity rules, check against breach corpus)
- Breach check via Have I Been Pwned API or equivalent
- No forced rotation (NIST-aligned; change only on indicator of compromise)

### MFA

- TOTP (Google Authenticator, Authy) — available at launch
- WebAuthn / security keys — Phase 2
- SMS fallback only (not primary, and removable) due to SIM-swap risk
- **Required** for: all experts, all enterprise admins, all platform staff
- **Optional (strongly recommended)** for seekers

### Session management

- JWT access tokens with 15-minute TTL
- Refresh tokens with 30-day TTL, rotation on use, server-side revocation
- Device binding (best-effort; not authoritative)
- Concurrent session limit: 5 (configurable for enterprise)
- Idle timeout: 12 hours for seekers, 1 hour for experts and admins

### Account recovery

- Email-based password reset with single-use tokens (10-minute TTL)
- MFA backup codes (10 codes, single-use, printable)
- Account recovery with MFA lost: manual review, identity verification required

---

## Authorization

### Role model

| Role | Scope | Capabilities |
|---|---|---|
| `seeker` | Self | Own sessions, artifacts, reviews, subscription |
| `expert` | Self + owned playbooks | Author, submit, earn, analytics |
| `org_member` | Self within org | Sessions within org entitlement |
| `org_billing_admin` | Org billing | Billing, seats, invoices |
| `org_admin` | Entire org | Members, SSO, curated library, analytics |
| `content_reviewer` | Platform | Review pending playbooks, peer review management |
| `support` | Platform (limited PII) | User account lookup, refunds, dispute resolution |
| `platform_admin` | Platform (full) | All operations; break-glass procedure for PII access |

### Resource-level ACLs

Every resource has an owner and an access list:

- `Session` — owner user_id; read-only access via share_token
- `Playbook` — owner expert_id; published playbooks are publicly readable
- `Organization` — admins and members have role-scoped access

Authorization checks enforce both role and resource ownership/membership.

### API authorization

- Bearer token validates identity + roles
- Per-route authorization middleware enforces required role/resource access
- Rate limits applied per role (higher for enterprise)

---

## Data Protection

### Encryption in transit

- TLS 1.2+ everywhere (TLS 1.3 preferred)
- HSTS enforced (`max-age=31536000; includeSubDomains; preload`)
- No support for SSLv3, TLS 1.0/1.1
- Strong cipher suites only (no RC4, no DES, no export-grade)
- Certificate management via AWS ACM with auto-renewal
- Internal service-to-service traffic over VPC-only, encrypted

### Encryption at rest

- AWS KMS for key management with customer master keys (CMKs)
- DynamoDB tables: KMS encryption on
- RDS: KMS encryption on
- S3: SSE-KMS for sensitive buckets (playbooks, artifacts, session exports)
- EBS volumes: encrypted
- CloudWatch Logs: encryption on
- Per-tenant CMKs for top-tier enterprise (Phase 3)

### Field-level encryption

Sensitive fields additionally encrypted at application layer before storage:

- Expert credential numbers
- Session inputs flagged as sensitive (configurable per playbook)
- User MFA secrets
- OAuth refresh tokens

### Secrets management

- **Production:** AWS SSM Parameter Store (SecureString type) only
- **Development:** `.env` files (gitignored; no prod secrets ever in dev)
- **Never:** hardcoded in source, committed to repo, pasted in chat/tickets
- IAM policies restrict SSM read access to specific parameters per service role
- Secrets rotation: quarterly for API keys, on-demand for credentials on compromise

### Key separation

- Encryption keys: per-environment (dev, staging, prod)
- Stripe keys: separate test mode and live mode
- Anthropic API keys: separate per-environment, workload-scoped
- Database credentials: per-service, least-privilege

---

## Infrastructure Security

### AWS account structure

```
Root / Management Org
├── dev
├── staging
├── prod
├── security (audit logs, guardrail configs)
├── backup (cross-account backup target)
└── log-archive (immutable log storage)
```

Production resources are isolated from dev/staging by account boundary.

### Network security

- VPC per environment with private and public subnets
- Private subnets for databases, internal services
- Public subnets only for load balancers
- Security groups: least-privilege; default-deny
- NACLs: additional layer on subnet boundaries
- VPC Flow Logs enabled, sent to security account
- AWS WAF on public API Gateway with managed rule sets (OWASP CRS, known bots)
- AWS Shield Standard (default); Shield Advanced for Phase 3+
- DDoS protection via CloudFront + Shield

### IAM

- **Least privilege:** every service role scoped to minimum required permissions
- **No long-lived access keys:** IAM roles for services; IAM Identity Center (SSO) for humans
- **MFA required:** for all human access, including break-glass
- **Access review:** quarterly for human roles, annual for service roles
- **Just-in-time elevation:** via AWS Identity Center with approval workflow
- **Break-glass:** dedicated emergency role with full logging; accessible only via multi-party approval

### Compute

- Containers on ECS Fargate or Lambda
- Base images: distroless or minimal
- Image scanning via ECR vulnerability scanning + Trivy in CI
- Automatic patching for managed services
- No direct SSH to production; access via SSM Session Manager only (audit-logged)

### Database

- RDS Postgres with Multi-AZ in production
- Automated backups with 30-day retention
- Point-in-time recovery enabled
- Parameter group hardened (no public accessibility, SSL required)
- Query logs for slow queries only (no full query log due to PII risk)

### S3 bucket policies

- Default: private, no public access
- Versioning enabled on sensitive buckets (playbooks, artifacts)
- Bucket policies prevent public ACL grants
- Server access logging to security account
- Lifecycle rules per retention policy

---

## Application Security

### Input validation

- All inputs validated at API boundary against schema
- No direct SQL (Prisma or typeorm with parameterized queries)
- No `eval`, no `exec`, no dynamic code generation from user input
- File uploads: MIME type + magic byte validation, size limits, virus scan

### Output handling

- Auto-escaping in templates (React + default escaping)
- Content Security Policy with strict source lists
- Download attachments via signed S3 URLs with short TTLs, not direct inline rendering for untrusted content

### Common vulnerabilities

- **SQL injection:** Parameterized queries only
- **XSS:** Auto-escaping, CSP, no `innerHTML` with user content
- **CSRF:** Cookies use `SameSite=Strict`; CSRF tokens on state-changing endpoints (if cookie auth used); Bearer tokens not susceptible
- **SSRF:** Outbound requests allow-listed; no user-controlled URLs fetched server-side in v1 except via opt-in expert tool integrations
- **XXE:** No XML parsing of untrusted input in v1
- **Open redirect:** Whitelist-only redirect destinations
- **Mass assignment:** Explicit allowlist of settable fields per endpoint
- **Rate limit bypass:** Rate limits enforced by user ID and IP

### Prompt injection

Playbook content and user inputs flow into AI prompts. Defenses:

- Structural separation: system prompt is immutable; user input in delimited sections with clear instructions
- Output validation against expected schema when structured
- Output scanning for PII leaks, out-of-scope content
- No user input directly controls tool calls without intermediate review
- Sensitive operations (credit spend, admin actions) never triggered by AI output alone

### Dependencies

- SCA via Dependabot or Renovate
- Vulnerabilities triaged within SLA: critical <72h, high <7d, medium <30d
- Software Bill of Materials (SBOM) generated per release
- License compliance check in CI

### CI/CD security

- Signed commits encouraged
- Branch protection on `main`: PR + review + CI pass
- Secrets scanning in PRs (gitleaks)
- SAST (Semgrep) in CI
- SCA (Trivy, npm audit) in CI
- Container image signing (cosign) for production images
- Deployment requires review by maintainer

---

## Monitoring & Detection

### Logging

- Application logs: structured JSON, no PII except where explicitly consented and classified
- Audit logs: security-relevant events with 1-year retention hot, 7-year cold
- Access logs: API Gateway + CloudFront
- VPC Flow Logs
- CloudTrail (all regions) with log file validation
- Logs aggregated in security account, immutable

### Detection

- GuardDuty enabled in all accounts
- Security Hub for centralized findings
- Custom detections:
  - Anomalous credential use (geo-impossible travel)
  - Unusual credit spend patterns
  - Failed auth burst
  - Admin action outside business hours without ticket
  - Cross-account role assumption outside known patterns

### Alerting

- Critical alerts to on-call (PagerDuty/Opsgenie)
- 24x7 coverage planned for Phase 2+
- Runbook per alert
- Post-incident review mandatory

---

## Incident Response

### Severity levels

| Sev | Description | Example | Response target |
|---|---|---|---|
| 1 | Data breach, platform down, active attack | PII exfiltration, prod outage | Immediate |
| 2 | Significant impact on users or integrity | Auth broken, widespread errors | <1 hour |
| 3 | Degraded service | Elevated error rate | <4 hours |
| 4 | Minor | Non-critical bug | Next business day |

### Response process

1. **Detect** → on-call paged
2. **Triage** → severity, scope, affected users
3. **Contain** → stop bleeding (block attacker, disable feature, rotate credential)
4. **Eradicate** → address root cause
5. **Recover** → restore normal service
6. **Notify** → users (per severity and regulation), regulators (72h for GDPR data breaches)
7. **Post-mortem** → blameless write-up within 5 business days
8. **Action items** → tracked to closure

### Data breach specifics

- GDPR: 72-hour notification to supervisory authority
- CCPA: "without unreasonable delay" notification to California AG and affected residents
- State notification laws per jurisdiction
- Affected users notified with: what happened, what data, what we're doing, what they should do, how to get more info

---

## Third-Party Risk

### Vendor due diligence

Before onboarding any vendor that processes user data:

- SOC 2 Type II report reviewed
- Privacy policy and DPA reviewed
- Subprocessor list reviewed
- Data residency confirmed
- Exit plan documented

### Current processors (subject to change; full list in DPA)

- **AWS** — primary infrastructure
- **Stripe** — payments
- **Anthropic** — AI inference (Claude)
- **Persona or Jumio** — identity verification
- **SES / Postmark** — transactional email
- **Sentry** — error tracking
- **PagerDuty / Opsgenie** — on-call

### Data processing agreements

- DPA signed with every data processor
- SCCs for EU-to-US transfers where applicable
- GDPR Art. 28 requirements met
- Annual re-review

---

## Compliance Alignment

Control mapping (abbreviated):

| Control Family | Example controls |
|---|---|
| **Access control** | RBAC, MFA, least-privilege, break-glass |
| **Audit & accountability** | CloudTrail, audit logs, 7-year retention |
| **Awareness & training** | Annual security training, secure coding, phishing sim |
| **Configuration management** | IaC, version control, change review |
| **Contingency planning** | Backups, DR runbook, quarterly DR test |
| **Identification & authentication** | Strong auth, password policy, MFA |
| **Incident response** | Runbooks, on-call, post-mortem, notification |
| **Maintenance** | Patching, vuln management |
| **Media protection** | Encryption at rest, secure wipe on deletion |
| **Personnel security** | Background checks, NDAs, offboarding |
| **Physical protection** | AWS managed (SOC 2, ISO 27001, FedRAMP) |
| **Risk assessment** | Annual risk register, quarterly review |
| **Security assessment** | Pentest (annual), audit, vulnerability scans |
| **System & communication protection** | TLS, segmentation, network controls |
| **System & information integrity** | WAF, IDS, monitoring, alerting |

---

## Expert & Content Security

- Expert identity verified before account creation (Persona/Jumio)
- Credentials verified via authoritative APIs (bar lookup, FSMB, professional body APIs)
- Continuous monitoring for credential changes (monthly check)
- Content reviewed by peer + automated lint before publication
- Flagged content removed pending review
- Ethics Board oversight for borderline cases

---

## User Privacy Controls

- Data subject rights (access, deletion, portability) — see [`../compliance/privacy-data.md`](../compliance/privacy-data.md)
- Consent granularity for analytics, research data use
- Session privacy: sensitive playbooks can be marked "incognito" (minimal retention, excluded from recommendations)
- Redaction utilities for artifacts before sharing

---

## Known Limitations & Trade-offs

1. **AI provider lock-in:** Primary dependency on Claude. Mitigated by MockProvider abstraction, multi-provider roadmap.
2. **Jurisdiction gaps:** Automated credential verification coverage is incomplete internationally. Mitigated by manual review fallback.
3. **Shared sessions:** Share tokens don't enforce identity of viewer. Mitigated by short-lived tokens, revocation, audit.
4. **v1 SSO:** Limited to Google. SAML in Phase 2. Enterprise early adopters accept this.
5. **No dedicated tenant infrastructure in v1.** Enterprise data isolated logically, not physically. Phase 3 dedicated-tenant option.

---

## Review Cadence

- **Annually:** full pentest (third-party), control reassessment, DR test
- **Quarterly:** access review, risk register update, vendor review, tabletop incident exercise
- **Monthly:** vulnerability scan, dependency audit, backup restoration test
- **Weekly:** security ticket review
- **Continuous:** monitoring, detection, patching

---

## Related Documents

- [`../../SECURITY.md`](../../SECURITY.md) — public disclosure policy
- [`../compliance/privacy-data.md`](../compliance/privacy-data.md)
- [`../compliance/trust-safety.md`](../compliance/trust-safety.md)
- [`system-overview.md`](system-overview.md)
