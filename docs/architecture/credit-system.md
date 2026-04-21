# Credit System

The credit ledger is the authoritative source of truth for usage metering, subscription entitlements, and expert revenue accounting. This document specifies its mechanics.

---

## Design Principles

1. **Append-only.** Ledger entries are immutable. Corrections happen via new entries (adjustment, refund), never by editing or deleting.
2. **Transactional.** Credit changes are atomic — a step execution either deducts credits and writes an execution record, or neither happens.
3. **Auditable.** Every credit change traces back to a user action, a subscription grant, a purchase, or an admin adjustment.
4. **Reproducible.** Balance at any point in time is derivable from the ledger.
5. **Segregated.** User credit ledger and expert earnings ledger are separate. Same event generates entries on both.

---

## Ledger Schema

See [`../../schemas/credit-ledger.schema.json`](../../schemas/credit-ledger.schema.json) for canonical schema.

```
CreditLedgerEntry {
  id: UUID
  user_id: UUID
  org_id: UUID | null
  entry_type: enum
  amount: integer (signed; positive=credit added, negative=consumed)
  balance_after: integer
  related_session_id: UUID | null
  related_step_execution_id: UUID | null
  related_stripe_charge_id: string | null
  description: string
  idempotency_key: string | null
  created_at: timestamp (immutable, append-only)
}
```

Storage: DynamoDB with partition key `user_id`, sort key `created_at#id`. Enables fast balance computation for a user via a reverse scan.

---

## Entry Types

| entry_type | Direction | Source |
|---|---|---|
| `purchase` | + | One-time credit pack purchase via Stripe |
| `subscription_grant` | + | Monthly credit allotment from active subscription |
| `consumption` | − | Credits consumed by step execution |
| `refund` | + | Admin-initiated refund or automatic refund on failed step |
| `adjustment` | ± | Admin adjustment (with documented reason) |
| `expiration` | − | Credits expiring per retention policy |
| `bonus` | + | Promotional grant, referral, testimonial, etc. |

---

## Balance Computation

**Current balance** = sum of all ledger entries for user (within scope).

**Enterprise scope:** Entries with `org_id` set consume from the org's pool. User cannot overspend org quota.

**Expiration rules:**
- Subscription grants expire at end of billing period unless rolled over (rollover is a subscription-tier feature for Builder+)
- Purchased credits do not expire (until deleted with account)
- Promotional credits expire per their grant terms (typically 90 days)

Balance computation uses FIFO consumption: oldest-granted credits are consumed first. This matters for expiration logic.

---

## Credit Reservation Pattern

To prevent race conditions (two concurrent step executions that would both exceed balance), the engine uses a **reserve-then-commit** pattern:

```
1. At step start:
   - Calculate expected max cost (step base + estimated AI + artifacts)
   - Write a `pending` ledger entry with estimated cost
   - Verify balance_after >= 0 (atomic conditional write)
   - If fails: return 402 insufficient_credits

2. Execute step (AI call, artifact generation, etc.)

3. At step completion:
   - Calculate actual cost (observed AI tokens × rate + observed artifact count)
   - If actual < estimated: write `adjustment` entry for the refund
   - If actual > estimated: debited from user's balance unless >10% over, in which case refund user the overage
   - Mark pending entry as committed
```

This guarantees:
- No double-charge on retry
- Users never see balance drop below 0
- Estimation accuracy can be monitored and refined

---

## Subscription Grant Mechanics

Subscriptions are managed in Stripe; A2X mirrors state via webhooks.

**Monthly grant cycle:**

```
On subscription.invoice.paid webhook:
  1. Compute credits to grant based on tier
     Explorer: 100
     Builder: 400
     Operator: 1,200
  2. Write ledger entry with entry_type='subscription_grant'
  3. Set expires_at = invoice_period_end (or +60 days with rollover)
```

**On tier change:**
- Upgrade mid-period: prorate new tier's grant for remainder
- Downgrade: takes effect next period (no clawback)

**On cancel:**
- No further grants
- Existing grants remain valid until their expiration

---

## Purchase Flow

```
POST /v1/credits/purchase { credit_pack_id }
  │
  ├─ Server creates Stripe Checkout Session with metadata { user_id, credit_pack_id }
  ├─ Return checkout_url
  │
User completes checkout at Stripe
  │
  ├─ Stripe sends checkout.session.completed webhook
  ├─ Server verifies signature, looks up user_id from metadata
  ├─ Server writes ledger entry with entry_type='purchase'
  ├─ Server sends confirmation email
  │
User sees updated balance
```

---

## Expert Earnings Ledger

Separate ledger tracks expert earnings, written simultaneously with user consumption.

```
ExpertEarningsEntry {
  id: UUID
  expert_id: UUID
  entry_type: enum [ 'completion_share', 'bonus', 'adjustment', 'payout', 'reversal' ]
  amount_cents: integer (signed)
  currency: string (ISO 4217, default 'USD')
  related_step_execution_id: UUID | null
  related_session_id: UUID | null
  related_payout_id: UUID | null
  description: string
  created_at: timestamp (immutable)
}
```

**On step execution that consumed N credits:**

```
1. Determine revenue split:
   - Anchor tier: 60% expert (or negotiated)
   - Certified tier: 70% expert
   - Emerging tier: 70% expert
2. Compute expert_amount = credits_consumed × retail_price × expert_share
3. Write ExpertEarningsEntry with entry_type='completion_share'
```

**Payout:**

- Monthly payouts via Stripe Connect (or equivalent)
- Minimum payout threshold: $50 (earnings below threshold roll to next month)
- Payout lead time: T+30 days (prior month's earnings paid on 15th of current month)
- Fee: Stripe Connect fees passed through; no additional A2X fee
- Tax: 1099 issued for US experts earning $600+/year; international handled per jurisdiction

---

## Refund Handling

### User-facing refunds

**Automatic refunds triggered by:**

- AI provider failure (no valid response returned)
- Artifact generation failure
- Session refunded by admin (full or partial)
- Expert takedown of playbook (active sessions refunded)

**Refund flow:**

1. Write ledger entry with entry_type='refund', positive amount
2. Write corresponding ExpertEarningsEntry with entry_type='reversal', negative amount
3. If credits were purchased via Stripe and user requests Stripe refund (within 30 days), additionally issue Stripe refund
4. Audit log entry

### Expert earnings reversals

Triggered when a user refund occurs. Reverses the expert's earned share for that completion. If payout has already been issued, the reversal is carried forward as a negative balance against future earnings (with cap to prevent clawback ambushes).

---

## Credit Pricing

Reference pricing (subject to change; see [`unit-economics.md`](../unit-economics.md)):

| Pack | Credits | Price | Effective $/credit |
|---|---|---|---|
| Top-up 100 | 100 | $17 | $0.170 |
| Top-up 500 | 500 | $75 | $0.150 |
| Top-up 2,000 | 2,000 | $260 | $0.130 |
| Top-up 10,000 | 10,000 | $1,100 | $0.110 |

Subscription tier effective rates are generally better than top-up rates to incentivize subscription.

Enterprise contracts: negotiated, typically $0.08–$0.12 per credit at volume.

---

## Anti-Abuse

**Signals monitored:**

- Rapid credit purchase from new account → flag for fraud review
- Repeated refund requests → throttle
- Credential stuffing / stolen card signals → Stripe Radar handles primary
- Shared account usage (concurrent sessions from distant geographies) → warn and require re-auth
- Expert self-consumption to inflate stats → detect by user-expert correlation, disallow

**Throttling:**

- Max 10 credit purchases per user per 24h
- Max $500 credit purchase for new accounts (first 30 days)
- Max session starts per user: 50/day (with override for enterprise)

---

## Reporting

**For users:**
- Ledger history viewable in `/settings/credits`
- Monthly statement email
- CSV export

**For experts:**
- Earnings dashboard with filters (playbook, date, completion)
- Payout history
- 1099 (US) download at year-end

**For platform:**
- Daily reconciliation report (Stripe vs. ledger)
- Expert earnings aging
- Credit float (purchased but not yet consumed)
- Anomaly detection

---

## Reconciliation

Daily job reconciles:

- Stripe received payments vs. ledger `purchase` entries
- Subscription period grants vs. active subscriptions
- Expert earnings total vs. user consumption total × expert share
- Refunds on both sides
- Balance consistency (sum of entries = current balance)

Any discrepancy alerts on-call. No silent corrections.

---

## Enterprise Ledger Model

For organizations:

- **Pool model:** Org pays for N credits; all org members draw from shared pool
- **Seat model:** Each seat gets M credits/month; unused seat credits expire monthly (or roll over per contract)
- **Hybrid:** Per-seat allotment + shared burst pool

Org admin has visibility into:
- Per-seat consumption
- Top playbooks consumed
- Utilization trends
- Outcome data (aggregate, anonymized)

---

## Technical Implementation Notes

- **Idempotency:** All ledger writes include an `idempotency_key` sourced from the caller (step execution ID, webhook event ID, etc.)
- **Transaction scope:** Where possible, ledger entry + session state update happen in a single DynamoDB `TransactWriteItems` call
- **Concurrency:** Conditional writes on `balance_after` prevent balance corruption under concurrent load
- **Cold data:** Ledger entries older than 7 years moved to S3 archive (per retention policy); computed balances cached to avoid scanning archive

---

## Related

- [`data-model.md`](data-model.md) — entities
- [`api-routes.md`](api-routes.md) — credit and billing endpoints
- [`../unit-economics.md`](../unit-economics.md) — economic model
- [`../../schemas/credit-ledger.schema.json`](../../schemas/credit-ledger.schema.json) — canonical schema
