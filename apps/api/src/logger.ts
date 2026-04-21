import pino from 'pino';

/**
 * Structured logger.
 *
 * Never log raw request bodies for routes that carry PII (sessions, auth).
 * Use the redact config to drop known-sensitive paths. Consumers should
 * attach requestId and userId via child loggers.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.A2X_ENV === 'prod' ? 'info' : 'debug'),
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.inputs',
      '*.apiKey',
      '*.secret',
      '*.token',
    ],
    remove: true,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
