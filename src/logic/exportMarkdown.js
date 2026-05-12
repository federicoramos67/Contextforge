export function buildMarkdownReport({ userText, advice, scoreData, refinedPrompt }) {
  return `# Diagnóstico de contexto - ContextForge

## Prompt original
${userText}

## Categoría detectada
${advice.category}

Confianza estimada: ${advice.confidence}%

## Formato principal recomendado
${advice.primaryFormats.map((item) => `- ${item}`).join('\n')}

## Formatos complementarios
${advice.secondaryFormats.map((item) => `- ${item}`).join('\n')}

## Qué evitar
${advice.avoid.map((item) => `- ${item}`).join('\n')}

## Checklist para compartir con la IA
${advice.checklist.map((item) => `- [ ] ${item}`).join('\n')}

## Razón
${advice.reason}

## Calidad del contexto
Puntaje: ${scoreData.score}/100  
Nivel: ${scoreData.level}

### Mejoras sugeridas
${scoreData.improvements.length ? scoreData.improvements.map((item) => `- ${item}`).join('\n') : '- El contexto inicial es sólido.'}

## Prompt refinado
\`\`\`text
${refinedPrompt}
\`\`\`
`;
}
