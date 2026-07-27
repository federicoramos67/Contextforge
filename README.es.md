# ContextForge

[English](README.md) · **Español**

[![CI](https://github.com/federicoramos67/Contextforge/actions/workflows/ci.yml/badge.svg)](https://github.com/federicoramos67/Contextforge/actions/workflows/ci.yml)
[![Licencia: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Idiomas: EN + ES](https://img.shields.io/badge/i18n-EN%20%2B%20ES-7da1ff)](#idiomas)

> Decidí qué darle a una IA **antes** de preguntarle nada.

ContextForge lee una necesidad escrita en lenguaje natural y te dice qué
archivos, formatos, ejemplos y restricciones conviene compartir con una IA para
obtener una respuesta usable. Funciona entero en tu navegador con reglas
locales, y tiene un modo IA opcional que configurás vos.

**▶️ [Demo en vivo](https://federicoramos67.github.io/Contextforge/)**

La demo pública corre en **modo reglas**, que no necesita ninguna API key. El
modo IA opcional requiere tu propia key de proveedor, guardada en el
`localStorage` de tu navegador y nunca enviada a ningún servidor de
ContextForge.

---

## Contenido

- [El problema](#el-problema)
- [Qué obtenés](#qué-obtenés)
- [Idiomas](#idiomas)
- [Puesta en marcha](#puesta-en-marcha)
- [Cómo funciona](#cómo-funciona)
- [Modo IA y API keys](#modo-ia-y-api-keys)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Contribuir](#contribuir)
- [Limitaciones actuales](#limitaciones-actuales)
- [Documentación](#documentación)
- [Licencia](#licencia)

## El problema

Mucha gente sabe hacerle una pregunta a una IA. Menos gente sabe qué entregarle
junto con la pregunta, y eso suele ser lo que define si la respuesta sirve.

ContextForge no es otro asistente: es la capa anterior. Te ayuda a decidir si
conviene compartir texto plano, código fuente, logs, capturas, JSON exportado,
un CSV, un PDF, ejemplos estructurados o las restricciones que la respuesta
tiene que respetar.

## Qué obtenés

Le das un prompt como:

```text
Necesito corregir un workflow de n8n que falla cuando llega un webhook.
```

y devuelve:

| Salida                       | Qué es                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| **Categoría**                | Una de 15 categorías, con una estimación de confianza                                 |
| **Formato recomendado**      | El material principal a compartir, más complementos útiles                            |
| **Qué evitar**               | Los errores que suelen costar una ida y vuelta                                        |
| **Por qué**                  | Qué señales de tu texto dispararon esa categoría                                      |
| **Puntaje de contexto**      | Una calificación de 0 a 100 con mejoras concretas                                     |
| **Checklist**                | Qué juntar antes de preguntar                                                         |
| **Auditoría de contexto**    | Huecos probables, el riesgo de cada uno y preguntas para cerrarlos                    |
| **Prompt refinado**          | Un prompt reescrito, listo para copiar                                                |
| **Autorrelleno de contexto** | Pegás material de referencia y extrae audiencia, tono, CTA, formato y restricciones   |
| **Evaluador de respuestas**  | Pegás la respuesta de la IA y obtenés sus puntos débiles más un prompt de seguimiento |
| **Exportación Markdown**     | Todo el reporte como archivo                                                          |

Todo esto se genera localmente, con reglas, sin ninguna llamada de red.

## Idiomas

La interfaz, las reglas de contexto y todos los textos generados existen en
**español e inglés**, intercambiables desde el header en cualquier momento. Al
cambiar de idioma se vuelve a renderizar el análisis que ya está en pantalla,
así la página nunca queda a medio traducir.

Dos detalles que conviene conocer:

- **El idioma de tu prompt es independiente del idioma de la interfaz.** Cada
  categoría se puntúa contra la lista de keywords de cada idioma y gana el mejor
  match, así un prompt en español clasifica bien con la interfaz en inglés, y al
  revés.
- **El idioma inicial** sale de tu elección guardada, después del idioma del
  navegador, y si nada aplica queda en español.

La documentación vive en el mismo repositorio en ambos idiomas: cada documento
en inglés tiene su contraparte `.es.md`, enlazada desde una barra de idioma
arriba de todo. En [docs/TRANSLATION.es.md](docs/TRANSLATION.es.md) está cómo se
mantienen sincronizados y cómo agregar un tercer idioma.

## Puesta en marcha

Requiere Node.js 20.19 o superior (ver [`.nvmrc`](.nvmrc)).

```bash
git clone https://github.com/federicoramos67/Contextforge.git
cd Contextforge
npm install
npm run dev
```

Después abrí la URL que muestra Vite, normalmente
`http://localhost:5173/Contextforge/`.

### Scripts

| Comando            | Qué hace                                                  |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo con recarga en caliente            |
| `npm run build`    | Build de producción en `dist/`                            |
| `npm run preview`  | Sirve el build de producción localmente                   |
| `npm test`         | Corre la suite de tests                                   |
| `npm run coverage` | Tests con reporte de cobertura                            |
| `npm run lint`     | ESLint                                                    |
| `npm run format`   | Formatea el repositorio con Prettier                      |
| `npm run verify`   | Lint, chequeo de formato, tests y build — lo que corre CI |

> [!WARNING]
> Nunca hagas un build para deploy público con keys en `.env`. Vite embebe todas
> las variables `VITE_*` dentro del bundle generado, así que cualquier key
> presente al buildear queda legible en el JavaScript publicado. Buildeá **sin**
> `.env`: el modo reglas no necesita ninguna key. Ver
> [SECURITY.es.md](SECURITY.es.md).

## Cómo funciona

```text
prompt ─▶ classifyPrompt ─▶ generateAdvice ──▶ recomendación
              │                   │
              │                   ├─▶ scoreContext ────▶ puntaje 0–100 + mejoras
              │                   ├─▶ auditMissingContext ─▶ huecos, riesgos, preguntas
              │                   └─▶ generateRefinedPrompt ─▶ prompt para copiar
              │
              └─(modo IA)─▶ classifyWithAI ─▶ cae a reglas locales si falla

material de referencia ─▶ autofillContextFromReference ─▶ contexto inferido
respuesta de la IA ────▶ evaluateAIResponse ───────────▶ puntos débiles + siguiente prompt
todo ──────────────────▶ buildMarkdownReport ──────────▶ reporte exportable
```

Cada módulo de lógica es una función pura que recibe un `locale` opcional, y eso
es lo que hace que todo el pipeline se pueda testear sin renderizar la app.

## Modo IA y API keys

El modo reglas es el predeterminado y no necesita nada. El modo IA es opcional y
soporta Ollama, Groq, Mistral, Gemini, Anthropic y OpenAI. Cuando un proveedor
falla o supera el timeout (30s), la app cae a las reglas locales y te dice por
qué.

Las keys ingresadas por la interfaz quedan en el `localStorage` de tu navegador.
Las keys de `.env` se leen al buildear: leé la advertencia de más arriba antes de
hacer deploy.

Copiá [`.env.example`](.env.example) a `.env` para uso local.

## Estructura del proyecto

```text
contextforge/
├─ .github/            workflows, plantillas de issues y PR, dependabot
├─ docs/               roadmap, flujo de trabajo y guía de traducción
├─ public/             assets estáticos servidos tal cual
├─ src/
│  ├─ components/      componentes React de presentación
│  ├─ constants/       ejemplos, campos de proveedores, versión
│  ├─ data/            contextRules.{es,en}.json + acceso por idioma
│  ├─ hooks/           useAnalysis — orquestación y estado del análisis
│  ├─ i18n/            diccionarios, traductor, detección de idioma, provider
│  ├─ logic/           lógica de negocio pura, un módulo por paso
│  ├─ App.jsx          layout y estado a nivel app
│  └─ style.css        estilos
├─ tests/              suites de Vitest para lógica, i18n y reglas
└─ tools/              script Python que lista casos de QA manual
```

## Contribuir

Las contribuciones son bienvenidas, en español o en inglés. Leé primero
[CONTRIBUTING.es.md](CONTRIBUTING.es.md) ([English](CONTRIBUTING.md)).

Dos reglas propias de este proyecto:

1. Todo texto visible para el usuario va en **ambos** `src/i18n/locales/es.js` y
   `en.js`. Un test falla si los diccionarios se desincronizan.
2. Toda regla de contexto nueva va en **ambos** `contextRules.es.json` y
   `contextRules.en.json`, con el mismo `id`. Otro test lo verifica.

Corré `npm run verify` antes de abrir un pull request.

## Limitaciones actuales

- La clasificación es heurística. La confianza es una estimación, no una
  probabilidad.
- Las reglas se editan a mano en JSON; no hay editor dentro de la app.
- Las llamadas a proveedores desde el navegador dependen de la política CORS de
  cada uno. Anthropic en particular se llama con el header
  `anthropic-dangerous-direct-browser-access`, que envía tu key desde el
  navegador y es **solo para uso local**.
- El texto escrito por un proveedor de IA no se retraduce al cambiar de idioma;
  se actualiza en el análisis siguiente.
- No hay backend ni historial entre sesiones.

## Documentación

| Documento             | Español                                          | English                                    |
| --------------------- | ------------------------------------------------ | ------------------------------------------ |
| Roadmap               | [docs/ROADMAP.es.md](docs/ROADMAP.es.md)         | [docs/ROADMAP.md](docs/ROADMAP.md)         |
| Guía de traducción    | [docs/TRANSLATION.es.md](docs/TRANSLATION.es.md) | [docs/TRANSLATION.md](docs/TRANSLATION.md) |
| Flujo asistido por IA | [docs/AI_WORKFLOW.es.md](docs/AI_WORKFLOW.es.md) | [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md) |
| Changelog             | [CHANGELOG.md](CHANGELOG.md)                     | —                                          |
| Contribuir            | [CONTRIBUTING.es.md](CONTRIBUTING.es.md)         | [CONTRIBUTING.md](CONTRIBUTING.md)         |
| Política de seguridad | [SECURITY.es.md](SECURITY.es.md)                 | [SECURITY.md](SECURITY.md)                 |
| Soporte               | [SUPPORT.es.md](SUPPORT.es.md)                   | [SUPPORT.md](SUPPORT.md)                   |
| Código de conducta    | [CODE_OF_CONDUCT.es.md](CODE_OF_CONDUCT.es.md)   | [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)   |

## Licencia

[MIT](LICENSE).
