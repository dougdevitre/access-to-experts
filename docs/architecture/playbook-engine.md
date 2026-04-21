# Playbook Engine

The playbook engine is the core execution library that turns a Playbook JSON document into a runtime state machine. It is implemented as a pure library (`packages/playbook-engine/`) — not a standalone service — so it can be embedded in the API server, in worker processes, in CLI tools, and in the MCP server surface.

---

## Design Principles

1. **Pure functions, explicit state.** The engine does not hold session state internally; callers pass state in and receive new state out. This makes it easy to persist, replay, and test.
2. **Deterministic where possible.** Branching, input validation, and credit cost calculation are deterministic. AI output is the only non-deterministic component, and it is treated as an external dependency.
3. **Fail-safe.** If a step fails mid-execution, credits are not deducted and the session state is not advanced.
4. **Idempotent.** Re-executing a step with the same `idempotency_key` returns the original result without double-charging.
5. **Schema-validated.** Every playbook is validated against `playbook.schema.json` before execution.

## Module Structure

```
packages/playbook-engine/
├── src/
│   ├── index.ts                Public API
│   ├── types.ts                Shared types (re-exported from shared-types)
│   ├── validator.ts            Validates Playbook JSON against schema
│   ├── state-machine.ts        Core state transitions
│   ├── branching.ts            Evaluates branch conditions
│   ├── input-resolution.ts     Validates user input against InputSpec
│   ├── credit-calculator.ts    Computes credit cost per step
│   ├── prompt-builder.ts       Builds AI prompts from template + state
│   ├── artifact-generator.ts   Renders artifact templates
│   ├── ai-adapter.ts           Adapter interface for AI providers
│   └── providers/
│       ├── claude.ts           Claude API adapter
│       └── mock.ts             In-memory adapter for testing
├── package.json
├── tsconfig.json
└── README.md
```

## Public API

```typescript
// Load and validate a playbook
const playbook = await loadPlaybook(s3Uri);
const validation = validatePlaybook(playbook);
if (!validation.valid) throw new ValidationError(validation.errors);

// Start a session
const session = startSession({
  userId,
  playbookVersionId: playbook.id,
  orgId,
});

// Execute a step
const result = await executeStep({
  session,
  stepId,
  inputs,
  idempotencyKey,
  aiProvider: claudeProvider,
});
// result: { newSession, stepExecution, generatedArtifacts, creditsConsumed }

// Evaluate branching to determine next step
const nextStepId = evaluateNextStep(session, playbook);

// Generate artifact
const artifact = await generateArtifact({
  session,
  stepExecution,
  artifactSpec,
});
```

## State Machine

### States

```
active        Session in progress, user has a current step
paused        User paused; can be resumed
completed     Terminal — all required steps executed
abandoned     Terminal — auto-abandoned after 90 days inactive
refunded      Terminal — admin-initiated refund
```

### Transitions

```
start_session         → active
execute_step          → active (advances current_step) or completed (if terminal)
pause                 active → paused
resume                paused → active
complete              active → completed
abandon               active | paused → abandoned
refund                any → refunded (admin only)
```

## Step Execution Pipeline

```
executeStep(session, stepId, inputs, idempotencyKey, aiProvider)
  │
  ├─ 1. Idempotency check
  │     Look up existing StepExecution by (session_id, step_id, idempotency_key)
  │     If found and completed: return cached result
  │     If found and in-progress: return 409 conflict
  │
  ├─ 2. Validate session state
  │     Session must be 'active'
  │     stepId must match session.current_step_id
  │
  ├─ 3. Validate inputs
  │     Resolve against step.inputs InputSpec
  │     Apply validation rules (regex, min, max, options)
  │     Fail with 400 if invalid
  │
  ├─ 4. Calculate credit cost
  │     Base step cost + estimated AI cost + estimated artifact cost
  │     Reserve credits in ledger (atomic)
  │     Fail with 402 if balance insufficient
  │
  ├─ 5. Build AI prompt
  │     Resolve template variables from session inputs + user profile
  │     Apply system prompt, guardrails, safety wrappers
  │     Inject jurisdiction and disclaimer context
  │
  ├─ 6. Invoke AI provider
  │     Send prompt via aiProvider.invoke()
  │     Receive response + token counts + cost
  │     Validate response format if structured output expected
  │
  ├─ 7. Generate artifacts (if step defines them)
  │     For each ArtifactSpec on step:
  │       Load template from S3
  │       Render with session inputs + AI output
  │       Write to S3 with content hash
  │       Create Artifact record
  │
  ├─ 8. Evaluate branching
  │     If step has branch_conditions:
  │       For each condition in order:
  │         Evaluate { input_key, op, value }
  │         First match wins → goto target step
  │     Else: advance to next step in order
  │     If no next step: mark session 'completed'
  │
  ├─ 9. Persist state
  │     Write StepExecution record
  │     Write Artifact records
  │     Update Session (current_step_id, step_path, credits_consumed)
  │     Finalize credit ledger entry
  │
  └─ 10. Return result
        { newSession, stepExecution, generatedArtifacts, creditsConsumed, nextStepId }
```

All write operations are wrapped in a transaction where possible (DynamoDB TransactWriteItems).

## Input Resolution

Input resolution validates user input against the step's `InputSpec[]`. Each input is validated independently; collected errors are returned together.

```typescript
interface InputValidationResult {
  valid: boolean;
  errors: Array<{ input_key: string; message: string; code: string }>;
  resolved: Record<string, unknown>;
}
```

Validation rules supported:

- `required` — presence check
- Type coercion (`short_text`, `long_text`, `number`, `date`, `boolean`)
- `regex` for text
- `min` / `max` for numbers, dates, text length
- `options` for select/multiselect
- `file_upload` — MIME type and size validation
- `jurisdiction` — validates against known JurisdictionTag codes

## Branching Logic

Branch conditions evaluate to a boolean using a small expression language:

```json
{
  "branch_conditions": [
    {
      "when": { "input_key": "has_children", "op": "equals", "value": true },
      "goto_step_id": "custody_section"
    },
    {
      "when": { "input_key": "children_count", "op": "gt", "value": 2 },
      "goto_step_id": "large_family_section"
    }
  ]
}
```

Supported ops: `equals`, `not_equals`, `gt`, `gte`, `lt`, `lte`, `in`, `not_in`, `contains`, `matches` (regex), `exists`, `not_exists`, `and` (nested), `or` (nested).

Conditions are evaluated in order; first match wins. If no condition matches, the engine advances to the next step in `order` index.

## Prompt Building

Prompts are built from templates with variable interpolation, system prompts, and safety wrappers.

```typescript
const prompt = buildPrompt({
  template: step.ai_prompt_template,
  sessionInputs: session.inputs,
  userProfile: filterConsentedFields(user),
  jurisdictionContext: session.playbook.jurisdictions,
  disclaimers: session.playbook.disclaimers,
});
```

**Template syntax:** Uses `{{ variable }}` interpolation. Scoped to session inputs by default; explicit `{{ user.name }}` for user fields.

**System prompt wrapper (injected automatically):**

```
You are executing a structured playbook authored by a credentialed expert.

PLAYBOOK: {{ playbook.title }}
EXPERT: {{ expert.professional_name }} ({{ expert.credentials }})
JURISDICTION: {{ playbook.jurisdictions }}

YOU MUST:
- Stay within the scope of this playbook step.
- Respect all disclaimers provided.
- Do not provide legal/medical/clinical advice beyond educational framing.
- If the user asks something out of scope, say so clearly.
- Honor the expert's methodology.
```

**Guardrails:** Output-side validation catches responses that exceed scope, contain PII beyond what the user provided, or violate safety rules.

## Artifact Generation

Artifacts are generated from templates stored alongside the playbook in S3. Template formats:

- **DOCX** — Using the `docx` npm library with placeholder replacement
- **PDF** — Using a headless rendering pipeline (Puppeteer or similar) from HTML template
- **Markdown** — Handlebars or similar string templating
- **JSON** — Structured output with schema validation
- **HTML** — Handlebars or React server rendering

Generated artifacts are:
- Written to S3 with versioned keys
- Hashed for integrity
- Recorded as `Artifact` entities
- Linked to the `StepExecution` that generated them

## AI Adapter Interface

```typescript
interface AIProvider {
  invoke(params: {
    systemPrompt: string;
    userPrompt: string;
    model: string;
    maxTokens: number;
    stopSequences?: string[];
    tools?: AITool[];
  }): Promise<{
    response: string;
    tokensIn: number;
    tokensOut: number;
    costUsd: number;
    toolCalls?: AIToolCall[];
    latencyMs: number;
  }>;
}
```

Implemented adapters:

- `ClaudeProvider` — uses `@anthropic-ai/sdk`, supports Opus/Sonnet/Haiku model selection
- `MockProvider` — in-memory, deterministic — used for tests and expert test-runs

Future adapters:
- `OpenAIProvider`
- `BedrockProvider` (for enterprise customers requiring AWS-managed AI)

## Test-Run Mode

Experts can test-run their own playbooks without consuming credits:

```typescript
const testResult = await executeStep({
  session,
  stepId,
  inputs,
  idempotencyKey,
  aiProvider: claudeProvider,
  mode: 'test-run',   // skips credit ledger; marks StepExecution.is_test=true
});
```

Test runs still invoke AI (to validate real behavior) but do not deduct credits from the expert's or platform's ledgers. AI cost is absorbed as an expert authoring expense.

## Versioning Behavior

When a user starts a session, the session is pinned to the current published `PlaybookVersion`. Subsequent publishes of new versions do not affect the in-progress session. This guarantees:

- Sessions complete consistently even if the expert updates the playbook
- Artifacts generated are reproducible from session state
- Audit trail is clean

On resume, the engine loads the pinned version, not the latest.

## Observability

Every step execution emits structured events:

- `step.started`
- `step.input_validated`
- `step.ai_invoked` (with model, tokens, cost, latency)
- `step.artifact_generated`
- `step.completed`
- `step.failed` (with error class)

Events are written to CloudWatch and optionally to a partner webhook.

## Error Handling

```typescript
class PlaybookError extends Error { /* ... */ }
class ValidationError extends PlaybookError { /* ... */ }
class InsufficientCreditsError extends PlaybookError { /* ... */ }
class AIProviderError extends PlaybookError { /* ... */ }
class IdempotencyConflictError extends PlaybookError { /* ... */ }
class JurisdictionMismatchError extends PlaybookError { /* ... */ }
```

The API layer maps these to RFC 7807 error responses (see [`api-routes.md`](api-routes.md)).

## Testing Strategy

- **Unit tests** for each module (validator, branching, input-resolution, credit-calculator, prompt-builder, artifact-generator)
- **Integration tests** using `MockProvider` for full session lifecycle
- **Golden tests** — real playbooks with expected outputs for key scenarios
- **Property tests** (fast-check) for branching expression evaluation
- **Load tests** — verify concurrent step execution does not double-charge credits

Target: 85%+ coverage on the engine package.

## Related

- [`data-model.md`](data-model.md) — entities referenced
- [`api-routes.md`](api-routes.md) — HTTP surface that wraps the engine
- [`credit-system.md`](credit-system.md) — credit ledger mechanics
- [`../../schemas/playbook.schema.json`](../../schemas/playbook.schema.json) — playbook validation schema
