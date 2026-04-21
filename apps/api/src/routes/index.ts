import type { Express } from 'express';
import { HttpError } from '../errors.js';

/**
 * Route registration. Handlers are stubs until Phase 1.
 * Full surface specified in docs/architecture/api-routes.md.
 */
export function registerRoutes(app: Express): void {
  // Playbook discovery
  app.get('/v1/playbooks', (_req, res, next) => next(new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented')));
  app.get('/v1/playbooks/:id', (_req, res, next) => next(new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented')));

  // Sessions
  app.post('/v1/sessions', (_req, res, next) => next(new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented')));
  app.get('/v1/sessions/:id', (_req, res, next) => next(new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented')));
  app.post('/v1/sessions/:id/steps/:stepId', (_req, res, next) => next(new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented')));

  // Credits & billing
  app.get('/v1/credits/balance', (_req, res, next) => next(new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented')));
  app.post('/v1/billing/checkout', (_req, res, next) => next(new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented')));

  // Experts
  app.get('/v1/experts/:id', (_req, res, next) => next(new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented')));

  // Webhooks
  app.post('/v1/webhooks/stripe', (_req, res, next) => next(new HttpError(501, 'https://accesstoexperts.org/problems/not-implemented', 'Not Implemented')));
}
