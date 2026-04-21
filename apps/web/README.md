# @a2x/web

Access To Experts web client. React 18 + Vite + TypeScript.

## Three-pane shell

The primary UI is a three-pane layout:

- **Guide** (left) — conversational Claude-backed assistant that helps the user find the right playbook, explains what each playbook does, and narrates the session.
- **Marketplace / Library** (center) — search, filter, and preview playbooks by vertical, jurisdiction, role, and expert.
- **Workspace** (right) — the active session: current step, form inputs, generated artifacts, and credit balance.

See `docs/architecture/system-overview.md` for the full layout diagram.

## Status

Stub. `src/App.tsx` renders a placeholder landing page. Full components land in Phase 1.

## Scripts

```
pnpm dev        # vite dev server on :5173
pnpm build      # type-check + production build
pnpm preview    # serve the production build locally
pnpm typecheck  # tsc --noEmit
```

## Environment

- `VITE_API_URL` — base URL for the A2X API (default `http://localhost:4000`). Dev server proxies `/v1` to this host.

No secrets in this package. All secrets stay server-side.
