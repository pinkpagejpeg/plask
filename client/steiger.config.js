import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
    ...fsd.configs.recommended,
    {
        files: ['./src/shared/lib/redux/**'],
        rules: {
            'fsd/forbidden-imports': 'off',
        },
    },
    {
        ignores: ['./src/shared/lib/redux/**'],
    },
])