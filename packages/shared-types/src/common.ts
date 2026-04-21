/**
 * Common primitive types shared across the A2X domain.
 *
 * IDs use opaque branded types to prevent accidental mixing.
 */

export type Brand<T, B> = T & { readonly __brand: B };

export type UserId = Brand<string, 'UserId'>;
export type OrgId = Brand<string, 'OrgId'>;
export type ExpertId = Brand<string, 'ExpertId'>;
export type PlaybookId = Brand<string, 'PlaybookId'>;
export type SessionId = Brand<string, 'SessionId'>;
export type StepId = Brand<string, 'StepId'>;
export type ArtifactId = Brand<string, 'ArtifactId'>;
export type LedgerEntryId = Brand<string, 'LedgerEntryId'>;
export type ReviewId = Brand<string, 'ReviewId'>;

export type ISODateTime = Brand<string, 'ISODateTime'>;
export type SemVer = Brand<string, 'SemVer'>;

export type Vertical =
  | 'family-law'
  | 'trial-advocacy'
  | 'speaking-business'
  | 'civic-government'
  | 'mediation-adr'
  | 'workforce'
  | 'clinical-mental-health'
  | 'business-strategy'
  | 'education'
  | 'other';

export type ExpertTier = 'anchor' | 'certified' | 'emerging' | 'pending';

export type Role =
  | 'parent'
  | 'attorney'
  | 'judge'
  | 'gal'
  | 'therapist'
  | 'school-counselor'
  | 'advocate'
  | 'mediator'
  | 'law-enforcement'
  | 'speaker'
  | 'consultant'
  | 'clinician'
  | 'researcher'
  | 'staff'
  | 'citizen'
  | 'other';

export interface JurisdictionTag {
  level: 'global' | 'country' | 'state' | 'province' | 'county' | 'city' | 'tribal';
  code: string;
  scopeNote?: string;
}

export type PiiClassification = 'none' | 'low' | 'medium' | 'high' | 'phi';

/** RFC 7807-style error body used by the API. */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}
