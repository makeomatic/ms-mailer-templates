# Templates for Mailer Microservice

[![Build Status](https://semaphoreci.com/api/v1/makeomatic/ms-mailer-templates/branches/master/shields_badge.svg)](https://semaphoreci.com/makeomatic/ms-mailer-templates)

Uses foundation ink by zurb for creating basic responsive styles. By default includes the most simple
templates for account activation and password reset.

## Installation

`npm i ms-mailer-templates -S`

## Usage

```js
const render = require('ms-mailer-templates');

const ctx = { link: 'http://localhost', qs: '?token=xxxxx', username: 'Indiana Johns' };
render('activate', ctx,  optionalHandlebarsOpts )
  .then(template => {
    // get rendered template
  });
```

It checks for incorrect context, missing template and so on

## i18n

The package uses [`i18next`](https://i18next.com) library to provide translations.

### Usage

Provide `lng` option among other context options to specify destination language when rendering templates.
The following code will return html for `activate` email template translated into german.
```js
const render = require('ms-mailer-templates');

render('activate', { lng: 'de' })
  .then(translatedTemplate => {
    ...
  });
```

### Translation helper

Package exports a simple translation helper as a property of the default export.

```js
render.translate(key, { lng, ...rest });
```

Where `key` is the key of the string to be translated, `lng` - target language, `rest` - other translation context options

Usage example:

```js
const render = require('ms-mailer-templates');

// returns translated string when translation is available 
// for 'de' language and 'custom' namespace
const txt = render.translate('custom:|Count {{count}}', { lng: 'de', count: 10 });
```

### Guides

To add i18n support for existing or new templates one must wrap strings to be translated into `t` handlebars helper.

```handlebars
<div>
  {{t "String to translate"}}
</div>
```

### Namespaces

Default package's i18n namespace is `emails`. All strings fall into this namespace unless
specifically stated otherwise. When one has separate translation project they 
can put their own strings into separate namespace. `:|` works as the namespace
separator.

```handlebars
<span>{{t "my-own-ns:|something to be translated"}}</span>
```

Then add your newly created namespace to the list of supported namespaces in `src/i18n.js` file:

```js
const SUPPORTED_NAMESPACES = [
  'emails',
  'your-new-namespace',
  ...
]
```

The package uses `en` locale as a reference and fallbacks to the key contents when no translation is provided.

### Parsing

All strings wrapped with `t` helper will be parsed into `en` locale.

Command
```shell
yarn i18n:parse
```
will parse all `src/templates/**/*.html` files and store all collected strings under
`i18n-parsed` directory with structure as follows:

```.
...
└──i18n-parsed
   └──en
      ├── emails.json
      └── custom-namespace.json
```

### Translations

All translated resources must be provided as flat `json` files under `i18n` directory
following the `i18n/{{language}}{{namespace}}.json` filename template.

```.
...
└──i18n
   ├──en
   │   ├── emails.json
   │   └── custom-namespace.json
   ├──de
   │   ├── emails.json
   │   └── custom-namespace.json
   │   ...
```

## Existing templates

### General

  1. `password`
  1. `reset`

### Radio FX

  1. `activate`
  1. `invite`
  1. `report-problem`
  1. `request-invite`
  1. `support-contact`

### StreamLayer

  1. `accept-invite`
  1. `add-member-notify`
  1. `feedback`
  1. `registration-notify`
  1. `password-reset`

## Roadmap

1. Add more templates
