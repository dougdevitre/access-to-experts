import type {
  ArtifactId,
  ISODateTime,
  OrgId,
  PlaybookId,
  SemVer,
  SessionId,
  StepId,
  UserId,
} from './common.js';

export type SessionStatus = 'active' | 'paused' | 'completed' | 'abandoned' | 'errored';
export type StepExecStatus = 'in_progress' | 'completed' | 'skipped' | 'errored';
export type RetentionBasis = 'user-default' | 'user-extended' | 'enterprise-policy' | 'legal-hold';
export type DeviceClass = 'web' | 'mobile' | 'api';

export interface StepExecution {
  stepId: StepId;
  startedAt: ISODateTime;
  completedAt?: ISODateTime | null;
  status: StepExecStatus;
  inputs?: Record<string, unknown>;
  outputRefs?: ArtifactId[];
  creditsCharged?: number;
  modelInvocationIds?: string[];
  errorCode?: string | null;
  errorMessage?: string | null;
}

export interface SessionMetadata {
  jurisdiction?: string;
  role?: string;
  referrer?: string;
  deviceClass?: DeviceClass;
  [key: string]: unknown;
}

export interface RetentionPolicy {
  retainUntil: ISODateTime;
  basis: RetentionBasis;
}

export interface Session {
  id: SessionId;
  userId: UserId;
  organizationId?: OrgId | null;
  playbookId: PlaybookId;
  playbookVersion: SemVer;
  status: SessionStatus;
  startedAt: ISODateTime;
  completedAt?: ISODateTime | null;
  lastActivityAt: ISODateTime;
  currentStepId?: StepId | null;
  creditsCharged: number;
  stepExecutions: StepExecution[];
  metadata?: SessionMetadata;
  retentionPolicy?: RetentionPolicy;
}
