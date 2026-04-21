/**
 * @a2x/playbook-engine — public interface surface.
 *
 * This package is in stub state. Concrete implementations land in Phase 1
 * of the roadmap. The types exported here are the stable contract the API
 * and web layers will build against.
 */

import type {
  ArtifactId,
  ExpertId,
  LedgerEntryId,
  OrgId,
  Playbook,
  PlaybookId,
  SemVer,
  Session,
  SessionId,
  Step,
  StepExecution,
  StepId,
  UserId,
} from '@a2x/shared-types';

export interface PlaybookLoader {
  getById(id: PlaybookId, version?: SemVer): Promise<Playbook | null>;
  listPublished(filter?: { vertical?: string; jurisdiction?: string }): Promise<Playbook[]>;
}

export interface SessionStore {
  create(session: Session): Promise<Session>;
  get(id: SessionId): Promise<Session | null>;
  update(id: SessionId, patch: Partial<Session>): Promise<Session>;
  appendStepExecution(id: SessionId, exec: StepExecution): Promise<Session>;
}

export interface LedgerClient {
  /**
   * Debit credits from a user or org account for a session/step.
   * MUST be idempotent on `idempotencyKey` — duplicate calls must not double-charge.
   * Returns the ledger entry id and new balance.
   */
  debit(params: {
    accountId: UserId | OrgId;
    accountType: 'user' | 'organization';
    amount: number;
    sessionId: SessionId;
    playbookId: PlaybookId;
    stepId?: StepId;
    expertId?: ExpertId;
    idempotencyKey: string;
    description?: string;
  }): Promise<{ entryId: LedgerEntryId; balanceAfter: number }>;

  getBalance(
    accountId: UserId | OrgId,
    accountType: 'user' | 'organization',
  ): Promise<number>;
}

export interface ModelInvocationResult {
  invocationId: string;
  outputText: string;
  tokensIn: number;
  tokensOut: number;
  modelId: string;
  provider: 'anthropic' | 'openai' | 'other';
}

export interface ModelProvider {
  invoke(params: {
    systemPrompt: string;
    userPrompt: string;
    maxTokens?: number;
    sessionId: SessionId;
    stepId: StepId;
  }): Promise<ModelInvocationResult>;
}

export interface ArtifactRenderResult {
  artifactId: ArtifactId;
  s3Key: string;
  format: 'markdown' | 'docx' | 'pdf' | 'json' | 'csv';
  sizeBytes: number;
  sha256: string;
}

export interface ArtifactRenderer {
  render(params: {
    templateId: string;
    playbookId: PlaybookId;
    sessionId: SessionId;
    variables: Record<string, unknown>;
  }): Promise<ArtifactRenderResult>;
}

export interface AuditLogger {
  log(entry: {
    actor: string;
    action: string;
    targetType: string;
    targetId: string;
    at: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
}

export interface PlaybookEngineDeps {
  loader: PlaybookLoader;
  sessions: SessionStore;
  ledger: LedgerClient;
  model: ModelProvider;
  artifacts: ArtifactRenderer;
  audit: AuditLogger;
}

export interface StartSessionParams {
  userId: UserId;
  organizationId?: OrgId;
  playbookId: PlaybookId;
  playbookVersion?: SemVer;
}

export interface ExecuteStepParams {
  sessionId: SessionId;
  stepId: StepId;
  inputs?: Record<string, unknown>;
}

export interface PlaybookEngine {
  startSession(params: StartSessionParams): Promise<Session>;
  getNextStep(sessionId: SessionId): Promise<Step | null>;
  executeStep(params: ExecuteStepParams): Promise<StepExecution>;
  completeSession(sessionId: SessionId): Promise<Session>;
  abandonSession(sessionId: SessionId, reason?: string): Promise<Session>;
}

/**
 * Factory — wires deps into a PlaybookEngine instance.
 * Concrete implementation lands in Phase 1.
 */
export function createPlaybookEngine(_deps: PlaybookEngineDeps): PlaybookEngine {
  throw new Error('createPlaybookEngine: not yet implemented (stub package). See ROADMAP Phase 1.');
}
