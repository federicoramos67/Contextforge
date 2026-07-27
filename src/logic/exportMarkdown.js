import { DEFAULT_LOCALE, getTranslator } from '../i18n/index.js';

function renderList(items, t) {
  return items?.length
    ? items.map((item) => `- ${item}`).join('\n')
    : `- ${t('report.noData')}`;
}

// Las claves de `inferredContext` son estables ('audience', 'tone', ...); acá se
// traducen a la etiqueta legible del idioma activo, y si apareciera una clave
// sin traducción se imprime tal cual en vez de romper el reporte.
function renderInferredContext(inferredContext = {}, t) {
  const rows = Object.entries(inferredContext).filter(([, value]) => {
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  if (!rows.length) return `- ${t('report.noInferredContext')}`;

  return rows
    .map(([key, value]) => {
      const label = t(`autofillLogic.labels.${key}`);
      const printedLabel =
        label === `autofillLogic.labels.${key}` ? key : label;
      return `- ${printedLabel}: ${Array.isArray(value) ? value.join('; ') : value}`;
    })
    .join('\n');
}

export function buildMarkdownReport({
  userText,
  advice,
  scoreData,
  refinedPrompt,
  missingContextAudit,
  referenceText,
  contextAutofill,
  aiResponse,
  responseEvaluation,
  locale = DEFAULT_LOCALE,
}) {
  const t = getTranslator(locale);

  const auditSection = missingContextAudit
    ? `
## ${t('report.auditSection')}

### ${t('report.auditMissing')}
${renderList(missingContextAudit.missingItems, t)}

### ${t('report.auditRisks')}
${renderList(missingContextAudit.riskWarnings, t)}

### ${t('report.auditQuestions')}
${renderList(missingContextAudit.clarificationQuestions, t)}
`
    : '';

  const contextAutofillSection = contextAutofill
    ? `
## ${t('report.autofillSection')}

### ${t('report.autofillReference')}
\`\`\`text
${referenceText || ''}
\`\`\`

### ${t('report.autofillInferred')}
${renderInferredContext(contextAutofill.inferredContext, t)}

### ${t('report.autofillFilled')}
${renderList(contextAutofill.filledItems, t)}

### ${t('report.autofillStillMissing')}
${renderList(contextAutofill.stillMissingItems, t)}

### ${t('report.autofillUpdatedPrompt')}
\`\`\`text
${contextAutofill.updatedPrompt}
\`\`\`
`
    : '';

  const responseEvaluationSection = responseEvaluation
    ? `
## ${t('report.evaluationSection')}

### ${t('report.evaluationResponse')}
\`\`\`text
${aiResponse || ''}
\`\`\`

### ${t('report.evaluationLevel')}
${responseEvaluation.completionLevel}

### ${t('report.evaluationStrengths')}
${renderList(responseEvaluation.strengths, t)}

### ${t('report.evaluationWeakPoints')}
${renderList(responseEvaluation.missingOrWeakPoints, t)}

### ${t('report.evaluationRisks')}
${renderList(responseEvaluation.riskWarnings, t)}

### ${t('report.evaluationNextPrompt')}
\`\`\`text
${responseEvaluation.nextPrompt}
\`\`\`
`
    : '';

  return `${t('report.title')}

## ${t('report.originalPrompt')}
${userText}

## ${t('report.detectedCategory')}
${advice.category}

${t('report.estimatedConfidence', { value: advice.confidence })}

## ${t('report.primaryFormats')}
${advice.primaryFormats.map((item) => `- ${item}`).join('\n')}

## ${t('report.secondaryFormats')}
${advice.secondaryFormats.map((item) => `- ${item}`).join('\n')}

## ${t('report.avoid')}
${advice.avoid.map((item) => `- ${item}`).join('\n')}

## ${t('report.checklist')}
${advice.checklist.map((item) => `- [ ] ${item}`).join('\n')}

## ${t('report.reason')}
${advice.reason}

## ${t('report.contextQuality')}
${t('report.score', { score: scoreData.score })}
${t('report.level', { level: scoreData.level })}

### ${t('report.improvements')}
${
  scoreData.improvements.length
    ? scoreData.improvements.map((item) => `- ${item}`).join('\n')
    : `- ${t('report.solidContext')}`
}
${auditSection}

## ${t('report.refinedPrompt')}
\`\`\`text
${refinedPrompt}
\`\`\`
${contextAutofillSection}
${responseEvaluationSection}
`;
}
