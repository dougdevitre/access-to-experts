/**
 * Config loader. Resolves all secrets from AWS SSM Parameter Store.
 *
 * Never read secrets from process.env directly in production code paths —
 * this module is the single allowed boundary. Local dev falls back to
 * process.env only when A2X_ENV === 'local'.
 */

import { SSMClient, GetParametersByPathCommand } from '@aws-sdk/client-ssm';

export interface Config {
  env: 'local' | 'dev' | 'staging' | 'prod';
  port: number;
  region: string;
  corsAllowedOrigins: string[];
  anthropicApiKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  sessionsTable: string;
  ledgerTable: string;
  artifactsBucket: string;
  playbooksBucket: string;
}

export async function loadConfig(): Promise<Config> {
  const env = (process.env.A2X_ENV ?? 'local') as Config['env'];
  const port = Number.parseInt(process.env.PORT ?? '4000', 10);
  const region = process.env.AWS_REGION ?? 'us-east-2';

  if (env === 'local') {
    return {
      env,
      port,
      region,
      corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:5173').split(','),
      anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
      stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
      sessionsTable: process.env.DYNAMO_SESSIONS_TABLE ?? 'a2x-local-sessions',
      ledgerTable: process.env.DYNAMO_LEDGER_TABLE ?? 'a2x-local-ledger',
      artifactsBucket: process.env.S3_ARTIFACTS_BUCKET ?? 'a2x-local-artifacts',
      playbooksBucket: process.env.S3_PLAYBOOKS_BUCKET ?? 'a2x-local-playbooks',
    };
  }

  const ssm = new SSMClient({ region });
  const path = `/a2x/${env}/`;
  const params: Record<string, string> = {};
  let nextToken: string | undefined;

  do {
    const res = await ssm.send(
      new GetParametersByPathCommand({
        Path: path,
        Recursive: true,
        WithDecryption: true,
        NextToken: nextToken,
      }),
    );
    for (const p of res.Parameters ?? []) {
      if (p.Name && p.Value !== undefined) params[p.Name] = p.Value;
    }
    nextToken = res.NextToken;
  } while (nextToken);

  const get = (key: string, required = true): string => {
    const full = `${path}${key}`;
    const v = params[full];
    if (!v && required) throw new Error(`Missing SSM parameter: ${full}`);
    return v ?? '';
  };

  return {
    env,
    port,
    region,
    corsAllowedOrigins: get('cors/allowed-origins').split(','),
    anthropicApiKey: get('anthropic/api-key'),
    stripeSecretKey: get('stripe/secret-key'),
    stripeWebhookSecret: get('stripe/webhook-secret'),
    sessionsTable: get('dynamo/sessions-table'),
    ledgerTable: get('dynamo/ledger-table'),
    artifactsBucket: get('s3/artifacts-bucket'),
    playbooksBucket: get('s3/playbooks-bucket'),
  };
}
