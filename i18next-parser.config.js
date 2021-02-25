module.exports = {
  lexers: {
    html: [{
      lexer: 'HandlebarsLexer',
      functions: ['t'],
    }],
  },
  locales: ['en'],
  output: './i18n-parsed/$LOCALE/$NAMESPACE.json',
  defaultNamespace: 'emails',
  useKeysAsDefaultValue: true,
  keySeparator: false,
  namespaceSeparator: ':|',
  createOldCatalogs: false,
  sort: true,
  input: ['src/templates/**/*.html'],
};
