# Security policy

**English** · [Español](SECURITY.es.md)

## Reporting a vulnerability

Do not report security issues in a public issue.

Instead, open a
[private security advisory](https://github.com/federicoramos67/Contextforge/security/advisories/new),
or contact the maintainer directly. You will get an acknowledgement as soon as
the report is seen.

Reports in English or Spanish are equally welcome.

## Scope

ContextForge is local-first. Its classification runs entirely in the browser
with heuristic rules and uses no authentication, no database and no backend
server.

Since v0.5, an **optional** AI mode can call external providers (Ollama, Groq,
Mistral, Gemini, Anthropic, OpenAI). It stays off unless you configure a
provider key, and it always falls back to local rules on failure.

## API keys and the build trade-off

AI mode reads provider keys from two places:

- **`localStorage`** — keys entered through the UI at runtime. They stay in your
  own browser and are never sent anywhere except to the provider you chose.
- **`VITE_*` environment variables** — read from `.env` at build time. **Vite
  inlines every `VITE_*` value directly into the generated JavaScript bundle.**

Because of that inlining, **if you run `npm run build` with keys in `.env` and
then publish `dist/`** (GitHub Pages, Vercel, Netlify and so on), those keys end
up in plain text inside the public JavaScript, readable by anyone.

Guidelines:

- For a public or demo deployment, build **without** a `.env`. The local rules
  mode works perfectly with no keys.
- Keep real keys out of the repository (`.env` is git-ignored) and prefer
  entering them through the UI for local use.
- Use keys with a spending limit.
- Anthropic direct browser calls send the key from the client on purpose (see
  the `anthropic-dangerous-direct-browser-access` header). Treat that provider
  as local-use only.

The deploy workflow in this repository builds with no `.env` and no `VITE_*_KEY`
variables available, so the published demo cannot carry a key.

## Sensitive information

Never upload API keys, access tokens, credentials, private datasets or personal
information — not to the repository, and not into a prompt you paste into the
app.

Even when testing locally, secrets belong outside the repository.
