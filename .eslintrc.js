module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'warn',
    semi: ['warn'], // 세미콜론 사용
    'array-element-newline': ['off'], // 배열 요소 관련 무시
    quotes: [
      'warn',
      'single',
      {
        avoidEscape: false,
      },
    ], // ', `만 허용
    eqeqeq: ['warn', 'allow-null'], // == 금지
    'no-empty': [
      'warn',
      {
        allowEmptyCatch: false,
      },
    ], // 빈 catch 금지
    'eol-last': 'warn', // 파일 끝에 개행문자가 없을 경우 경고
    'no-multiple-empty-lines': [
      'warn',
      {
        max: 1,
        maxEOF: 0,
      },
    ], // 빈줄 최대 1개
    'space-before-blocks': ['warn', 'always'], // 블록 앞에 공백을 강제
    'object-curly-newline': [
      'warn',
      {
        ObjectPattern: { multiline: true },
        ImportDeclaration: { multiline: true, minProperties: 4 },
        ExportDeclaration: { multiline: true, minProperties: 4 },
      },
    ],
    'object-curly-spacing': ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'max-len': [
      // 한줄의 최대 길이
      'warn',
      {
        code: 150,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
      },
    ],
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'prefer-const': 'warn',
    // unix(default): LF, windows: CRLF
    // Reference: https://eslint.org/docs/latest/rules/linebreak-style
    'linebreak-style': ['error', 'unix'],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn"
  },
};
