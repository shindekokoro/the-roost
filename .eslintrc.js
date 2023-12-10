module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: { react: { version: '18.2' } },
  plugins: ['react', 'react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/prop-types': 0,
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'comma-dangle': ['error', 'never'],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'no-unused-vars': [
      'warn',
      {
        args: 'none',
      },
    ],
  },
};
