# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file is kept in English only; see
[docs/TRANSLATION.md](docs/TRANSLATION.md#layout) for why.

## [Unreleased]

## [0.6.0-alpha]

Everything the user sees — the interface, the context rules and every generated
text — was hardcoded in Spanish, so the project could only be read by Spanish
speakers even though its README was in English. This release makes the whole app
bilingual.

### Added

- **English/Spanish interface** with a switcher in the header. The choice is
  persisted, and `document.documentElement.lang` follows it.
- `src/i18n`: locale dictionaries, a pure `getTranslator` with `{param}`
  interpolation and array support, locale detection (stored choice → browser →
  Spanish), and a React provider.
- `contextRules.en.json` alongside `contextRules.es.json`, plus
  `src/data/rules.js` to resolve rules per locale.
- **Language-independent classification.** Each category is scored once per
  locale and the best match wins, so a Spanish prompt classifies correctly with
  the English UI and the other way round.
- Re-derivation of an on-screen analysis when the language changes, so the page
  is never left half-translated.
- An SVG favicon, plus meta and Open Graph tags and a `noscript` notice in
  `index.html`.
- `.editorconfig`, `.nvmrc`, `dependabot.yml` and an issue-template config.
- `npm run verify` (lint, format check, tests, build).
- `docs/TRANSLATION.md`, and Spanish counterparts for `CONTRIBUTING`,
  `SECURITY`, `SUPPORT`, `CODE_OF_CONDUCT`, `ROADMAP` and the workflow guide.

### Changed

- Logic modules take an optional `locale`, defaulting to Spanish, so existing
  behaviour is unchanged.
- Detection signals and regexes now cover English vocabulary as well.
- `scoreContext` returns a stable `levelId` used for the CSS class; the badge
  colour no longer depends on a translated label.
- The version badge is injected from `package.json` at build time instead of
  being written by hand in `App.jsx`, where it had drifted.
- `README.es.md` was rewritten: it had been frozen at v0.2 while the English one
  described v0.5.1.
- `docs/CODEX_WORKFLOW.md` became `docs/AI_WORKFLOW.md`, generalised beyond one
  specific assistant.
- Prettier was applied across the repository — it had been configured but never
  run — and both formatting and coverage are now enforced in CI.
- Coverage scope extended to the i18n engine and rule access.

### Fixed

- Missing accents throughout the Spanish output (`Auditoria` → `Auditoría`,
  `Que respondio bien` → `Qué respondió bien`, and similar).
- The completion level was shown twice, once translated and once as a raw enum
  id.
- Detected signals were shown in the wrong language when both locales scored a
  category equally. A Spanish prompt reported `n8n workflow` instead of
  `workflow n8n`, because ties were broken by insertion order; the active
  locale now wins a tie.
- `package-lock.json` still declared version `0.5.1-alpha`.
- `tools/classifier_manual_cases.py` expected outputs that the classifier no
  longer produces, in two of its three cases.

### Removed

- The `promptTemplate` and `explanation` rule fields, unused and present on only
  5 of the 15 rules.
- Dead default exports in `src/config.js` and `src/data/rules.js`, and an
  unnecessary `EXAMPLE_IDS` export.

### Tests

- 64 → 118, adding dictionary parity, rule schema parity and cross-language
  classification suites.

## [0.5.1-alpha]

Maintenance release that made the optional AI mode actually work and hardened
the tooling. No user-facing feature changes.

### Fixed

- **Anthropic model id** — replaced the non-existent `claude-haiku-3-5-20251001`
  with the valid `claude-haiku-4-5-20251001`; every Anthropic call was returning 404.
- **Anthropic CORS** — added the `anthropic-dangerous-direct-browser-access`
  header so direct browser calls are not blocked (local use only).
- **Groq model id** — replaced the decommissioned `llama3-8b-8192` with
  `openai/gpt-oss-20b`.
- **Gemini model id** — replaced the retired `gemini-1.5-flash` with
  `gemini-2.5-flash`.
- **Provider timeouts** — every provider fetch is wrapped in a 30s
  `AbortSignal.timeout`, so a hung provider falls back to local rules instead of
  leaving the UI waiting forever.

### Changed

- Pinned dependency versions (no more `"latest"`) and moved `vite` and
  `@vitejs/plugin-react` to `devDependencies` for reproducible installs.
- CI uses `npm ci` instead of `npm install`, and runs `npm run lint` before the
  build.

### Added

- ESLint (flat config with `eslint-plugin-react-hooks`) and Prettier, with
  `lint`, `format` and `format:check` scripts.

### Docs

- `SECURITY.md` updated for the optional AI mode and the API-key/build
  trade-off; explicit warnings added to `README.md` and `.env.example` about
  building for public deployment with keys in `.env`.

## [0.5.0-alpha]

### Added

- **Context autofill from reference material.** Paste a previous campaign,
  brief, email, client text or base documentation and the app extracts useful
  signals locally.
- Local extraction of audience, tone, call to action, format and constraints.
- An updated prompt carrying the inferred context.
- Reference material and filled context included in the Markdown export.

## [0.4.0-alpha]

### Added

- **AI response evaluator**, closing the first local feedback loop: paste the
  AI's answer back into the app after using the refined prompt.
- Evaluation of completeness, strengths, weak points and risks.
- A locally generated next prompt to continue the work.
- Evaluated response and next prompt included in the Markdown export.

## [0.3.0-alpha]

### Added

- **Missing-context auditor.** After classifying a prompt, the app highlights
  likely missing context.
- Explanation of the risk of asking an AI without each missing item.
- Practical clarification questions to ask before exporting or copying the
  refined prompt.
- The audit included in the Markdown export.

## [0.2]

### Added

- Diagnostic explanation for detected categories.
- Display of detected keywords and signals.
- Manual QA helper script in Python.
- GitHub Actions CI workflow.
- Contribution guidelines, MIT licence and issue templates.
- Public GitHub repository.

### Changed

- README structure and public documentation.
- Development workflow documentation.
- Classification transparency and the manual validation process.

## [0.1]

### Added

- Local-first React/Vite app.
- Rule-based prompt classification.
- Context quality scoring.
- Checklist generation.
- Prompt refinement.
- Markdown export.
