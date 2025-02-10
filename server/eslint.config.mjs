import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginJest from 'eslint-plugin-jest'

/** @type {import('eslint').Linter.FlatESLintConfig[]} */
export default [
  pluginJs.configs.recommended, 
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 'latest',
      sourceType: 'script',
    },
    plugins: {
      jest: pluginJest,
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  }
]
