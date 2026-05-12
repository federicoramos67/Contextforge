# ContextForge

[![ContextForge CI](https://github.com/federicoramos67/Contextforge/actions/workflows/ci.yml/badge.svg)](https://github.com/federicoramos67/Contextforge/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Made with React](https://img.shields.io/badge/React-local--first-61DAFB?logo=react)](https://react.dev/)
[![Built with Vite](https://img.shields.io/badge/Vite-fast--dev-646CFF?logo=vite)](https://vitejs.dev/)
[![AI-assisted workflow](https://img.shields.io/badge/Workflow-AI--assisted-blueviolet)](docs/CODEX_WORKFLOW.md)

ContextForge is a local-first web tool that helps users prepare better context before asking an AI for help.

Instead of sending a vague prompt directly to an AI model, the user writes a natural-language need and ContextForge recommends what files, formats, examples, constraints, and supporting material should be shared to obtain a better answer.

The project is also a documented example of building software with AI assistance using small, verifiable steps, manual validation, Git checkpoints and progressive documentation.

## Preview

> Demo screenshots/GIFs will be added as the UI stabilizes.

For now, ContextForge runs locally with Vite at:

```text
http://localhost:5173/
```

## What ContextForge does

Given a prompt such as:

```text
Quiero que una IA me ayude a corregir un workflow de n8n que falla cuando recibe datos de un webhook.
```

ContextForge returns:

- detected category;
- classification confidence;
- recommended primary formats;
- useful complementary context;
- what to avoid sharing;
- explanation of why the category was detected;
- detected keywords/signals;
- context quality score;
- checklist of material to prepare;
- refined prompt ready to copy.

## Current status

Current checkpoint: **v0.2**

The app currently works locally with React, Vite and JSON-based rules.

It does not use a backend, database, authentication, external AI API or remote processing. The classification logic runs locally in the browser.

## Why this project matters

Many people know how to ask an AI a question, but they do not always know what context to provide.

ContextForge helps users decide whether they should share:

- plain text;
- source code;
- logs;
- screenshots;
- exported JSON;
- CSV or Excel files;
- PDFs;
- structured examples;
- constraints and expected outputs.

The goal is not to replace an AI assistant. The goal is to improve the input before using one.

## Key features

- Local rule-based prompt classification.
- Category-specific recommendations.
- Context quality scoring.
- Checklist generation.
- Refined prompt generation.
- Markdown export support.
- Explanation of why a category was detected.
- Display of detected keywords/signals.
- Manual QA cases documented with a Python helper script.
- Documented AI-assisted development workflow.
- CI workflow that validates production builds.
- Open-source project structure with contribution, security and issue templates.

## Example outputs

### n8n automation

Input:

```text
Quiero que una IA me ayude a corregir un workflow de n8n que falla cuando recibe datos de un webhook.
```

Expected result:

```text
Category: Automatización con n8n
Confidence: 66%
Detected keywords: n8n, workflow n8n, webhook n8n
```

Recommended context:

- exported workflow JSON without credentials;
- full workflow screenshot;
- failed execution or error message;
- example input;
- expected output;
- problematic node;
- connected services.

### Data analysis

Input:

```text
Necesito que una IA analice un CSV de ventas y me proponga KPIs para un dashboard.
```

Expected result:

```text
Category: Análisis de datos / métricas / datasets
Detected keywords: kpi, dashboard
```

Recommended context:

- CSV, Excel or SQL sample;
- analytical question;
- column definitions;
- data dictionary;
- cleaning rules;
- period analyzed;
- expected output format.

## Tech stack

- React
- Vite
- JavaScript
- CSS
- JSON rules
- Python auxiliary QA script
- GitHub Actions
- Git

## Project structure

```text
contextforge/
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  └─ workflows/
├─ src/
│  ├─ components/
│  │  ├─ Checklist.jsx
│  │  ├─ PromptInput.jsx
│  │  ├─ PromptSuggestion.jsx
│  │  ├─ ResultCard.jsx
│  │  └─ ScorePanel.jsx
│  ├─ data/
│  │  └─ contextRules.json
│  ├─ logic/
│  │  ├─ classifyPrompt.js
│  │  ├─ exportMarkdown.js
│  │  ├─ generateAdvice.js
│  │  ├─ generateRefinedPrompt.js
│  │  ├─ scoreContext.js
│  │  └─ textUtils.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ style.css
├─ docs/
│  ├─ CODEX_WORKFLOW.md
│  └─ ROADMAP.md
├─ tools/
│  └─ classifier_manual_cases.py
├─ CHANGELOG.md
├─ CODE_OF_CONDUCT.md
├─ CONTRIBUTING.md
├─ LICENSE
├─ SECURITY.md
├─ SUPPORT.md
├─ package.json
├─ package-lock.json
├─ index.html
├─ vite.config.js
└─ README.md
```

## How it works

1. The user writes a natural-language need.
2. `classifyPrompt.js` compares the text against local category rules.
3. `scoreContext.js` evaluates the quality of the prompt context.
4. `generateAdvice.js` builds the recommendation object.
5. `ResultCard.jsx` displays formats, reasoning, detected keywords and diagnostic explanation.
6. `generateRefinedPrompt.js` creates a better prompt for use with an AI assistant.
7. `exportMarkdown.js` can generate an exportable report.

## Running locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173/
```

Create a production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Manual QA helper

ContextForge includes a small Python helper for manual validation cases.

Run it from the project root:

```bash
python tools/classifier_manual_cases.py
```

or on Windows:

```powershell
py tools\classifier_manual_cases.py
```

This script does not connect to the app and does not duplicate the classifier logic. It simply lists manual test cases and expected results to support QA and regression checks.

## Development workflow

This project is intentionally built through small, documented steps:

1. diagnose before modifying code;
2. make the smallest safe change;
3. run the build or relevant command;
4. validate manually in the browser;
5. document the decision;
6. create a Git checkpoint.

That workflow is part of the value of the project: it shows how AI-assisted development can stay controlled, understandable and auditable.

## Documentation

- [Roadmap](docs/ROADMAP.md)
- [Codex workflow](docs/CODEX_WORKFLOW.md)
- [Changelog](CHANGELOG.md)
- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Support guide](SUPPORT.md)

## Current limitations

- Classification is heuristic and rule-based.
- Confidence is an approximation, not a statistical probability.
- Some detected keywords can look technical or repetitive.
- Automated unit tests are not implemented yet.
- No backend or external AI API is integrated.
- Rules are edited manually in JSON.

## Roadmap

Planned or possible improvements:

- Improve visual presentation of detected keywords.
- Include diagnostic explanation and keywords in Markdown exports.
- Add more manual QA cases.
- Add automated tests for classification logic.
- Improve category weighting and false-positive handling.
- Add local history with `localStorage`.
- Add beginner/professional modes.
- Add AI-destination presets such as ChatGPT, Claude, Gemini, Manus or Codex.
- Add screenshots and a public demo.

## Philosophy

ContextForge is a context preparation layer.

It is designed to help users think before asking an AI, structure their request, and provide the right supporting material.

Better context usually leads to better AI output.

## License

This project is licensed under the [MIT License](LICENSE).
