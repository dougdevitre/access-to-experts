# @a2x/api

HTTP API for Access To Experts. Express + TypeScript, AWS SDK v3, Anthropic.

## Stack

- Node 20, Express 4, TypeScript 5
- AWS SDK v3 for DynamoDB, S3, SSM
- Anthropic SDK for model invocations
- Stripe for billing
- Ajv for JSON Schema validation at the boundary
- Pino for structured logging
- Helmet + CORS for baseline security

## Secrets

All secrets are resolved from AWS SSM Parameter Store at boot (SecureString). Never hardcoded, never in `.env` committed to the repo. Local dev reads from `~/.aws/credentials` plus a non-committed `.env.local`.

Required SSM parameter namespace (see `docs/architecture/security.md`):

```
/a2x/<env>/anthropic/api-key       (SecureString)
/a2x/<env>/stripe/secret-key       (SecureString)
/a2x/<env>/stripe/webhook-secret   (SecureString)
/a2x/<env>/dynamo/sessions-table   (String)
/a2x/<env>/dynamo/ledger-table     (String)
/a2x/<env>/s3/artifacts-bucket     (String)
/a2x/<env>/s3/playbooks-bucket     (String)
/a2x/<env>/cors/allowed-origins    (StringList)
```

## Scripts

```
pnpm dev        # watch mode
pnpm build      # type-check + emit
pnpm start      # run compiled server
pnpm test       # vitest
pnpm typecheck  # no emit
```

## Status

Stub. `src/server.ts` boots an Express app with health, readiness, and a placeholder route map. Route handlers are TODO; see `docs/architecture/api-routes.md` for the full surface.
