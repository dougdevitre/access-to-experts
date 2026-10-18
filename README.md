# Access To Experts

> The system of record where the world's top practitioners package and scale their methodology as guided, executable playbooks.

> Part of **[Access To](https://dougdevitre.org)** — open-source tools for the access gaps that matter most. [See all projects →](https://dougdevitre.org/#pillars)

Access To Experts (A2X) is a world-class expert-led platform that turns vetted expertise into structured, interactive workflows. Instead of selling files or templates, A2X sells **guided outcomes** — executable playbooks authored by credentialed experts, delivered through an AI-guided three-pane interface, metered via credits, and monetized through both consumer subscriptions and enterprise contracts.

This repository contains the full platform specification, data schemas, engineering scaffolding, compliance framework, partnership playbooks, and governance documents.

---

## Table of Contents

- [Vision](#vision)
- [How It's Different](#how-its-different)
- [Repository Structure](#repository-structure)
- [Core Concepts](#core-concepts)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)
- [Ecosystem Integration](#ecosystem-integration)
- [Contributing](#contributing)
- [Governance](#governance)
- [License](#license)

---

## Vision

Expertise today is trapped inside individuals, firms, and institutions. Access to a top attorney, surgeon, mediator, or strategist depends on geography, network, and budget. Most people settle for generic templates or AI hallucinations.

**A2X changes that.** Credentialed experts package their exact methodology as a structured playbook. Users execute those playbooks with AI guidance, generating real artifacts (documents, decisions, plans) at a fraction of the cost of 1:1 expert engagement.

The platform is built for three audiences:

- **Seekers** — individuals, families, and professionals who need expert-guided execution
- **Experts** — credentialed practitioners who monetize their methodology at scale
- **Enterprises** — corporations, governments, and professional bodies that license curated playbook libraries

## How It's Different

| Alternative | Limitation | A2X Advantage |
|---|---|---|
| Generic AI chatbots | Hallucinations, no accountability | Expert-authored, peer-reviewed, jurisdiction-aware |
| Templates & form libraries | Static, no guidance, no execution | Interactive, branching, AI-guided |
| 1:1 expert consultations | Expensive, slow, limited availability | Scalable, 24/7, credit-metered |
| Course platforms (Coursera, Maven) | Knowledge transfer only | Outcome execution with real artifacts |
| Legal/clinical workflow tools (Rocket Lawyer, Zocdoc) | Narrow verticals, transactional | Multi-vertical, methodology-driven, expert-anchored |

## Repository Structure

```
access-to-experts/
├── README.md                          Project overview (this file)
├── LICENSE                            Apache 2.0
├── CONTRIBUTING.md                    Contribution guidelines
├── CODE_OF_CONDUCT.md                 Community standards
├── SECURITY.md                        Security disclosure policy
├── GOVERNANCE.md                      Governance model
├── ROADMAP.md                         Phased build plan
│
├── docs/
│   ├── vision.md                      Long-form vision & strategy
│   ├── product-spec.md                Full product specification
│   ├── enterprise-strategy.md         Enterprise & institutional playbook
│   ├── unit-economics.md              Credit economics & pricing model
│   ├── glossary.md                    Shared vocabulary
│   │
│   ├── architecture/
│   │   ├── system-overview.md         Three-pane architecture
│   │   ├── data-model.md              Entities, relationships, lifecycle
│   │   ├── api-routes.md              REST + MCP API surface
│   │   ├── playbook-engine.md         Execution engine design
│   │   ├── credit-system.md           Metering, billing, ledger
│   │   └── security.md                Security architecture
│   │
│   ├── business/
│   │   ├── pricing-tiers.md           Consumer & enterprise SKUs
│   │   ├── expert-tiers.md            Anchor / Certified / Emerging
│   │   ├── revenue-model.md           Revenue mix targets
│   │   └── go-to-market.md            GTM sequence
│   │
│   ├── compliance/
│   │   ├── trust-safety.md            Expert verification, content QA
│   │   ├── liability-framework.md     Disclaimers, indemnification, insurance
│   │   ├── privacy-data.md            GDPR, CCPA, HIPAA, state privacy
│   │   ├── jurisdiction-taxonomy.md   Multi-jurisdictional framework
│   │   └── accessibility.md           WCAG 2.2 AA standards
│   │
│   ├── partnerships/
│   │   ├── institutional-playbook.md  How to land anchor deals
│   │   ├── target-institutions.md     Priority institutional partners
│   │   └── white-label-model.md       OEM & white-label framework
│   │
│   └── verticals/
│       ├── v1-family-law.md           Flagship vertical (with CoTrackPro)
│       ├── v2-trial-advocacy.md       Metasystems integration
│       ├── v3-speaking-business.md    Lois247 integration
│       └── vertical-expansion.md      Rollout order for additional verticals
│
├── schemas/
│   ├── playbook.schema.json           JSON schema for playbooks
│   ├── session.schema.json            Execution session state
│   ├── expert.schema.json             Expert profile & credentials
│   ├── credit-ledger.schema.json      Credit transactions
│   ├── review.schema.json             Peer review records
│   └── examples/
│       ├── playbook-simple.json       Minimal playbook example
│       ├── playbook-branching.json    Branching logic example
│       └── playbook-legal-mo.json     Missouri legal playbook example
│
├── packages/
│   ├── shared-types/                  TypeScript types shared across apps
│   └── playbook-engine/               Core execution engine (stub)
│
├── apps/
│   ├── web/                           React/Vite frontend (stub)
│   └── api/                           Node/Express API (stub)
│
├── skill/
│   └── SKILL.md                       Claude skill for A2X authoring
│
├── scripts/
│   └── validate-playbook.ts           CLI to validate playbooks against schema
│
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
        └── ci.yml
```

## Core Concepts

### Playbook

A structured, executable expert methodology. Defined by steps, branching logic, inputs, outputs, and artifacts. Versioned, peer-reviewed, and jurisdiction-scoped.

### Session

A user's execution of a playbook. Persistent, resumable, forkable, and shareable. Tracks inputs, generated artifacts, credit spend, and outcomes.

### Expert Tiers

- **Anchor Experts** — globally recognized, co-branded, prestige content
- **Certified Practitioners** — credentialed, QA-reviewed, bulk supply
- **Emerging Experts** — long-tail coverage, performance-based promotion

### Credits

Usage-based metering unit. Consumed per step, per AI turn, per artifact generation. Replenished via subscription or purchase.

### Verticals

Top-level domains: Legal, Clinical, Business, Civic, Education, Trades. Each vertical has its own taxonomy, compliance posture, and anchor institutions.

## Architecture Overview

Three-pane interface backed by a modular execution engine:

```
┌─────────────┬──────────────────────────┬─────────────────┐
│   Guide     │      Marketplace         │   Workspace     │
│  (AI + UI)  │      (Discovery)         │   (Execution)   │
├─────────────┼──────────────────────────┼─────────────────┤
│ • Filters   │ • Playbook cards         │ • Active session│
│ • Copilot   │ • Expert profiles        │ • Saved sessions│
│ • Suggest   │ • Ratings & outcomes     │ • Artifacts     │
│ • Scope     │ • Preview & purchase     │ • Chat history  │
└─────────────┴──────────────────────────┴─────────────────┘
                          │
                          ▼
             ┌────────────────────────────┐
             │     Playbook Engine        │
             │  (JSON playbook → runtime) │
             └────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  ┌───────────┐     ┌──────────┐      ┌──────────┐
  │   Credit  │     │   AI     │      │ Artifact │
  │   Ledger  │     │  Layer   │      │   Store  │
  └───────────┘     └──────────┘      └──────────┘
```

Full architecture detail in [`docs/architecture/system-overview.md`](docs/architecture/system-overview.md).

## Getting Started

This repository is currently in the **specification and scaffolding phase**. Code implementation follows the roadmap in [`ROADMAP.md`](ROADMAP.md).

To explore:

1. Read [`docs/vision.md`](docs/vision.md) for the strategic vision.
2. Read [`docs/product-spec.md`](docs/product-spec.md) for the full product specification.
3. Read [`docs/enterprise-strategy.md`](docs/enterprise-strategy.md) for the enterprise playbook.
4. Review [`schemas/`](schemas/) for the data model.
5. Review [`docs/verticals/v1-family-law.md`](docs/verticals/v1-family-law.md) for the flagship vertical plan.

To contribute, see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Roadmap

See [`ROADMAP.md`](ROADMAP.md) for the phased plan. Summary:

- **Phase 0 (Months 0–3):** Specification, schemas, flagship playbook authoring (family law via CoTrackPro)
- **Phase 1 (Months 3–9):** MVP platform, invite-only expert beta, first institutional pilot
- **Phase 2 (Months 9–18):** Public launch, second vertical, SOC 2 Type I, first enterprise contract
- **Phase 3 (Months 18–30):** International expansion, SOC 2 Type II, Series A
- **Phase 4 (Months 30+):** Multi-vertical scale, data products, ecosystem partnerships

## Ecosystem Integration

A2X is designed as the commercial surface for a broader ecosystem. Natural integrations include:

- **CoTrackPro** — flagship publisher of family-law and co-parenting playbooks
- **Lois247 / Book More Business** — speaking business coaching playbooks
- **Metasystems** — trial advocacy and persuasion playbooks
- **Justice Technology Association (JTA)** — legal tech matchmaking and member playbooks
- **Access To initiative** — civic-tech playbooks (housing, jobs, health, education, safety, mediation, business)
- **MO Startups / MO Jobs / MO Gov** — Missouri civic vertical seed

See [`docs/partnerships/institutional-playbook.md`](docs/partnerships/institutional-playbook.md) for institutional partnership strategy.

## Contributing

We welcome contributions from experts, engineers, designers, researchers, and institutional partners. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Governance

A2X is governed by a multi-stakeholder model including an Advisory Board, Ethics Board, Expert Council, and Research Board. See [`GOVERNANCE.md`](GOVERNANCE.md).

## License

Apache License 2.0. See [`LICENSE`](LICENSE).

---

**Status:** Specification & scaffolding phase
**Maintainer:** Doug Devitre
**Contact:** See repository settings after transfer
