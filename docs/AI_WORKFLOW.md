# AI-assisted development workflow

**English** · [Español](AI_WORKFLOW.es.md)

How this project is built using an AI as a technical companion, without losing
control or understanding of what is being touched. It applies to Codex, Claude
Code, Copilot or any equivalent assistant.

## The idea

An AI writing code is useful only to the extent that you can verify what it
wrote. Everything below exists to make that verification possible: small steps,
one change at a time, and a Git checkpoint before every risky stretch.

The golden rule is not to ask:

```text
Build the whole project.
```

but rather:

```text
Change this specific part, tell me what you touched and how I test it.
```

## The loop

1. **Diagnose before modifying.** Understand what fails and why before asking
   for a change.
2. **Make the smallest safe change.** One problem at a time.
3. **Run it.** `npm run verify` covers lint, formatting, tests and build.
4. **Validate manually in the browser.** Tests do not see the interface.
5. **Document the decision** when it is not obvious.
6. **Create a Git checkpoint.**

## Environment

```bash
node -v          # 20.19 or newer
git --version
npm install
npm run dev
```

If you use `nvm`, `nvm use` picks the version from `.nvmrc`.

## Damage control

Before a large change:

```bash
git status
git add .
git commit -m "checkpoint before <change>"
```

If it goes wrong:

```bash
git restore .
```

## Prompts that work in this repository

### Understand the project

```text
Read this project and explain it to me as a beginner. Tell me what each folder
does and which file I should look at first.
```

### Improve a function

```text
Review src/logic/classifyPrompt.js. Improve the classification without adding
external libraries. Keep the code readable for beginners.
```

### Add a category

```text
Add a new category for video, audio, transcription and multimedia editing
prompts. It must go in both src/data/contextRules.es.json and
contextRules.en.json under the same id, and the parity tests must still pass.
```

### Add an interface string

```text
Add the string <X> to the interface. It goes in src/i18n/locales/es.js and en.js
under the same key, and is read with t('<key>') from the component.
```

### Fix an error

```text
This is the error I get when running npm run dev:

[PASTE THE FULL ERROR]

Explain the likely cause and fix it in the project.
```

### Improve the design

```text
Improve the visual interface while keeping the CSS simple. Do not add Tailwind
or any library. The app must stay readable for beginners.
```

## Constraints worth stating

These are worth repeating in the prompt, because an AI tends to suggest the
opposite by default:

- No new dependencies unless explicitly justified.
- No backend.
- No CSS framework.
- Every interface string goes through i18n, never written inline in a component.
- Every new rule goes into both languages.

## Common problems

### The AI is working in the wrong folder

```bash
pwd    # should show the contextforge folder
```

### `npm` is not recognized

Node.js is not installed or is not on PATH. Close and reopen the terminal; if it
persists, reinstall Node.js LTS.

### The app does not open

Check that `npm run dev` is running and open the exact URL printed in the
terminal, including the `/Contextforge/` suffix.

### The parity tests fail

You added a key or a rule in only one language. The test message tells you which
one is missing.
