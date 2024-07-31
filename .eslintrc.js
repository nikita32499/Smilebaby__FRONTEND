module.exports = {
    extends: ['plugin:@typescript-eslint/recommended'],
    plugins: ['@typescript-eslint', 'custom-rules'],
    // root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    parser: '@typescript-eslint/parser',
    rules: {
        '@typescript-eslint/no-unused-vars': 0,
        'custom-rules/strict-enum': 'error',
        'custom-rules/fsd-import': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        //prefer-const
        // 'no-console': 'error',
        // 'react/react-in-jsx-scope': 'off',
        // 'react/prop-types': 'off',
        // 'simple-import-sort/sort': 'error',
        // 'unicorn/filename-case': 'off',

        // 'unused-imports/no-unused-imports-ts': 'on',
    },
    // ignorePatterns: ['node_modules', 'eslint-plugin-custom-rules', '.eslintrc.js'],
};
