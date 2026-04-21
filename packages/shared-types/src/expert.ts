import type { ExpertId, ExpertTier, ISODateTime, OrgId, UserId, Vertical } from './common.js';

export type ExpertStatus = 'active' | 'on_hold' | 'suspended' | 'retired';

export type CredentialType =
  | 'bar-admission'
  | 'medical-license'
  | 'clinical-license'
  | 'mediator-certification'
  | 'professional-association'
  | 'academic-degree'
  | 'government-role'
  | 'institutional-affiliation'
  | 'other';

export type VerificationMethod =
  | 'api-lookup'
  | 'document-upload'
  | 'peer-attestation'
  | 'institutional';

export interface Credential {
  type: CredentialType;
  issuer: string;
  issuerJurisdiction?: string;
  identifier?: string;
  issuedAt?: string | null;
  expiresAt?: string | null;
  verifiedAt: ISODateTime;
  verificationMethod?: VerificationMethod;
  verificationEvidenceRef?: string;
  lastMonitoredAt?: ISODateTime | null;
}

export interface OrgAffiliation {
  organizationId: OrgId;
  role?: string;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean;
}

export type PayoutMethod = 'stripe-connect' | 'ach' | 'wire' | 'institutional-invoice';

export interface RevenueShare {
  defaultBps: number;
  payoutMethod: PayoutMethod;
  stripeConnectAccountId?: string | null;
}

export interface DisciplinaryAction {
  action: 'warning' | 'suspension' | 'removal';
  reason: string;
  takenAt: ISODateTime;
  resolvedAt?: ISODateTime | null;
}

export interface ExpertGovernance {
  councilMember?: boolean;
  peerReviewerFor?: string[];
  disciplinaryActions?: DisciplinaryAction[];
}

export interface Expert {
  id: ExpertId;
  userId?: UserId | null;
  displayName: string;
  legalName?: string;
  pronouns?: string;
  headline?: string;
  bio?: string;
  photoUrl?: string;
  tier: ExpertTier;
  status: ExpertStatus;
  verticals: Vertical[];
  primaryJurisdictions?: Array<{ level: 'country' | 'state' | 'province'; code: string }>;
  credentials: Credential[];
  organizationAffiliations?: OrgAffiliation[];
  specializations?: string[];
  languages?: string[];
  revenueShare?: RevenueShare;
  governance?: ExpertGovernance;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
