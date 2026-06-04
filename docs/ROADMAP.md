# Roadmap de ContextForge

## Fase 0 — Entorno

Objetivo: poder ejecutar el proyecto localmente.

- Instalar Node.js.
- Instalar Git.
- Instalar VS Code.
- Instalar Codex CLI o extensión.
- Ejecutar `npm install`.
- Ejecutar `npm run dev`.

## Fase 1 — MVP local

Objetivo: analizar un prompt y recomendar formato.

Incluido en v0.1:

- Textarea.
- Botón de análisis.
- Clasificación por reglas.
- Scoring de calidad.
- Checklist.
- Prompt refinado.
- Exportación Markdown.

## Fase 2 — Mejoras de producto

Incluido en v0.3.0-alpha:

- Missing Context Auditor local.
- Deteccion de contexto faltante a partir del checklist de la categoria.
- Riesgos y preguntas de aclaracion antes de consultar a una IA.
- Exportacion Markdown con la auditoria incluida.

- Historial local.
- Modo principiante/profesional.
- Selector de IA destino.
- Ejemplos por categoría.
- Vista comparativa de formatos.

## Fase 3 — Motor más inteligente

Incluido en v0.4.0-alpha:

- AI Response Evaluator local.
- Next Prompt Generator para continuar el ciclo de trabajo.
- Evaluacion de completitud, fortalezas, puntos debiles y riesgos.
- Exportacion Markdown con respuesta evaluada y siguiente prompt.

- Mejorar clasificación con pesos por palabras.
- Detectar múltiples categorías.
- Detectar ambigüedad.
- Sugerir preguntas de aclaración.
- Permitir editar reglas desde la app.

## Fase 4 — Calidad y mantenimiento

- Agregar tests unitarios.
- Agregar `npm run lint`.
- Separar estilos por componentes.
- Mejorar accesibilidad.
- Preparar despliegue en Netlify o Vercel.

## Fase 5 — IA opcional

Solo cuando la versión local sea sólida:

- Integrar API de IA.
- Comparar recomendación por reglas vs recomendación por IA.
- Usar la IA solo para casos ambiguos.
- Mantener modo gratuito/local.

## Fase 6 — Producto avanzado

- Subida de archivos.
- Análisis real de PDF, imagen o HTML.
- Generación automática de paquetes de contexto.
- Exportación para ChatGPT, Claude, Gemini, Manus o Codex.
- Plantillas de prompts profesionales.
