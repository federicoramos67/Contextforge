# Changelog

All notable changes to this project will be documented in this file.

## v0.5.1-alpha

Maintenance release focused on making the optional AI mode actually work and
hardening the project's tooling. No user-facing feature changes.

### Fixed

- **Anthropic model id** — replaced the non-existent
  `claude-haiku-3-5-20251001` with the valid `claude-haiku-4-5-20251001`
  (every Anthropic call was returning 404).
- **Anthropic CORS** — added the `anthropic-dangerous-direct-browser-access`
  header so direct browser calls are not blocked by CORS (local use only).
- **Groq model id** — replaced the decommissioned `llama3-8b-8192` with the
  current `openai/gpt-oss-20b`.
- **Gemini model id** — replaced the retired `gemini-1.5-flash` with
  `gemini-2.5-flash`.
- **Provider timeouts** — every provider fetch is now wrapped in a 30s
  `AbortSignal.timeout`, so a hung provider falls back to local rules instead
  of leaving the UI waiting forever.

### Changed

- Pinned dependency versions (no more `"latest"`) and moved `vite` and
  `@vitejs/plugin-react` to `devDependencies` for reproducible installs.
- CI now uses `npm ci` instead of `npm install`, and runs `npm run lint`
  before the build.

### Added

- ESLint (flat config with `eslint-plugin-react-hooks`) and Prettier, with
  `lint`, `format` and `format:check` scripts.

### Docs

- Updated `SECURITY.md` to reflect the optional AI mode and the API-key /
  build trade-off; added explicit warnings in `README.md` and `.env.example`
  about not building for public deployment with keys in `.env`.

## v0.2

### Added

- Diagnostic explanation for detected categories.
- Display of detected keywords/signals.
- Manual QA helper script in Python.
- GitHub Actions CI workflow.
- Contribution guidelines.
- MIT license.
- Issue templates.
- Git repository initialization and public GitHub repository.

### Improved

- README structure and public documentation.
- Development workflow documentation.
- Classification transparency.
- Manual validation process.

## v0.1

### Initial release

- Local-first React/Vite app.
- Rule-based prompt classification.
- Context quality scoring.
- Checklist generation.
- Prompt refinement.
- Markdown export support.
