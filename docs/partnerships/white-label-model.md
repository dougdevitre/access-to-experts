# White-Label / OEM Model

A2X offers a white-label option for institutional partners (professional bodies, EAP providers, bar associations, government agencies) to deploy the platform under their own brand.

---

## When White-Label Makes Sense

**For A2X:** when a partner brings significant distribution that would cost prohibitive CAC to acquire directly, and they want brand prominence.

**For the partner:** when they want platform value but branding visibility, or when their members would not engage with an outside brand.

**Not a fit when:** partner wants to resell without adding value, partner wants to customize in ways that fragment the platform, partner's brand is misaligned with A2X mission.

---

## Offering

### Branding

- Partner's logo, colors, typography in UI (within design system constraints)
- Custom domain (e.g., `experts.missouribar.org`)
- Partner-branded email from transactional sender
- Partner brand on generated artifacts (co-branded or partner-primary per deal)
- Mobile PWA with partner branding

### Tenant Isolation

- Logical isolation in v1 (shared infrastructure, distinct tenant IDs)
- Per-tenant KMS keys for sensitive data
- Optional dedicated infrastructure in Phase 3+ for top-tier partners

### Content Curation

- Partner selects which playbooks appear in their marketplace
- Partner-authored playbooks prioritized in their tenant
- Partner can commission new playbooks (paid addition)
- Partner cannot access other tenants' private playbooks

### User Experience

- Partner's members sign up via partner-branded landing
- SSO with partner's member directory (SAML, OIDC, or API)
- Member status (active/inactive) synced from partner system
- Optional tier mapping (e.g., partner's "Premium Member" → A2X Builder tier included)

### Admin Features

- Partner admin console for:
  - User management
  - Usage analytics
  - Library curation
  - Billing and invoicing
  - Support escalation
- Partner-branded helpdesk

### Support

- Tier 1 support branded as partner (handled by A2X with partner branding)
- Tier 2 escalation to A2X
- Dedicated success manager for top-tier partners

---

## Commercial Structure

### Setup

- **Setup fee:** $25,000–$100,000 depending on customization depth
- Covers: branding implementation, SSO integration, domain setup, library curation support, admin training
- Paid upfront or milestoned

### Ongoing

Three models available:

**A. Revenue share** (most common)
- Partner shares revenue from platform usage with A2X
- Typical split: 60% partner / 40% A2X, or 70/30 depending on partner contribution
- Partner handles user billing (keeps most of revenue in their relationship)

**B. Per-member flat fee**
- Partner pays A2X a flat fee per member with access (e.g., $2–$10/member/year)
- Partner sets their own member pricing
- A2X takes no share of end-user revenue

**C. Minimum commitment + usage**
- Partner commits to annual minimum (e.g., $100K)
- Usage above minimum billed per-credit
- Suitable for predictable high-volume partners

### Content Commissioning

- Commissioned playbook authoring: $5,000–$25,000 per playbook (depending on complexity)
- Partner owns co-branded content license (non-exclusive to A2X)
- Alternative: partner brings experts, A2X provides authoring tooling at no extra cost

### Multi-year Discounts

- 3-year commitment: 10% discount on setup + usage fees
- 5-year commitment: 15% discount + co-marketing commitment

---

## Contract Terms

- **Term:** 3+ years typical
- **Exclusivity:** usually non-exclusive for A2X; partner may request partial exclusivity (e.g., "only white-label family-law provider in Missouri") — evaluated case by case
- **Termination:** standard (material breach), plus convenience after year 2 with notice period
- **Data:** partner's users' data governed by partner's privacy notice, with A2X as processor per DPA
- **Branding:** partner retains brand ownership; A2X retains platform ownership
- **Liability:** mutual indemnification; caps aligned to contract value

### Critical Clauses

- Content quality standards: A2X retains editorial authority to remove content that violates platform policy
- Platform updates: partner receives platform updates (cannot lock to older version indefinitely)
- Use of aggregate data: usage patterns from tenant are partner-private unless separately licensed
- Exit: data portability guaranteed; content licensing transition defined

---

## Implementation Process

### Phase 1: Discovery (2–4 weeks)
- Partner use case analysis
- SSO / identity system mapping
- Content gap analysis
- Design and branding alignment
- Commercial terms negotiation

### Phase 2: Build (4–8 weeks)
- Branding implementation
- SSO integration
- Custom domain setup
- Content curation
- Admin training

### Phase 3: Pilot Launch (4–8 weeks)
- Limited member rollout
- Feedback collection
- Iteration

### Phase 4: General Availability
- Full member rollout
- Joint marketing announcement
- Ongoing optimization

Total timeline: 3–5 months from contract signature to general availability.

---

## Strategic Considerations

### Fit Criteria

White-label is a fit when:

- Partner has >5,000 relevant members
- Partner has strong brand with its members
- Partner can commit to governance that protects both brands
- Partner has a defined content or distribution advantage
- Deal economics support investment (expected LTV > $500K)

### Anti-patterns

Decline or caution on white-label when:

- Partner is a thin reseller without added value
- Partner wants full platform customization beyond design system
- Partner expects to own A2X IP
- Partner has misaligned ethics or governance posture
- Partner size doesn't justify setup investment

---

## Platform Impact

White-label has consequences for A2X platform engineering:

- **Tenancy first-class** — everything in the data model must be tenant-scoped
- **Theming system** — design tokens per tenant
- **Email + notification templating** — per-tenant templates
- **Legal and policy pages** — per-tenant branding
- **Domain routing** — custom domain support
- **Analytics** — per-tenant analytics; A2X aggregate analytics respect tenant privacy

These are built into the platform from Phase 1 so white-label is possible from Phase 2 without rework.

---

## Related

- [`institutional-playbook.md`](institutional-playbook.md)
- [`../enterprise-strategy.md`](../enterprise-strategy.md)
- [`../business/pricing-tiers.md`](../business/pricing-tiers.md)
