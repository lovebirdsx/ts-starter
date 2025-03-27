import js from '@eslint/js'
import tsEslint from 'typescript-eslint'

import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tsEslint.config({
    extends: [
        js.configs.recommended,
        ...tsEslint.configs.recommended,
        eslintConfigPrettier,
        eslintPluginPrettierRecommended,
    ],
    files: ['**/*.{ts,tsx}'],
    ignores: ['out', 'node_modules'],
    languageOptions: {
        ecmaVersion: 2022,
    },
    plugins: {
    },
    rules: {
    },
})
