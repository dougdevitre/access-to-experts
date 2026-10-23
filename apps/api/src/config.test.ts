import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadConfig } from './config.js';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('loadConfig (local)', () => {
  it('uses the local defaults without calling SSM', async () => {
    vi.stubEnv('A2X_ENV', 'local');
    const config = await loadConfig();
    expect(config.env).toBe('local');
    expect(config.sessionsTable).toBe('a2x-local-sessions');
    expect(config.ledgerTable).toBe('a2x-local-ledger');
  });

  it('reads the port and a comma-separated CORS list from the environment', async () => {
    vi.stubEnv('A2X_ENV', 'local');
    vi.stubEnv('PORT', '4100');
    vi.stubEnv('CORS_ALLOWED_ORIGINS', 'http://a.test,http://b.test');
    const config = await loadConfig();
    expect(config.port).toBe(4100);
    expect(config.corsAllowedOrigins).toEqual(['http://a.test', 'http://b.test']);
  });
});
