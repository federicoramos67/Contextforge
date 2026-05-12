# ContextForge

[English README](README.md)

ContextForge es una herramienta web local-first que ayuda a preparar mejor el contexto antes de pedirle ayuda a una IA.

En lugar de enviar un prompt vago directamente a un modelo, el usuario escribe una necesidad en lenguaje natural y ContextForge recomienda qué archivos, formatos, ejemplos, restricciones y materiales conviene compartir para obtener una mejor respuesta.

El proyecto también funciona como ejemplo documentado de desarrollo asistido por IA: cambios pequeños, verificables, validados manualmente, con checkpoints en Git y documentación progresiva.

## Vista previa

> Se agregarán capturas o GIFs cuando la interfaz quede más estable.

Por ahora, ContextForge corre localmente con Vite en:

```text
http://localhost:5173/
```

## Qué hace ContextForge

Dado un prompt como:

```text
Quiero que una IA me ayude a corregir un workflow de n8n que falla cuando recibe datos de un webhook.
```

ContextForge devuelve:

- categoría detectada;
- confianza de clasificación;
- formatos principales recomendados;
- contexto complementario útil;
- qué evitar compartir;
- explicación de por qué se detectó esa categoría;
- keywords o señales detectadas;
- puntaje de calidad del contexto;
- checklist de material a preparar;
- prompt refinado listo para copiar.

## Estado actual

Checkpoint actual: **v0.2**

La app funciona localmente con React, Vite y reglas en JSON.

No usa backend, base de datos, autenticación, API externa de IA ni procesamiento remoto. La lógica de clasificación corre localmente en el navegador.

## Por qué importa este proyecto

Muchas personas saben hacer preguntas a una IA, pero no siempre saben qué contexto conviene darle.

ContextForge ayuda a decidir si conviene compartir:

- texto plano;
- código fuente;
- logs;
- capturas de pantalla;
- JSON exportado;
- archivos CSV o Excel;
- PDFs;
- ejemplos estructurados;
- restricciones y salidas esperadas.

El objetivo no es reemplazar a una IA. El objetivo es mejorar la entrada antes de usar una.

## Funciones principales

- Clasificación local de prompts basada en reglas.
- Recomendaciones específicas por categoría.
- Puntaje de calidad contextual.
- Generación de checklist.
- Generación de prompt refinado.
- Exportación Markdown.
- Explicación de por qué se detectó una categoría.
- Visualización de keywords/señales detectadas.
- Casos de QA manual documentados con un script Python auxiliar.
- Flujo de desarrollo asistido por IA documentado.
- CI con GitHub Actions para validar el build.
- Estructura open source con guías de contribución, seguridad e issues.

## Ejemplos

### Automatización con n8n

Entrada:

```text
Quiero que una IA me ayude a corregir un workflow de n8n que falla cuando recibe datos de un webhook.
```

Resultado esperado:

```text
Categoría: Automatización con n8n
Confianza: 66%
Keywords detectadas: n8n, workflow n8n, webhook n8n
```

Contexto recomendado:

- JSON exportado del workflow sin credenciales;
- captura completa del workflow;
- ejecución fallida o mensaje de error;
- input de ejemplo;
- output esperado;
- nodo problemático;
- servicios conectados.

### Análisis de datos

Entrada:

```text
Necesito que una IA analice un CSV de ventas y me proponga KPIs para un dashboard.
```

Resultado esperado:

```text
Categoría: Análisis de datos / métricas / datasets
Keywords detectadas: kpi, dashboard
```

Contexto recomendado:

- CSV, Excel o muestra SQL;
- pregunta analítica;
- definición de columnas;
- diccionario de datos;
- reglas de limpieza;
- periodo analizado;
- formato de salida esperado.

## Stack técnico

- React
- Vite
- JavaScript
- CSS
- Reglas JSON
- Script Python auxiliar para QA
- GitHub Actions
- Git

## Estructura del proyecto

```text
contextforge/
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  └─ workflows/
├─ src/
│  ├─ components/
│  ├─ data/
│  ├─ logic/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ style.css
├─ docs/
├─ tools/
├─ CHANGELOG.md
├─ CODE_OF_CONDUCT.md
├─ CONTRIBUTING.md
├─ LICENSE
├─ SECURITY.md
├─ SUPPORT.md
├─ README.md
└─ README.es.md
```

## Cómo funciona

1. El usuario escribe una necesidad en lenguaje natural.
2. `classifyPrompt.js` compara el texto contra reglas locales.
3. `scoreContext.js` evalúa la calidad del contexto.
4. `generateAdvice.js` construye la recomendación.
5. `ResultCard.jsx` muestra formatos, explicación, keywords y diagnóstico.
6. `generateRefinedPrompt.js` crea un prompt mejorado para usar con otra IA.
7. `exportMarkdown.js` puede generar un reporte exportable.

## Ejecutar localmente

Instalar dependencias:

```bash
npm install
```

Levantar el servidor de desarrollo:

```bash
npm run dev
```

Abrir la URL local que muestre Vite, normalmente:

```text
http://localhost:5173/
```

Crear build de producción:

```bash
npm run build
```

Vista previa del build:

```bash
npm run preview
```

## QA manual con Python

ContextForge incluye un pequeño script Python para listar casos manuales de validación.

Ejecutar desde la raíz del proyecto:

```bash
python tools/classifier_manual_cases.py
```

En Windows:

```powershell
py tools\classifier_manual_cases.py
```

Este script no se conecta a la app ni duplica la lógica del clasificador. Solo lista casos y resultados esperados para apoyar validaciones manuales y regresiones.

## Flujo de desarrollo

Este proyecto se construye con pasos pequeños y documentados:

1. diagnosticar antes de modificar;
2. aplicar el cambio mínimo seguro;
3. ejecutar build o comando correspondiente;
4. validar manualmente en navegador;
5. documentar la decisión;
6. crear un checkpoint en Git.

Ese flujo es parte del valor del proyecto: demuestra cómo usar IA para desarrollar sin perder control, trazabilidad ni comprensión.

## Documentación

- [Roadmap](docs/ROADMAP.md)
- [Flujo con Codex](docs/CODEX_WORKFLOW.md)
- [Changelog](CHANGELOG.md)
- [Guía de contribución](CONTRIBUTING.md)
- [Política de seguridad](SECURITY.md)
- [Soporte](SUPPORT.md)

## Limitaciones actuales

- La clasificación es heurística y basada en reglas.
- La confianza es una aproximación, no una probabilidad estadística.
- Algunas keywords pueden verse técnicas o repetitivas.
- Todavía no hay tests unitarios automatizados.
- No hay backend ni API externa de IA integrada.
- Las reglas se editan manualmente en JSON.

## Roadmap

Mejoras posibles:

- Mejorar visualmente las keywords detectadas.
- Incluir explicación diagnóstica y keywords en exportaciones Markdown.
- Agregar más casos de QA manual.
- Agregar tests automatizados para la lógica de clasificación.
- Mejorar pesos de categorías y manejo de falsos positivos.
- Agregar historial local con `localStorage`.
- Agregar modo principiante/profesional.
- Agregar presets para ChatGPT, Claude, Gemini, Manus o Codex.
- Agregar capturas y demo pública.

## Filosofía

ContextForge es una capa de preparación de contexto.

Ayuda al usuario a pensar antes de pedirle algo a una IA, ordenar su solicitud y compartir el material correcto.

Mejor contexto suele producir mejores respuestas.

## Licencia

Este proyecto está bajo licencia [MIT](LICENSE).
