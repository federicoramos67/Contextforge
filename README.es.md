# ContextForge

ContextForge es una herramienta web local que recibe un prompt escrito en lenguaje natural y recomienda qué tipo de contexto conviene compartir con una IA para obtener mejores respuestas.

Ejemplo:

> "Quiero que una IA revise mi landing page y me diga por qué no convierte."

ContextForge responde:

- categoría detectada;
- formatos principales recomendados;
- formatos complementarios;
- qué evitar;
- checklist de archivos/contexto;
- puntuación de calidad del prompt;
- prompt refinado listo para copiar.

## Estado del proyecto

Versión actual: **v0.2**

- Sin backend.
- Sin base de datos.
- Funciona con reglas locales en JSON (modo heurístico).
- Soporte opcional para clasificación por IA real (modo IA).
- Pensado para aprender React, Vite y flujo de trabajo con VS Code.

## Requisitos

Instalar:

1. Node.js LTS.
2. Git.
3. VS Code.

## Ejecutar localmente

Dentro de la carpeta del proyecto:

```bash
npm install
npm run dev
```

Luego abrir la URL que muestre la terminal, normalmente:

```text
http://localhost:5173/
```

## Estructura

```text
contextforge/
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
│  │  ├─ classifyWithAI.js
│  │  ├─ exportMarkdown.js
│  │  ├─ generateAdvice.js
│  │  ├─ generateRefinedPrompt.js
│  │  ├─ scoreContext.js
│  │  └─ textUtils.js
│  ├─ config.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ style.css
├─ docs/
│  ├─ CODEX_WORKFLOW.md
│  └─ ROADMAP.md
├─ .env.example
├─ package.json
├─ index.html
└─ vite.config.js
```

## Cómo funciona

1. El usuario escribe una necesidad.
2. `classifyPrompt.js` (o `classifyWithAI.js` en Modo IA) categoriza el texto.
3. `scoreContext.js` evalúa si el prompt trae objetivo, tipo de contenido, problema, resultado esperado y restricciones.
4. `generateAdvice.js` arma la recomendación.
5. `generateRefinedPrompt.js` crea un prompt mejorado para copiar.
6. `exportMarkdown.js` genera un reporte exportable.

## Modo IA (opcional)

Por defecto, ContextForge usa un clasificador basado en **reglas locales** (sin conexión ni API).
El **Modo IA** reemplaza ese clasificador con una llamada real a un modelo de lenguaje,
lo que permite un análisis más contextual y razonado.

### Diferencia entre los modos

| | Modo reglas | Modo IA |
|---|---|---|
| Requiere conexión | No | Sí |
| Requiere API key | No | Una key basta |
| Velocidad | Instantáneo | Depende del proveedor |
| Análisis | Heurístico por keywords | Razonamiento en lenguaje natural |
| Funciona offline | Sí | Solo con Ollama local |

### Cómo activarlo

Copiá el archivo `.env.example` como `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Completá al menos una de las keys de proveedor y reiniciá el servidor con `npm run dev`.

### Proveedores soportados

| Proveedor | Variable de entorno | Consola |
|-----------|---------------------|---------|
| Ollama (local, sin key) | `VITE_OLLAMA_URL` | Instalación local — sin cuenta |
| Groq | `VITE_GROQ_KEY` | https://console.groq.com |
| Mistral | `VITE_MISTRAL_KEY` | https://console.mistral.ai |
| Google Gemini | `VITE_GEMINI_KEY` | https://aistudio.google.com |
| Anthropic | `VITE_ANTHROPIC_KEY` | https://console.anthropic.com |
| OpenAI | `VITE_OPENAI_KEY` | https://platform.openai.com |

El orden de prioridad si hay varias keys configuradas:
**Ollama → Groq → Mistral → Gemini → Anthropic → OpenAI**

### Modo heurístico siempre disponible

Si no configurás ninguna key, la herramienta sigue funcionando exactamente igual que antes
con el clasificador de reglas locales. El toggle de Modo IA aparece deshabilitado hasta que
haya al menos un proveedor configurado.

Si configurás una key pero la llamada falla (red, key inválida, timeout), ContextForge
hace fallback automático al modo heurístico y muestra un aviso.

## Próximas mejoras

- Historial local en `localStorage`.
- Selector de IA destino: ChatGPT, Claude, Gemini, Manus.
- Modo principiante / profesional.
- Editor de reglas desde la interfaz.
- Exportación JSON.
- Tests unitarios para la lógica.

## Filosofía del proyecto

No intenta reemplazar a una IA avanzada. Sirve como capa previa: ayuda al usuario a preparar mejor su contexto antes de consultar una IA.
