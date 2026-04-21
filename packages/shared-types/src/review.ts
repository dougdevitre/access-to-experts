import type { ExpertId, ISODateTime, ReviewId, SemVer, SessionId, UserId } from './common.js';

export type ReviewKind =
  | 'user-playbook-review'
  | 'expert-peer-review'
  | 'institutional-review'
  | 'regulatory-review';

export type ReviewTargetType = 'playbook' | 'expert' | 'session-outcome';

export type ReviewStatus = 'submitted' | 'under-moderation' | 'published' | 'hidden' | 'removed';

export type ReviewFlag =
  | 'outdated-information'
  | 'jurisdictional-concern'
  | 'regulatory-concern'
  | 'safety-concern'
  | 'accessibility-concern'
  | 'factual-error'
  | 'content-quality'
  | 'other';

export type PeerReviewDecision =
  | 'approve'
  | 'approve-with-changes'
  | 'request-revision'
  | 'reject';

export interface OutcomeRating {
  clarity?: number;
  accuracy?: number;
  helpfulness?: number;
  wouldRecommend?: boolean;
}

export interface Review {
  id: ReviewId;
  kind: ReviewKind;
  targetType: ReviewTargetType;
  targetId: string;
  playbookVersion?: SemVer | null;
  sessionId?: SessionId | null;
  authorUserId: UserId;
  authorExpertId?: ExpertId | null;
  rating?: number | null;
  outcomeRating?: OutcomeRating;
  reviewText?: string;
  flags?: ReviewFlag[];
  peerReviewDecision?: PeerReviewDecision | null;
  peerReviewNotes?: string;
  status: ReviewStatus;
  verifiedCompletion?: boolean;
  moderationNotes?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  publishedAt?: ISODateTime | null;
}
