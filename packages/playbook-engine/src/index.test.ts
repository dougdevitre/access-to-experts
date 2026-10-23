import { describe, expect, it } from 'vitest';
import { createPlaybookEngine, type PlaybookEngineDeps } from './index.js';

describe('createPlaybookEngine', () => {
  it('fails loudly while the package is a stub, instead of returning a half-working engine', () => {
    expect(() => createPlaybookEngine({} as PlaybookEngineDeps)).toThrow(/not yet implemented/);
  });
});
