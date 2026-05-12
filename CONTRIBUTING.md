# Contributing to ContextForge

Thank you for your interest in contributing.

ContextForge is intentionally developed through small, verifiable and documented improvements.

## Development philosophy

Before modifying the project:

1. Diagnose first.
2. Prefer the smallest safe change.
3. Validate manually.
4. Document important decisions.
5. Keep the app local-first whenever possible.
6. Avoid unnecessary complexity.

## Local setup

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

## Python QA helper

Manual QA cases are documented in:

```text
tools/classifier_manual_cases.py
```

Run:

```bash
python tools/classifier_manual_cases.py
```

## Pull request guidelines

- Keep PRs focused.
- Explain why the change exists.
- Include manual validation when possible.
- Avoid mixing unrelated features.
- Prefer readable code over clever code.

## Areas where contributions are welcome

- UI/UX improvements.
- Accessibility.
- Better classification heuristics.
- Automated tests.
- Export improvements.
- Documentation.
- New context categories.
- False-positive reduction.

## What to avoid

- Large rewrites without discussion.
- Adding unnecessary dependencies.
- Turning the app into a backend-heavy architecture.
- Uploading secrets or credentials.
