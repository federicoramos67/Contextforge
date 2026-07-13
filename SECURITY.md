# Security Policy

## Reporting vulnerabilities

If you discover a security issue or accidental exposure of sensitive information, please avoid posting it publicly.

Instead:

- open a private GitHub security advisory if available;
- or contact the maintainer directly.

## Scope

ContextForge is local-first by default. Its core classification runs entirely
in the browser with heuristic rules and does not use:

- authentication;
- databases;
- a backend server.

Since v0.5, an **optional** AI mode can call external AI providers (Ollama,
Groq, Mistral, Gemini, Anthropic, OpenAI). This mode is off unless the user
configures a provider key, and it always falls back to local rules on failure.

## API keys and the build trade-off

The AI mode reads provider keys from two places:

- **`localStorage`** — keys entered through the UI at runtime. They stay in the
  user's own browser and are never sent anywhere except to the chosen provider.
- **`VITE_*` environment variables** — read from `.env` at build time. **Vite
  inlines every `VITE_*` value directly into the generated JavaScript bundle.**

Because of that inlining, **if you run `npm run build` with keys in `.env` and
then publish `dist/`** (GitHub Pages, Vercel, Netlify, etc.), those keys end up
in plain text inside the public JS and anyone can read them.

Guidelines:

- For a public/demo deployment, build **without** a `.env` — the local rules
  mode works perfectly with no keys.
- Keep real keys out of the repo (`.env` is git-ignored) and prefer entering
  them through the UI (localStorage) for local use.
- Anthropic direct browser calls send the key from the client on purpose
  (see the `anthropic-dangerous-direct-browser-access` header); treat that
  provider as local-use-only.

## Sensitive information

Never upload:

- API keys;
- access tokens;
- credentials;
- private datasets;
- personal information.

Even when testing locally, secrets should remain outside the repository.
