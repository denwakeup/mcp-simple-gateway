import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[] | import('typescript-eslint').Config} */
export default [
  {
    ignores: ['**/dist/', 'coverage'],
  },
  {
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          pathGroupsExcludedImportTypes: ['builtin'],
          groups: [
            ['builtin'],
            ['external'],
            ['internal'],
            ['parent'],
            ['sibling', 'index'],
          ],
          'newlines-between': 'always',
        },
      ],
      'import/newline-after-import': 'error',
      'no-console': 'error',
    },
  },
];
