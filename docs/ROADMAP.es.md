# Roadmap

[English](ROADMAP.md) · **Español**

Estado del producto y hacia dónde va. Lo entregado está fechado por versión; lo
planeado es una intención, no un compromiso.

## Entregado

### v0.1 — MVP local

Analizar un prompt y recomendar formato, todo en el navegador.

- Clasificación por reglas.
- Puntaje de calidad del contexto.
- Generación de checklist.
- Prompt refinado.
- Exportación a Markdown.

### v0.2 — Transparencia y proyecto público

- Explicación diagnóstica de la categoría detectada.
- Visualización de las señales detectadas.
- Script Python de casos de QA manual.
- CI con GitHub Actions, licencia MIT, plantillas de issues y guía de
  contribución.

### v0.3.0-alpha — Auditoría de contexto faltante

- Detección del contexto faltante a partir del checklist de la categoría.
- Riesgos concretos de omitir cada uno.
- Preguntas de aclaración antes de consultar a la IA.
- La auditoría se incluye en la exportación Markdown.

### v0.4.0-alpha — Evaluador de respuestas de IA

Cierra el primer ciclo de trabajo: la respuesta de la IA vuelve a la app.

- Evaluación de completitud, fortalezas, puntos débiles y riesgos.
- Generación del siguiente prompt para continuar.
- La respuesta evaluada se incluye en la exportación.

### v0.5.0-alpha — Autorrelleno desde material de referencia

- Extracción local de audiencia, tono, CTA, formato y restricciones desde
  material pegado.
- Prompt actualizado con el contexto inferido.
- El material y el contexto rellenado se incluyen en la exportación.

### v0.5.1-alpha — Modo IA funcional y herramientas

- Corrección de los identificadores de modelo de Anthropic, Groq y Gemini, que
  apuntaban a modelos inexistentes o dados de baja.
- Timeout de 30s por proveedor con fallback a reglas locales.
- ESLint y Prettier, dependencias fijadas, `npm ci` en CI.

### v0.6.0-alpha — Bilingüe

- Interfaz, reglas de contexto y textos generados en español e inglés, con
  selector en el header.
- El idioma del prompt es independiente del de la interfaz.
- Documentación en paridad en ambos idiomas.
- Prettier aplicado a todo el repositorio y verificado en CI; cobertura ~90%.

## Próximo

Ordenado por relación entre valor y esfuerzo, no por fecha.

### Calidad de la clasificación

- Detectar múltiples categorías cuando el prompt las mezcla.
- Detectar ambigüedad y pedir aclaración en lugar de forzar una categoría.
- Revisar los pesos por keyword con casos reales de falsos positivos.
- Ampliar los casos de QA manual.

### Producto

- Historial local con `localStorage`.
- Modo principiante / profesional.
- Selector de IA destino con presets por modelo.
- Ejemplos por categoría y vista comparativa de formatos.
- Capturas y GIF de la interfaz en el README.

### Interfaz

- Separar los estilos por componente.
- Revisión de accesibilidad: foco, contraste, navegación por teclado, lectores
  de pantalla.
- Estado de carga real durante las llamadas del modo IA.

### Más adelante

- Edición de reglas desde la app.
- Subida de archivos y análisis real de PDF, imagen o HTML.
- Generación automática de paquetes de contexto.
- Plantillas de prompts profesionales.

## Fuera de alcance

Decisiones tomadas, no pendientes:

- **Sin backend.** El análisis corre en el navegador; eso es lo que hace que la
  demo pública no necesite cuenta ni guarde nada.
- **Sin claves del proyecto.** El modo IA usa la key de cada usuario, guardada
  en su propio navegador.
- **Sin framework de CSS.** Los estilos se mantienen legibles para alguien que
  recién empieza.
