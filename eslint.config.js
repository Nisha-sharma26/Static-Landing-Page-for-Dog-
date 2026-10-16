export default [
  {
    files: ['js/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        vi: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
    },
  },
];
