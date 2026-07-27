# Política de seguridad

[English](SECURITY.md) · **Español**

## Reportar una vulnerabilidad

No reportes problemas de seguridad en un issue público.

En su lugar, abrí un
[aviso de seguridad privado](https://github.com/federicoramos67/Contextforge/security/advisories/new),
o contactá directamente a quien mantiene el proyecto. Vas a recibir acuse de
recibo apenas se vea el reporte.

Los reportes en español o en inglés son igual de bienvenidos.

## Alcance

ContextForge es local-first. Su clasificación corre entera en el navegador con
reglas heurísticas y no usa autenticación, base de datos ni servidor backend.

Desde la v0.5 hay un modo IA **opcional** que puede llamar a proveedores
externos (Ollama, Groq, Mistral, Gemini, Anthropic, OpenAI). Queda apagado salvo
que configures una key de proveedor, y siempre cae a las reglas locales si algo
falla.

## API keys y el problema del build

El modo IA lee las keys de proveedor desde dos lugares:

- **`localStorage`** — las keys ingresadas por la interfaz en tiempo de
  ejecución. Quedan en tu propio navegador y no se envían a ningún lado salvo al
  proveedor que elegiste.
- **Variables de entorno `VITE_*`** — leídas desde `.env` al buildear. **Vite
  embebe todos los valores `VITE_*` directamente dentro del bundle JavaScript
  generado.**

Por ese embebido, **si corrés `npm run build` con keys en `.env` y después
publicás `dist/`** (GitHub Pages, Vercel, Netlify, etc.), esas keys terminan en
texto plano dentro del JavaScript público, legibles por cualquiera.

Recomendaciones:

- Para un deploy público o de demo, buildeá **sin** `.env`. El modo reglas
  locales funciona perfecto sin ninguna key.
- Mantené las keys reales fuera del repositorio (`.env` está en `.gitignore`) y
  preferí ingresarlas por la interfaz para uso local.
- Usá keys con límite de gasto.
- Las llamadas directas a Anthropic desde el navegador envían la key desde el
  cliente a propósito (ver el header
  `anthropic-dangerous-direct-browser-access`). Tratá a ese proveedor como de
  uso exclusivamente local.

El workflow de deploy de este repositorio buildea sin `.env` y sin ninguna
variable `VITE_*_KEY` disponible, así que la demo publicada no puede llevar una
key.

## Información sensible

Nunca subas API keys, tokens de acceso, credenciales, datasets privados ni
información personal: ni al repositorio, ni dentro de un prompt que pegues en la
app.

Incluso probando localmente, los secretos van fuera del repositorio.
