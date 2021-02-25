const i18next = require('i18next');
const { join } = require('path');
const { readdirSync, lstatSync } = require('fs');
const fsBackend = require('i18next-fs-backend');

const i18nPath = join(__dirname, '../i18n');
const SUPPORTED_NAMESPACES = [
  'emails', // default
];

module.exports = (function initI18n() {
  i18next
    .use(fsBackend)
    .init({
      initImmediate: false,
      fallbackLng: 'en',
      nsSeparator: ':|',
      ns: SUPPORTED_NAMESPACES,
      defaultNS: 'emails',
      preload: readdirSync(i18nPath).filter((fileName) => lstatSync(join(i18nPath, fileName)).isDirectory()),
      backend: {
        loadPath: join(__dirname, '../i18n/{{lng}}/{{ns}}.json'),
      },
    });

  return i18next;
}());
