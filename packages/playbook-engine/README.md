# @a2x/playbook-engine

Deterministic, auditable execution engine for Access To Experts playbooks.

## Responsibilities

- **Load** a certified `Playbook` from storage (Postgres/S3)
- **Start** a `Session` against a specific `Playbook` + `version`
- **Execute** one step at a time, with deterministic ordering and branch resolution
- **Charge** credits via the ledger before any paid action (fail-closed)
- **Invoke** model providers (Anthropic) or internal tools per step type
- **Produce** artifacts via templates and persist references
- **Emit** audit log entries for every state transition

## Non-goals

- Hosting the HTTP API (see `apps/api`)
- Owning authentication (see `apps/api`)
- Managing billing provider state (see `apps/api` and `credit-system.md`)
- Rendering UI (see `apps/web`)

## Status

**Stub.** Interfaces are defined; implementations are TODO and will be filled in during Phase 1 of the roadmap. The purpose of this package in v0.1 is to establish the module boundary and type contracts so the API can be built against a stable surface.

## Key interfaces

See `src/index.ts`:

- `PlaybookLoader` — fetches playbooks by id/version
- `SessionStore` — persists `Session` records
- `LedgerClient` — double-entry credit/fiat ledger
- `ModelProvider` — wraps Anthropic and other providers
- `ArtifactRenderer` — fills templates, returns artifact refs
- `PlaybookEngine` — orchestrates the above

## Security notes

- Engine never calls a model provider before the ledger confirms a successful debit.
- Engine never writes unredacted PII to logs.
- Engine enforces playbook version pinning on active sessions — in-flight sessions do not silently migrate to new playbook versions.

## Testing

Vitest. Unit tests target step resolution, branch evaluation, idempotency of credit charges, and artifact template rendering.
