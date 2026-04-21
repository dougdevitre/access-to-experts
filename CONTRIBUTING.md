# Contributing to Access To Experts

Thank you for your interest in contributing. Access To Experts (A2X) is building the world's expert-led platform, and we welcome contributions from engineers, experts, designers, researchers, and institutional partners.

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Contribution Types](#contribution-types)
- [Expert Content Contributions](#expert-content-contributions)
- [Engineering Contributions](#engineering-contributions)
- [Documentation Contributions](#documentation-contributions)
- [Pull Request Process](#pull-request-process)
- [Review Process](#review-process)
- [Licensing & IP](#licensing--ip)
- [Community](#community)

## Ways to Contribute

- **Expert playbooks** — package your methodology as an A2X playbook
- **Schemas & data model** — improve playbook, session, or ledger schemas
- **Engineering** — frontend (React/Vite), backend (Node/Express), playbook engine, infrastructure (AWS)
- **Documentation** — specs, architecture, vertical strategy, compliance
- **Compliance & legal review** — terms, disclaimers, jurisdiction mapping
- **Design** — UI/UX for the three-pane interface
- **Research** — outcome measurement, expertise taxonomy, ranking algorithms
- **Institutional partnerships** — connections to bar associations, medical societies, professional bodies
- **Translations & localization** — especially for launch jurisdictions

## Code of Conduct

All contributors agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). In short: be kind, be professional, be child-centered and trauma-informed where applicable, and operate with integrity.

## Getting Started

1. **Read the vision** — start with [`README.md`](README.md), [`docs/vision.md`](docs/vision.md), and [`docs/product-spec.md`](docs/product-spec.md).
2. **Fork the repository** — on GitHub, fork and clone locally.
3. **Check open issues** — look for `good-first-issue` or `help-wanted` labels.
4. **Open a discussion** — for larger proposals, open a GitHub Discussion first.
5. **Submit a pull request** — follow the [Pull Request Process](#pull-request-process).

## Contribution Types

### Expert Content Contributions

If you are a credentialed practitioner contributing a playbook:

1. **Apply to the Expert Program** (once launched) at [to-be-published URL]
2. **Identify your vertical and practice area** (see [`docs/compliance/jurisdiction-taxonomy.md`](docs/compliance/jurisdiction-taxonomy.md))
3. **Author in the playbook format** — use [`schemas/playbook.schema.json`](schemas/playbook.schema.json) or the visual authoring tool
4. **Include required metadata:**
   - Jurisdictions (`jurisdictions: ["US-MO"]`)
   - Practice area
   - Disclaimers
   - Your credentials
   - Peer reviewers (if applicable)
5. **Pass content QA review** — automated lint + SME peer review
6. **Sign the Expert Content Agreement**

During this pre-launch phase, if you are a founding expert contributor, contact the maintainer directly.

### Engineering Contributions

1. **Install dependencies** — see per-package `README.md` files in `apps/` and `packages/`.
2. **Follow the engineering defaults:**
   - TypeScript for Node/Express and React/Vite
   - Clear typing and error handling
   - AWS SDK v3 patterns, least-privilege IAM
   - Secrets as SSM SecureString or env vars — never hardcoded
   - Small modular utilities and reusable components
   - Secure by default
3. **Run tests and linters** before submitting
4. **Update documentation** alongside code changes

### Documentation Contributions

- Use Markdown
- Follow the document structure in existing `docs/` files
- Prefer primary sources with citations
- Avoid inflammatory language
- Keep a calm, professional, empathetic tone

## Pull Request Process

1. **Create a branch** from `main`: `feature/short-description` or `docs/short-description`.
2. **Make focused commits** — one logical change per commit.
3. **Write a clear PR description:**
   - What changed and why
   - How it was tested
   - Screenshots for UI changes
   - Links to related issues or discussions
4. **Fill out the PR template** (see [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md)).
5. **Request review** from a maintainer.
6. **Respond to feedback** promptly.
7. **Squash and merge** once approved.

## Review Process

- **Documentation PRs** — reviewed by a maintainer within 5 business days.
- **Schema PRs** — require review by a maintainer and may require an RFC for breaking changes.
- **Code PRs** — reviewed by at least one maintainer. CI must pass.
- **Expert content PRs** — go through the Content QA workflow (automated + SME peer review).
- **Compliance-sensitive PRs** (legal, medical, privacy) — require Ethics Board or designated reviewer sign-off.

## Licensing & IP

- **Code contributions** are licensed under Apache License 2.0 (see [`LICENSE`](LICENSE)).
- **Documentation contributions** are licensed under Creative Commons Attribution 4.0 (CC BY 4.0).
- **Expert content contributions** are licensed per the Expert Content Agreement (platform license + revenue share). Experts retain underlying IP ownership.
- By submitting a contribution, you certify that you have the right to submit it under these terms (see the Developer Certificate of Origin below).

### Developer Certificate of Origin

By making a contribution to this project, you certify that:

(a) The contribution was created in whole or in part by you and you have the right to submit it under the open source license indicated in the file; or

(b) The contribution is based upon previous work that is covered under an appropriate open source license and you have the right under that license to submit that work with modifications; or

(c) The contribution was provided directly to you by some other person who certified (a), (b), or (c) and you have not modified it.

(d) You understand and agree that this project and the contribution are public and that a record of the contribution is maintained indefinitely.

## Community

- **GitHub Discussions** — long-form proposals, questions, ideas
- **GitHub Issues** — bug reports, feature requests, tracked work
- **Maintainer contact** — see repository settings

---

Thank you for contributing to Access To Experts.
