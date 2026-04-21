import type { ExpertId, ISODateTime, LedgerEntryId, PlaybookId, SessionId } from './common.js';

export type LedgerAccountType =
  | 'user'
  | 'organization'
  | 'expert-earnings'
  | 'institutional-share'
  | 'platform-revenue';

export type LedgerEntryType =
  | 'purchase'
  | 'grant'
  | 'refund'
  | 'chargeback'
  | 'subscription-allocation'
  | 'session-charge'
  | 'step-charge'
  | 'completion-charge'
  | 'expert-payout-accrual'
  | 'expert-payout-paid'
  | 'institutional-accrual'
  | 'institutional-paid'
  | 'platform-margin'
  | 'adjustment'
  | 'expiration';

export type LedgerCurrency = 'CREDITS' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface CreditLedgerEntry {
  id: LedgerEntryId;
  accountId: string;
  accountType: LedgerAccountType;
  type: LedgerEntryType;
  amount: number;
  balanceAfter: number;
  currency: LedgerCurrency;
  sessionId?: SessionId | null;
  playbookId?: PlaybookId | null;
  expertId?: ExpertId | null;
  stripePaymentIntentId?: string | null;
  stripePayoutId?: string | null;
  occurredAt: ISODateTime;
  idempotencyKey: string;
  description?: string;
  metadata?: Record<string, unknown>;
  reversalOf?: LedgerEntryId | null;
}
