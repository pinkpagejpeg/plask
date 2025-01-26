import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'script',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
  pluginJs.configs.recommended
]