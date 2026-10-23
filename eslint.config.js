// ESLint flat config for the workspace (ESLint 9+ no longer reads .eslintrc).
// Each app's `lint` script runs `eslint src`; ESLint finds this file by
// walking up from the app directory.
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // A leading underscore marks a parameter that must exist for its position,
    // e.g. Express only treats a 4-argument middleware as an error handler.
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['apps/api/**/*.ts', 'packages/**/*.ts', 'scripts/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
);
