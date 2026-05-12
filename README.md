# ContextForge

ContextForge es una herramienta web local que recibe un prompt escrito en lenguaje natural y recomienda qué tipo de contexto conviene compartir con una IA para obtener mejores respuestas.

Ejemplo:

> “Quiero que una IA revise mi landing page y me diga por qué no convierte.”

ContextForge responde:

- categoría detectada;
- formatos principales recomendados;
- formatos complementarios;
- qué evitar;
- checklist de archivos/contexto;
- puntuación de calidad del prompt;
- prompt refinado listo para copiar.

## Estado del proyecto

Versión inicial funcional: **v0.1**

- Sin backend.
- Sin API externa.
- Sin base de datos.
- Funciona con reglas locales en JSON.
- Pensado para aprender Codex, React, Vite y flujo de trabajo con VS Code.

## Requisitos

Instalar:

1. Node.js LTS.
2. Git.
3. VS Code.
4. Codex CLI o extensión de Codex para VS Code.

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
│  │  ├─ exportMarkdown.js
│  │  ├─ generateAdvice.js
│  │  ├─ generateRefinedPrompt.js
│  │  ├─ scoreContext.js
│  │  └─ textUtils.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ style.css
├─ docs/
│  ├─ CODEX_WORKFLOW.md
│  └─ ROADMAP.md
├─ package.json
├─ index.html
└─ vite.config.js
```

## Cómo funciona

1. El usuario escribe una necesidad.
2. `classifyPrompt.js` compara el texto contra palabras clave de `contextRules.json`.
3. `scoreContext.js` evalúa si el prompt trae objetivo, tipo de contenido, problema, resultado esperado y restricciones.
4. `generateAdvice.js` arma la recomendación.
5. `generateRefinedPrompt.js` crea un prompt mejorado para copiar.
6. `exportMarkdown.js` genera un reporte exportable.

## Próximas mejoras

- Historial local en `localStorage`.
- Selector de IA destino: ChatGPT, Claude, Gemini, Manus, Codex.
- Modo principiante / profesional.
- Editor de reglas desde la interfaz.
- Exportación JSON.
- Tests unitarios para la lógica.
- Backend opcional.
- Integración futura con API de IA.

## Filosofía del proyecto

No intenta reemplazar a una IA avanzada. Sirve como capa previa: ayuda al usuario a preparar mejor su contexto antes de consultar una IA.
