# Contributing to ContextForge

**English** · [Español](CONTRIBUTING.es.md)

Thanks for your interest. Contributions are welcome in either English or
Spanish — issues, pull requests and comments in Spanish are perfectly fine.

## Development philosophy

ContextForge is built through small, verifiable and documented changes. Before
modifying anything:

1. Diagnose first.
2. Prefer the smallest safe change.
3. Validate manually in the browser, not only through tests.
4. Document decisions that are not obvious.
5. Keep the app local-first.
6. Avoid unnecessary complexity.

## Setup

Node.js 20.19 or newer (see [`.nvmrc`](.nvmrc)).

```bash
npm install
npm run dev
```

## Before opening a pull request

```bash
npm run verify
```

That runs lint, the formatting check, the tests and the build — exactly what CI
runs. A pull request that fails `verify` will fail CI.

## Rules specific to this project

### Every user-facing string goes in both languages

Interface text and generated text live in `src/i18n/locales/es.js` and
`en.js`, under identical keys. Read them with `t('some.key')`; never write a
string inline in a component.

`tests/i18n.test.js` fails if the dictionaries drift apart.

### Every context rule goes in both languages

New categories go in `src/data/contextRules.es.json` **and**
`contextRules.en.json`, with the same `id` and in the same position.
`tests/rules.test.js` enforces it.

### Detection signals are multilingual

Regexes and token lists that inspect the **user's text** live in `src/logic/`
and deliberately mix both languages in one list, because the prompt language is
independent of the interface language. Watch for substring collisions when
adding English tokens.

[docs/TRANSLATION.md](docs/TRANSLATION.md) covers all of this in detail.

## Pull request guidelines

- Keep pull requests focused; do not mix unrelated features.
- Explain why the change exists, not only what it does.
- Include manual validation when the change is visible.
- Prefer readable code over clever code.
- Match the surrounding style: the source comments in this repository are in
  Spanish, the contributor-facing files in English.

## Where help is most useful

- Classification heuristics and false-positive reduction.
- New context categories.
- Accessibility.
- Automated tests.
- UI and UX improvements.
- Documentation, in either language.

## What to avoid

- Large rewrites without discussing them first.
- New dependencies without a clear justification.
- Turning the app into a backend-heavy architecture.
- Committing secrets or credentials of any kind.

## Manual QA helper

`tools/classifier_manual_cases.py` lists manual validation cases and their
expected results. It does not connect to the app and does not duplicate the
classifier logic.

```bash
python tools/classifier_manual_cases.py
```

## Reporting security issues

Do not open a public issue. See [SECURITY.md](SECURITY.md).
