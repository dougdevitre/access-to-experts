/**
 * Access To Experts — API server entry.
 *
 * Stub: boots Express with health + readiness + placeholder routes.
 * Route handlers land in Phase 1. Surface is specified in
 * docs/architecture/api-routes.md.
 */

import cors from 'cors';
import express, { type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';

import { loadConfig } from './config.js';
import { logger } from './logger.js';
import { problem } from './errors.js';
import { registerRoutes } from './routes/index.js';

async function main(): Promise<void> {
  const config = await loadConfig();

  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsAllowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));

  // Liveness — process is up.
  app.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Readiness — dependencies reachable (DynamoDB, S3, SSM).
  app.get('/readyz', async (_req, res) => {
    // TODO: check DynamoDB, S3, SSM, Stripe in Phase 1.
    res.status(200).json({ status: 'ready' });
  });

  registerRoutes(app);

  // 404 handler (JSON, RFC 7807 shape).
  app.use((req: Request, res: Response) => {
    res.status(404).json(
      problem({
        type: 'https://accesstoexperts.org/problems/not-found',
        title: 'Not Found',
        status: 404,
        detail: `No route matches ${req.method} ${req.path}`,
      }),
    );
  });

  // Error handler.
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err, path: req.path }, 'Unhandled error');
    res.status(500).json(
      problem({
        type: 'https://accesstoexperts.org/problems/internal',
        title: 'Internal Server Error',
        status: 500,
      }),
    );
  });

  const port = config.port;
  app.listen(port, () => {
    logger.info({ port, env: config.env }, 'A2X API listening');
  });
}

main().catch((err) => {
  logger.fatal({ err }, 'Failed to start API');
  process.exit(1);
});
