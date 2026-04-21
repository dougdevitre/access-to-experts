# Changelog

All notable changes to Access To Experts are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Initial repository scaffold (Phase 0)
- Core governance docs: `README`, `LICENSE`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, `GOVERNANCE`, `ROADMAP`
- Product documentation: vision, product spec, enterprise strategy, unit economics, glossary
- Architecture: system overview, data model (18 entities), API routes, playbook engine, credit system, security
- Business docs: pricing tiers, expert tiers, revenue model, go-to-market
- Compliance: trust & safety, liability framework, privacy & data, jurisdiction taxonomy, accessibility
- Partnerships: institutional playbook, target institutions, white-label model
- Verticals: V1 family law, V2 trial advocacy, V3 speaking business, vertical expansion strategy
- Canonical JSON schemas: playbook, session, expert, credit ledger, review
- Schema examples: simple, branching, and jurisdiction-scoped playbooks
- TypeScript `@a2x/shared-types` package
- API stub (`@a2x/api`) — Express + helmet + pino, RFC 7807 errors, liveness/readiness
- Web stub (`@a2x/web`) — React 18 + Vite three-pane UI scaffold
- Playbook engine stub (`@a2x/playbook-engine`)
- Playbook validator CLI (`scripts/validate-playbook.ts`)
- Claude authoring skill (`skill/SKILL.md`)
- GitHub issue and PR templates; CI workflow with typecheck, lint, test, schema validation, and secret scanning
- Monorepo tooling: pnpm workspaces, base tsconfig, editorconfig, gitignore

### Notes
- No user-facing release yet. Phase 1 (MVP) targets the first certified playbook library for the family-law vertical with CoTrackPro as the anchor integration.
