function renderList(items) {
  return items?.length ? items.map((item) => `- ${item}`).join('\n') : '- Sin datos.';
}

export function buildMarkdownReport({ userText, advice, scoreData, refinedPrompt, missingContextAudit }) {
  const auditSection = missingContextAudit
    ? `
## Auditoria de contexto faltante

### Contexto faltante
${renderList(missingContextAudit.missingItems)}

### Riesgos si no se agrega
${renderList(missingContextAudit.riskWarnings)}

### Preguntas utiles antes de consultar a la IA
${renderList(missingContextAudit.clarificationQuestions)}
`
    : '';

  return `# Diagnostico de contexto - ContextForge

## Prompt original
${userText}

## Categoria detectada
${advice.category}

Confianza estimada: ${advice.confidence}%

## Formato principal recomendado
${advice.primaryFormats.map((item) => `- ${item}`).join('\n')}

## Formatos complementarios
${advice.secondaryFormats.map((item) => `- ${item}`).join('\n')}

## Que evitar
${advice.avoid.map((item) => `- ${item}`).join('\n')}

## Checklist para compartir con la IA
${advice.checklist.map((item) => `- [ ] ${item}`).join('\n')}

## Razon
${advice.reason}

## Calidad del contexto
Puntaje: ${scoreData.score}/100
Nivel: ${scoreData.level}

### Mejoras sugeridas
${scoreData.improvements.length ? scoreData.improvements.map((item) => `- ${item}`).join('\n') : '- El contexto inicial es solido.'}
${auditSection}

## Prompt refinado
\`\`\`text
${refinedPrompt}
\`\`\`
`;
}
