import { describe, expect, it } from 'vitest';
import { HttpError, problem } from './errors.js';

describe('problem', () => {
  it('returns the RFC 7807 body unchanged', () => {
    const body = { type: 'https://accesstoexperts.org/problems/not-found', title: 'Not Found', status: 404 };
    expect(problem(body)).toEqual(body);
  });
});

describe('HttpError', () => {
  it('is an Error whose message is the title', () => {
    const err = new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Not Implemented');
  });

  it('converts to a problem body with its status, type, title and detail', () => {
    const err = new HttpError(409, 'https://accesstoexperts.org/problems/conflict', 'Conflict', 'Already exists');
    expect(err.toProblem()).toEqual({
      type: 'https://accesstoexperts.org/problems/conflict',
      title: 'Conflict',
      status: 409,
      detail: 'Already exists',
    });
  });
});
