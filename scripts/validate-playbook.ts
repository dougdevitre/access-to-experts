#!/usr/bin/env node
/**
 * Playbook validator.
 *
 * Validates one or more playbook JSON files against the canonical schema
 * at schemas/playbook.schema.json. Used locally, in CI, and by the
 * expert authoring skill.
 *
 * Usage:
 *   tsx scripts/validate-playbook.ts schemas/examples/playbook-simple.json
 *   tsx scripts/validate-playbook.ts schemas/examples/*.json
 *
 * Exit codes:
 *   0  all files valid
 *   1  one or more files invalid
 *   2  invocation error (missing file, bad schema)
 */

import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
// The schemas declare JSON Schema draft 2020-12, which the default `ajv`
// export (draft-07) does not know; the 2020 build does.
import { Ajv2020, type ErrorObject, type SchemaObject, type ValidateFunction } from 'ajv/dist/2020.js';
import addFormatsModule from 'ajv-formats';

// ajv-formats is CommonJS; under NodeNext its default import is the module
// object, so take the plugin from its `default` export.
const addFormats = addFormatsModule.default;

const SCHEMA_PATH = resolve(process.cwd(), 'schemas/playbook.schema.json');

interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: ErrorObject[];
}

function loadSchema(): SchemaObject {
  try {
    return JSON.parse(readFileSync(SCHEMA_PATH, 'utf8')) as SchemaObject;
  } catch (err) {
    console.error(`Could not read schema at ${SCHEMA_PATH}: ${(err as Error).message}`);
    process.exit(2);
  }
}

function validateFile(validate: ValidateFunction, file: string): ValidationResult {
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    return {
      file,
      valid: false,
      errors: [
        {
          instancePath: '',
          schemaPath: '',
          keyword: 'parse',
          params: {},
          message: `JSON parse error: ${(err as Error).message}`,
        },
      ],
    };
  }

  const valid = validate(data);
  return { file, valid, errors: valid ? undefined : [...(validate.errors ?? [])] };
}

function reportError(err: ErrorObject): string {
  const path = err.instancePath || '(root)';
  return `  ${path} — ${err.message ?? 'invalid'}`;
}

function main(): void {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: tsx scripts/validate-playbook.ts <file.json> [...]');
    process.exit(2);
  }

  const schema = loadSchema();
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const results = files.map((f) => validateFile(validate, resolve(f)));
  const failed = results.filter((r) => !r.valid);

  for (const r of results) {
    const rel = relative(process.cwd(), r.file);
    if (r.valid) {
      console.log(`✓ ${rel}`);
    } else {
      console.log(`✗ ${rel}`);
      for (const e of r.errors ?? []) {
        console.log(reportError(e));
      }
    }
  }

  console.log('');
  console.log(`${results.length - failed.length}/${results.length} valid`);
  process.exit(failed.length === 0 ? 0 : 1);
}

main();
