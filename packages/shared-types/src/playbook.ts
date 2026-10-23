import type {
  ExpertId,
  ISODateTime,
  JurisdictionTag,
  OrgId,
  PiiClassification,
  PlaybookId,
  Role,
  SemVer,
  StepId,
  Vertical,
} from './common.js';

export type PlaybookStatus = 'draft' | 'in_review' | 'certified' | 'deprecated' | 'archived';

export type StepType =
  | 'instruction'
  | 'prompt'
  | 'form'
  | 'branch'
  | 'artifact'
  | 'checkpoint'
  | 'external-action';

export type InputFieldType =
  | 'text'
  | 'longtext'
  | 'number'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'boolean'
  | 'file';

export type ContentLicense = 'a2x-expert-content-v1' | 'cc-by-4.0' | 'proprietary';

export type Exclusivity = 'none' | 'platform-exclusive' | 'vertical-exclusive';

export type ArtifactFormat = 'markdown' | 'docx' | 'pdf' | 'json' | 'csv';

export interface InputField {
  name: string;
  label?: string;
  type: InputFieldType;
  required?: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  piiClassification?: PiiClassification;
}

export interface Branch {
  condition: string;
  nextStepId: StepId;
  label?: string;
}

export interface Step {
  id: StepId;
  order: number;
  type: StepType;
  title: string;
  content: string;
  expectedInputs?: InputField[];
  branches?: Branch[];
  artifactTemplateId?: string;
  timeoutSeconds?: number;
  creditCostOverride?: number;
  allowSkip?: boolean;
  requiresHumanReview?: boolean;
}

export interface ArtifactTemplate {
  id: string;
  name: string;
  format: ArtifactFormat;
  template?: string;
  description?: string;
}

export interface CreditCost {
  base: number;
  perStep?: number;
  completionBonus?: number;
}

export interface Licensing {
  contentLicense: ContentLicense;
  expertRevenueShareBps: number;
  institutionalShareBps?: number;
  exclusivity?: Exclusivity;
}

export interface PlaybookReviewStatus {
  peerReviewedAt?: ISODateTime | null;
  reviewerExpertIds?: ExpertId[];
  lastRegulatoryReviewAt?: ISODateTime | null;
  reviewNotes?: string;
}

export interface Disclosures {
  notLegalAdvice?: boolean;
  notMedicalAdvice?: boolean;
  notFinancialAdvice?: boolean;
  additionalDisclosures?: string[];
}

export interface Playbook {
  id: PlaybookId;
  version: SemVer;
  title: string;
  subtitle?: string;
  description?: string;
  vertical: Vertical;
  authorExpertId: ExpertId;
  coAuthorExpertIds?: ExpertId[];
  institutionalSponsorId?: OrgId | null;
  status: PlaybookStatus;
  tier?: 'anchor' | 'certified' | 'emerging';
  jurisdictionTags: JurisdictionTag[];
  practiceAreas: string[];
  tags?: string[];
  targetRole?: Role[];
  estimatedDurationMinutes?: number;
  creditCost: CreditCost;
  licensing: Licensing;
  steps: Step[];
  artifactTemplates?: ArtifactTemplate[];
  prerequisitePlaybookIds?: PlaybookId[];
  reviewStatus?: PlaybookReviewStatus;
  safetyNotes?: string;
  disclosures: Disclosures;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  publishedAt?: ISODateTime | null;
  deprecatedAt?: ISODateTime | null;
}
