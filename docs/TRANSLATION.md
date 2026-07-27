# Translation guide

**English** · [Español](TRANSLATION.es.md)

How ContextForge stays bilingual, and what you have to touch when you add or
change a user-facing string.

## Why one repository and not two

A recurring question is whether a bilingual project should live in two
repositories, one per language. It should not. One repository, one branch, both
languages side by side.

Two repositories look tidy on day one and rot by week three:

- They drift. A fix lands in one and never in the other, and there is nothing to
  detect it.
- They split the project's identity: two issue trackers, two sets of stars, two
  CI configurations, two release histories.
- They double the maintenance of everything that has nothing to do with
  language — dependencies, workflows, licence, security policy.
- They force contributors to pick a side before they can help.

The convention across open source is a single repository with `README.md` in
English as the default entry point and `README.<lang>.md` beside it, linked by a
language bar at the top of each file. That is what this project does.

The same reasoning applies inside the app: one build serving both languages,
not one build per language.

## Layout

```text
README.md            English, default entry point
README.es.md         Spanish

CONTRIBUTING.md      + CONTRIBUTING.es.md
SECURITY.md          + SECURITY.es.md
SUPPORT.md           + SUPPORT.es.md
CODE_OF_CONDUCT.md   + CODE_OF_CONDUCT.es.md
docs/*.md            + docs/*.es.md

CHANGELOG.md         English only — see below
```

Every translated document opens with a language bar, with the current language
in bold:

```markdown
**English** · [Español](FILE.es.md)
```

`CHANGELOG.md` is deliberately single-language. It is an append-only technical
record read by maintainers; translating it doubles the work on every release and
its entries reference code identifiers that are not translated anyway.

## In the app

Three places hold user-facing text. All three must be updated together.

### 1. Interface and generated text — `src/i18n/locales/`

`es.js` and `en.js` are nested dictionaries with identical key structures. Add
your key to both:

```text
// es.js                                  // en.js
audit: {                                  audit: {
  title: 'Qué conviene aclarar             title: 'What to clarify
          antes de consultar a la IA',            before asking the AI',
}                                         }
```

Read it through the translator, never inline:

```jsx
const { t } = useI18n();
<h2>{t('audit.title')}</h2>;
```

Placeholders use `{name}`:

```js
confidence: '{value}% confidence';
t('result.confidence', { value: 72 }); // "72% confidence"
```

A key can hold an array; every element is interpolated:

```js
conditions: ['Prioritize what matters most.', 'Return concrete steps.'];
```

**`tests/i18n.test.js` fails if the two dictionaries have different keys,
different types for the same key, or an empty string.** That test is the reason
translations do not silently drift.

### 2. Context rules — `src/data/contextRules.{es,en}.json`

Both files hold the same category `id`s in the same order, with translated text
and each language's own `keywords`. `tests/rules.test.js` enforces the shared
schema, the shared ids, and that labels are actually translated rather than
copied.

Keywords are the one field that is genuinely per-language: they are matched
against what the user types.

### 3. Detection signals — inside `src/logic/`

Regexes and token lists that inspect the **user's own text** (not interface
text) are deliberately multilingual within a single list, because the prompt
language is independent of the interface language:

```text
const automationSignalKeywords = [
  'webhook', 'flujo', 'trigger', 'automatiz',   // es
  'workflow', 'automat', 'pipeline',            // en
];
```

Watch for substring collisions when adding English tokens. `flow` had to be
removed from the automation keywords because `includes('flow')` also matches
`workflow`, which let the generic automation category outscore the more
specific n8n one.

## How classification stays language-independent

Each category is scored once per language, against that language's keyword list,
and the best-scoring variant wins. The winning category is then rendered in the
interface language.

Scoring per variant rather than merging every language's keywords into one bag
matters: the confidence figure is the score divided by the category's
theoretical maximum, so a merged bag would grow the denominator with each
language added and quietly deflate the confidence of prompts in every other
language.

## Adding a third language

1. Copy `src/i18n/locales/en.js` to `<code>.js` and translate the values.
2. Register it in `DICTIONARIES` in `src/i18n/index.js`.
3. Copy `src/data/contextRules.en.json` to `contextRules.<code>.json`, translate
   the text and replace the keywords with that language's vocabulary.
4. Register it in `RULES_BY_LOCALE` in `src/data/rules.js`.
5. Add that language's tokens to the detection lists in `src/logic/`.
6. Add the `README.<code>.md` and the language bar entry to every translated
   document.
7. Run `npm run verify`. The parity tests will tell you what is missing —
   `SUPPORTED_LOCALES` is asserted explicitly, so update that assertion too.

The switcher in the header renders every entry of `SUPPORTED_LOCALES`
automatically; no component change is needed.

## Checklist before opening a pull request

- [ ] New strings added to **both** `es.js` and `en.js`
- [ ] New rules added to **both** `contextRules.es.json` and `.en.json`
- [ ] New detection tokens cover both languages, with no substring collisions
- [ ] Documentation changes mirrored in the `.es.md` counterpart
- [ ] `npm run verify` passes
