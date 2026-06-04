function renderList(items) {
  return items?.length ? items.map((item) => `- ${item}`).join('\n') : '- Sin datos.';
}

export function buildMarkdownReport({
  userText,
  advice,
  scoreData,
  refinedPrompt,
  missingContextAudit,
  aiResponse,
  responseEvaluation,
}) {
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
  const responseEvaluationSection = responseEvaluation
    ? `
## Evaluacion de respuesta de IA

### Respuesta pegada
\`\`\`text
${aiResponse || ''}
\`\`\`

### Nivel de completitud
${responseEvaluation.completionLevel}

### Que respondio bien
${renderList(responseEvaluation.strengths)}

### Que falta o esta debil
${renderList(responseEvaluation.missingOrWeakPoints)}

### Riesgos
${renderList(responseEvaluation.riskWarnings)}

### Siguiente prompt recomendado
\`\`\`text
${responseEvaluation.nextPrompt}
\`\`\`
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
${responseEvaluationSection}
`;
}
