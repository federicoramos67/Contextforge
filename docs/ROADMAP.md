# Roadmap

**English** · [Español](ROADMAP.es.md)

Where the product stands and where it is going. Shipped work is dated by
version; planned work is an intention, not a commitment.

## Shipped

### v0.1 — Local MVP

Analyze a prompt and recommend a format, entirely in the browser.

- Rule-based classification.
- Context quality score.
- Checklist generation.
- Refined prompt.
- Markdown export.

### v0.2 — Transparency and public project

- Diagnostic explanation of the detected category.
- Display of the detected signals.
- Python helper listing manual QA cases.
- GitHub Actions CI, MIT licence, issue templates and a contributing guide.

### v0.3.0-alpha — Missing-context audit

- Detection of missing context from the category checklist.
- Concrete risks of leaving each item out.
- Clarification questions to ask before going to an AI.
- The audit is included in the Markdown export.

### v0.4.0-alpha — AI response evaluator

Closes the first working loop: the AI's answer comes back into the app.

- Evaluation of completeness, strengths, weak points and risks.
- Generation of the next prompt to keep going.
- The evaluated response is included in the export.

### v0.5.0-alpha — Autofill from reference material

- Local extraction of audience, tone, CTA, format and constraints from pasted
  material.
- An updated prompt carrying the inferred context.
- Material and filled context are included in the export.

### v0.5.1-alpha — Working AI mode and tooling

- Fixed the Anthropic, Groq and Gemini model ids, which pointed at models that
  did not exist or had been decommissioned.
- 30s per-provider timeout with fallback to local rules.
- ESLint and Prettier, pinned dependencies, `npm ci` in CI.

### v0.6.0-alpha — Bilingual

- Interface, context rules and generated text in English and Spanish, with a
  switcher in the header.
- The prompt's language is independent of the interface language.
- Documentation at parity in both languages.
- Prettier applied across the repository and enforced in CI; ~90% coverage.

## Next

Ordered by value against effort, not by date.

### Classification quality

- Detect multiple categories when a prompt mixes them.
- Detect ambiguity and ask for clarification instead of forcing a category.
- Revisit keyword weights against real false-positive cases.
- Extend the manual QA cases.

### Product

- Local history with `localStorage`.
- Beginner / professional modes.
- Target-AI selector with per-model presets.
- Per-category examples and a format comparison view.
- Screenshots and a UI GIF in the README.

### Interface

- Split styles per component.
- Accessibility pass: focus, contrast, keyboard navigation, screen readers.
- A real loading state during AI-mode calls.

### Later

- Editing rules from within the app.
- File upload and real PDF, image or HTML analysis.
- Automatic generation of context packages.
- Professional prompt templates.

## Out of scope

Decisions already made, not open questions:

- **No backend.** Analysis runs in the browser, which is what lets the public
  demo work with no account and store nothing.
- **No project-owned keys.** AI mode uses each user's own key, kept in their own
  browser.
- **No CSS framework.** Styles stay readable to someone who is just starting
  out.
