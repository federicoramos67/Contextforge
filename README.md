# ContextForge

**English** · [Español](README.es.md)

[![CI](https://github.com/federicoramos67/Contextforge/actions/workflows/ci.yml/badge.svg)](https://github.com/federicoramos67/Contextforge/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Languages: EN + ES](https://img.shields.io/badge/i18n-EN%20%2B%20ES-7da1ff)](#language-support)

> Decide what to give an AI **before** you ask it anything.

ContextForge reads a need written in plain language and tells you which files,
formats, examples and constraints are worth sharing with an AI to get a usable
answer. It runs entirely in your browser on local rules, with an optional AI
mode you configure yourself.

**▶️ [Live demo](https://federicoramos67.github.io/Contextforge/)**

The public demo runs in **rules mode**, which needs no API key. The optional AI
mode requires your own provider key, stored in your browser's `localStorage`
and never sent to any ContextForge server.

---

## Contents

- [The problem](#the-problem)
- [What you get](#what-you-get)
- [Language support](#language-support)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [AI mode and API keys](#ai-mode-and-api-keys)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [Current limitations](#current-limitations)
- [Documentation](#documentation)
- [License](#license)

## The problem

Most people know how to ask an AI a question. Fewer know what to hand it along
with the question — and that is usually what decides whether the answer is
useful.

ContextForge is not another assistant. It is the layer before one: it helps you
work out whether to share plain text, source code, logs, screenshots, exported
JSON, a CSV, a PDF, structured examples, or the constraints the answer has to
respect.

## What you get

Give it a prompt such as:

```text
I need to fix an n8n workflow that fails when a webhook arrives.
```

and you get back:

| Output                    | What it is                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------ |
| **Category**              | One of 15 categories, with a confidence estimate                                     |
| **Recommended format**    | The primary material to share, plus useful extras                                    |
| **What to avoid**         | The mistakes that typically waste a round trip                                       |
| **Why**                   | Which signals in your text triggered the category                                    |
| **Context score**         | A 0–100 rating of your prompt with concrete improvements                             |
| **Checklist**             | What to gather before you ask                                                        |
| **Missing-context audit** | Likely gaps, the risk of each, and questions to close them                           |
| **Refined prompt**        | A rewritten prompt, ready to copy                                                    |
| **Context autofill**      | Paste reference material and it extracts audience, tone, CTA, format and constraints |
| **Response evaluator**    | Paste the AI's answer back and get its weak points plus a follow-up prompt           |
| **Markdown export**       | The whole report as a file                                                           |

Every one of these is produced locally, by rules, with no network call.

## Language support

The interface, the context rules and every generated text exist in **English
and Spanish**, switchable from the header at any time. Switching re-renders an
analysis already on screen, so the page never ends up half-translated.

Two details worth knowing:

- **Your prompt's language is independent of the interface language.** Each
  category is scored against every language's keyword list and the best match
  wins, so a Spanish prompt classifies correctly with the English UI, and the
  other way round.
- **The initial language** comes from your stored choice, then your browser's
  language, then Spanish as the fallback.

Documentation lives in the same repository in both languages: every English
document has a `.es.md` counterpart, linked from a language bar at the top.
See [docs/TRANSLATION.md](docs/TRANSLATION.md) for how the two are kept in sync
and how to add a third language.

## Quick start

Requires Node.js 20.19 or newer (see [`.nvmrc`](.nvmrc)).

```bash
git clone https://github.com/federicoramos67/Contextforge.git
cd Contextforge
npm install
npm run dev
```

Then open the URL Vite prints, usually `http://localhost:5173/Contextforge/`.

### Scripts

| Command            | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Development server with hot reload                 |
| `npm run build`    | Production build into `dist/`                      |
| `npm run preview`  | Serve the production build locally                 |
| `npm test`         | Run the test suite                                 |
| `npm run coverage` | Tests with a coverage report                       |
| `npm run lint`     | ESLint                                             |
| `npm run format`   | Format the repository with Prettier                |
| `npm run verify`   | Lint, format check, tests and build — what CI runs |

> [!WARNING]
> Never build for a public deployment with keys in `.env`. Vite inlines every
> `VITE_*` variable into the generated bundle, so any key present at build time
> ends up readable in the published JavaScript. Build **without** a `.env`: the
> rules mode needs no keys. See [SECURITY.md](SECURITY.md).

## How it works

```text
prompt ─▶ classifyPrompt ─▶ generateAdvice ──▶ recommendation
              │                   │
              │                   ├─▶ scoreContext ────▶ 0–100 score + fixes
              │                   ├─▶ auditMissingContext ─▶ gaps, risks, questions
              │                   └─▶ generateRefinedPrompt ─▶ prompt to copy
              │
              └─(AI mode)─▶ classifyWithAI ─▶ falls back to local rules on failure

reference material ─▶ autofillContextFromReference ─▶ inferred context
AI's answer ───────▶ evaluateAIResponse ───────────▶ weak points + next prompt
everything ────────▶ buildMarkdownReport ──────────▶ exportable report
```

Each logic module is a pure function taking an optional `locale`, which is what
makes the whole pipeline testable without rendering the app.

## AI mode and API keys

Rules mode is the default and needs nothing. AI mode is opt-in and supports
Ollama, Groq, Mistral, Gemini, Anthropic and OpenAI. When a provider fails or
times out (30s), the app falls back to local rules and tells you why.

Keys entered through the UI are kept in your browser's `localStorage`. Keys in
`.env` are read at build time — read the warning above before deploying.

Copy [`.env.example`](.env.example) to `.env` for local use.

## Project structure

```text
contextforge/
├─ .github/            workflows, issue and PR templates, dependabot
├─ docs/               roadmap, workflow and translation guide
├─ public/             static assets served as-is
├─ src/
│  ├─ components/      presentational React components
│  ├─ constants/       examples, provider fields, version
│  ├─ data/            contextRules.{es,en}.json + per-locale access
│  ├─ hooks/           useAnalysis — orchestration and analysis state
│  ├─ i18n/            dictionaries, translator, locale detection, provider
│  ├─ logic/           pure business logic, one module per step
│  ├─ App.jsx          layout and app-level state
│  └─ style.css        styles
├─ tests/              Vitest suites for logic, i18n and rules
└─ tools/              Python helper listing manual QA cases
```

## Contributing

Contributions are welcome, in English or Spanish. Read
[CONTRIBUTING.md](CONTRIBUTING.md) ([español](CONTRIBUTING.es.md)) first.

Two rules specific to this project:

1. Every user-facing string goes in **both** `src/i18n/locales/es.js` and
   `en.js`. A test fails if the two dictionaries drift apart.
2. Every new context rule goes in **both** `contextRules.es.json` and
   `contextRules.en.json`, with the same `id`. A test enforces this too.

Run `npm run verify` before opening a pull request.

## Current limitations

- Classification is heuristic. Confidence is an estimate, not a probability.
- Rules are edited by hand in JSON; there is no editor in the app.
- Browser-based provider calls are subject to each provider's CORS policy.
  Anthropic in particular is called with the
  `anthropic-dangerous-direct-browser-access` header, which sends your key from
  the browser and is **local-use only**.
- Text written by an AI provider is not retranslated when you switch language;
  it updates on the next analysis.
- There is no backend, and no history between sessions.

## Documentation

| Document             | English                                    | Español                                          |
| -------------------- | ------------------------------------------ | ------------------------------------------------ |
| Roadmap              | [docs/ROADMAP.md](docs/ROADMAP.md)         | [docs/ROADMAP.es.md](docs/ROADMAP.es.md)         |
| Translation guide    | [docs/TRANSLATION.md](docs/TRANSLATION.md) | [docs/TRANSLATION.es.md](docs/TRANSLATION.es.md) |
| AI-assisted workflow | [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md) | [docs/AI_WORKFLOW.es.md](docs/AI_WORKFLOW.es.md) |
| Changelog            | [CHANGELOG.md](CHANGELOG.md)               | —                                                |
| Contributing         | [CONTRIBUTING.md](CONTRIBUTING.md)         | [CONTRIBUTING.es.md](CONTRIBUTING.es.md)         |
| Security policy      | [SECURITY.md](SECURITY.md)                 | [SECURITY.es.md](SECURITY.es.md)                 |
| Support              | [SUPPORT.md](SUPPORT.md)                   | [SUPPORT.es.md](SUPPORT.es.md)                   |
| Code of conduct      | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)   | [CODE_OF_CONDUCT.es.md](CODE_OF_CONDUCT.es.md)   |

## License

[MIT](LICENSE).
