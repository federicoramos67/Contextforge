# ContextForge

[![ContextForge CI](https://github.com/federicoramos67/Contextforge/actions/workflows/ci.yml/badge.svg)](https://github.com/federicoramos67/Contextforge/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Made with React](https://img.shields.io/badge/React-local--first-61DAFB?logo=react)](https://react.dev/)
[![Built with Vite](https://img.shields.io/badge/Vite-fast--dev-646CFF?logo=vite)](https://vitejs.dev/)
[![AI-assisted workflow](https://img.shields.io/badge/Workflow-AI--assisted-blueviolet)](docs/CODEX_WORKFLOW.md)

**AI-assisted context engineering tool that helps users prepare better prompts, files, and workflows before using AI.**

ContextForge is a hybrid context advisor: it works with local rules by default and can optionally use configured AI providers to classify a user's need and recommend the best context to share.

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
- refined prompt ready to copy;
- context autofill from pasted reference material;
- AI response evaluation and next prompt generation.

## Current status

Current checkpoint: **v0.5.0-alpha**

The app currently works locally with React, Vite and JSON-based rules, with an optional AI mode for configured providers.

The default experience remains local-first and rule-based. AI providers are optional and should be configured deliberately by the user.

### ContextForge v0.3.0-alpha — Missing Context Auditor

This alpha adds a local Missing Context Auditor. After classifying a prompt, ContextForge now highlights likely missing context, explains the risks of asking an AI without it, and suggests practical clarification questions before exporting or copying the refined prompt.

### ContextForge v0.4.0-alpha — AI Response Evaluator

This alpha closes the first local feedback loop: after using the refined prompt in an external AI, users can paste the AI response back into ContextForge. The app evaluates completion, weak points, risks and generates a next prompt locally with rules.

### ContextForge v0.5.0-alpha — Context Autofill

This alpha adds local Context Autofill from pasted reference material. Users can paste a prior campaign, brief, email, client text or base documentation, and ContextForge extracts useful signals, fills some missing context and generates an updated prompt.

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
- Optional AI provider mode.
- Automatic fallback to local rules.
- Category-specific recommendations.
- Context quality scoring.
- Checklist generation.
- Missing Context Auditor with local, rule-based fallback.
- Context Autofill from pasted reference material.
- AI Response Evaluator and Next Prompt Generator.
- Refined prompt generation.
- Markdown export support.
- Explanation of why a category was detected.
- Display of detected keywords/signals.
- Manual QA cases documented with a Python helper script.
- Documented AI-assisted development workflow.
- CI workflow that validates production builds and tests.
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
|- .github/
|  |- ISSUE_TEMPLATE/
|  `- workflows/
|- src/
|  |- components/
|  |  |- AIResponseEvaluator.jsx
|  |  |- Checklist.jsx
|  |  |- ContextAutofill.jsx
|  |  |- MissingContextAudit.jsx
|  |  |- PromptInput.jsx
|  |  |- PromptSuggestion.jsx
|  |  |- ResultCard.jsx
|  |  `- ScorePanel.jsx
|  |- data/
|  |  `- contextRules.json
|  |- logic/
|  |  |- auditMissingContext.js
|  |  |- autofillContextFromReference.js
|  |  |- classifyPrompt.js
|  |  |- classifyWithAI.js
|  |  |- evaluateAIResponse.js
|  |  |- exportMarkdown.js
|  |  |- generateAdvice.js
|  |  |- generateRefinedPrompt.js
|  |  |- scoreContext.js
|  |  `- textUtils.js
|  |- App.jsx
|  |- config.js
|  |- main.jsx
|  `- style.css
|- docs/
|  |- CODEX_WORKFLOW.md
|  `- ROADMAP.md
|- tools/
|  `- classifier_manual_cases.py
|- tests/
|  |- auditMissingContext.test.js
|  |- autofillContextFromReference.test.js
|  |- classifyPrompt.test.js
|  `- evaluateAIResponse.test.js
|- CHANGELOG.md
|- CODE_OF_CONDUCT.md
|- CONTRIBUTING.md
|- LICENSE
|- SECURITY.md
|- SUPPORT.md
|- package.json
|- package-lock.json
|- index.html
|- vite.config.js
`- README.md
```

## How it works

1. The user writes a natural-language need.
2. `classifyPrompt.js` compares the text against local category rules.
3. Optional: `classifyWithAI.js` can use a configured AI provider and fall back to local rules if needed.
4. `scoreContext.js` evaluates the quality of the prompt context.
5. `generateAdvice.js` builds the recommendation object.
6. `auditMissingContext.js` detects likely missing checklist items and turns them into risks and questions.
7. `autofillContextFromReference.js` extracts useful context from pasted reference material.
8. `ResultCard.jsx` displays formats, reasoning, detected keywords and diagnostic explanation.
9. `generateRefinedPrompt.js` creates a better prompt for use with an AI assistant.
10. `evaluateAIResponse.js` evaluates a pasted AI response and generates the next prompt.
11. `exportMarkdown.js` can generate an exportable report including audits, autofill and response evaluation.

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

Run tests:

```bash
npm test
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

- Classification can run locally with heuristic rules, but AI mode depends on user-provided provider configuration.
- Confidence is an approximation, not a statistical probability.
- Some detected keywords can look technical or repetitive.
- Direct provider calls from the browser may have CORS or key-exposure limitations depending on the provider. Anthropic in particular is called with the `anthropic-dangerous-direct-browser-access` header, which is intended for **local use only**: it sends your API key from the browser, so never build for a public deployment with an Anthropic key configured.
- No backend is integrated yet.
- Rules are edited manually in JSON.

## Roadmap

Planned or possible improvements:

- Improve visual presentation of detected keywords.
- Include diagnostic explanation and keywords in Markdown exports.
- Add more manual QA cases.
- Expand automated tests for classification logic.
- Improve category weighting and false-positive handling.
- Add local history with `localStorage`.
- Add beginner/professional modes.
- Add safer provider configuration patterns.
- Add screenshots and a public demo.

## Philosophy

ContextForge is a context preparation layer.

It is designed to help users think before asking an AI, structure their request, and provide the right supporting material.

Better context usually leads to better AI output.

## License

This project is licensed under the [MIT License](LICENSE).
