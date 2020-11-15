module.exports = {
    arrowParens: 'always',
    bracketSpacing: true,
    editorconfig: true,
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
            },
        },
    ],
    printWidth: 120,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    tabWidth: 4,
};
