import type { ProblemDetails } from '@a2x/shared-types';

export function problem(p: ProblemDetails): ProblemDetails {
  return p;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly type: string,
    public readonly title: string,
    public readonly detail?: string,
  ) {
    super(title);
  }

  toProblem(): ProblemDetails {
    return { type: this.type, title: this.title, status: this.status, detail: this.detail };
  }
}
