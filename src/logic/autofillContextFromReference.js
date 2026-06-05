import { normalizeText, unique } from './textUtils';

const audienceSignals = [
  ['clientes', 'clientes'],
  ['usuarios', 'usuarios'],
  ['empresas', 'empresas'],
  ['pymes', 'pymes'],
  ['estudiantes', 'estudiantes'],
  ['docentes', 'docentes'],
  ['leads', 'leads'],
  ['equipo interno', 'equipo interno'],
  ['equipo', 'equipo interno'],
];

const toneSignals = [
  ['formal', 'formal'],
  ['cercano', 'cercano'],
  ['profesional', 'profesional'],
  ['tecnico', 'tecnico'],
  ['tecnico', 'técnico'],
  ['comercial', 'comercial'],
  ['academico', 'academico'],
  ['academico', 'académico'],
  ['directo', 'directo'],
];

const ctaSignals = [
  ['comprar', 'comprar'],
  ['registrarse', 'registrarse'],
  ['responder', 'responder'],
  ['agendar', 'agendar'],
  ['descargar', 'descargar'],
  ['renovar', 'renovar'],
  ['contactar', 'contactar'],
  ['completar formulario', 'completar formulario'],
  ['formulario', 'completar formulario'],
];

const formatSignals = [
  ['email', 'email'],
  ['campana', 'campaña'],
  ['campaña', 'campaña'],
  ['landing', 'landing'],
  ['informe', 'informe'],
  ['resumen', 'resumen'],
  ['post', 'post'],
  ['anuncio', 'anuncio'],
  ['propuesta', 'propuesta'],
  ['script', 'script'],
];

const constraintSignals = [
  'presupuesto',
  'plazo',
  'fecha',
  'limite',
  'límite',
  'no usar',
  'evitar',
  'maximo',
  'máximo',
  'minimo',
  'mínimo',
];

function detectFirstSignal(normalizedText, signals) {
  const found = signals.find(([normalizedSignal]) => normalizedText.includes(normalizeText(normalizedSignal)));
  return found?.[1];
}

function detectAllSignals(normalizedText, signals) {
  return signals
    .filter(([normalizedSignal]) => normalizedText.includes(normalizeText(normalizedSignal)))
    .map(([, label]) => label);
}

function sentenceSummary(referenceText) {
  const clean = String(referenceText || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';

  const firstSentence = clean.split(/[.!?]\s/).find((part) => part.trim().length > 20) || clean;
  return firstSentence.length > 180 ? `${firstSentence.slice(0, 177).trim()}...` : firstSentence.trim();
}

function detectConstraints(referenceText, normalizedText) {
  const labeledConstraints = String(referenceText || '')
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*restricciones?\s*:\s*(.+)$/i) || line.match(/^\s*restricci[oó]n(?:es)?\s*:\s*(.+)$/i))
    .filter(Boolean)
    .map((match) => match[1].trim());

  if (labeledConstraints.length) {
    return unique(labeledConstraints).slice(0, 4);
  }

  const clean = String(referenceText || '').replace(/\s+/g, ' ').trim();
  const constraints = constraintSignals
    .filter((signal) => normalizedText.includes(normalizeText(signal)))
    .map((signal) => {
      const index = normalizedText.indexOf(normalizeText(signal));
      const rawStart = Math.max(0, index - 35);
      const rawEnd = Math.min(clean.length, index + 90);
      return clean.slice(rawStart, rawEnd).trim();
    });

  return unique(constraints).slice(0, 4);
}

function inferredLabels(inferredContext) {
  const labels = [];
  if (inferredContext.audience) labels.push(`Audiencia: ${inferredContext.audience}`);
  if (inferredContext.tone) labels.push(`Tono: ${inferredContext.tone}`);
  if (inferredContext.callToAction) labels.push(`CTA: ${inferredContext.callToAction}`);
  if (inferredContext.format) labels.push(`Formato: ${inferredContext.format}`);
  if (inferredContext.constraints?.length) labels.push(`Restricciones: ${inferredContext.constraints.join('; ')}`);
  if (inferredContext.objective) labels.push(`Objetivo inferido: ${inferredContext.objective}`);
  return labels;
}

function fillMatchesMissingItem(item, inferredContext) {
  const normalizedItem = normalizeText(item);

  if (/destinatario|publico|audiencia|cliente|usuario|lead/.test(normalizedItem)) return Boolean(inferredContext.audience);
  if (/tono|estilo/.test(normalizedItem)) return Boolean(inferredContext.tone);
  if (/objetivo|resultado|queres|esperada/.test(normalizedItem)) return Boolean(inferredContext.objective || inferredContext.callToAction);
  if (/formato|salida|entrega/.test(normalizedItem)) return Boolean(inferredContext.format);
  if (/restric|limite|condicion|privacidad|presupuesto|plazo/.test(normalizedItem)) return Boolean(inferredContext.constraints?.length);
  if (/contexto|material|documento|archivo|texto/.test(normalizedItem)) return Boolean(inferredContext.sourceSummary);

  return inferredLabels(inferredContext).some((label) => normalizeText(label).includes(normalizedItem));
}

function getInitialMissingItems(missingContextAudit, advice, category) {
  if (missingContextAudit?.missingItems?.length) return missingContextAudit.missingItems;
  if (advice?.checklist?.length) return advice.checklist;
  if (category?.checklist?.length) return category.checklist;
  return ['Objetivo', 'Audiencia', 'Formato de salida', 'Restricciones'];
}

function buildUpdatedPrompt({ userText, category, inferredContext, filledItems, stillMissingItems }) {
  const categoryLabel = category?.label || 'la tarea';
  const inferred = inferredLabels(inferredContext);
  const inferredBlock = inferred.length ? inferred.map((item) => `- ${item}`).join('\n') : '- No hay contexto inferido suficiente.';
  const filledBlock = filledItems.length ? filledItems.map((item) => `- ${item}`).join('\n') : '- Todavia no se relleno ningun hueco.';
  const missingBlock = stillMissingItems.length ? stillMissingItems.map((item) => `- ${item}`).join('\n') : '- No quedan faltantes criticos detectados por reglas.';

  return `Actua como especialista en ${categoryLabel}.

Objetivo original:
"${userText || 'Necesito ayuda con esta tarea.'}"

Contexto inferido desde el material de referencia:
${inferredBlock}

Huecos que el material ayudo a rellenar:
${filledBlock}

Contexto que todavia falta confirmar:
${missingBlock}

Usa el contexto inferido como apoyo, pero no inventes datos que no esten en el material. Si falta algo critico, pedilo antes de dar una respuesta final.`;
}

export function autofillContextFromReference({
  userText = '',
  referenceText = '',
  category = {},
  advice = {},
  missingContextAudit = null,
}) {
  const cleanReference = String(referenceText || '').trim();
  const normalizedReference = normalizeText(cleanReference);
  const initialMissingItems = getInitialMissingItems(missingContextAudit, advice, category);

  if (!normalizedReference || normalizedReference.split(' ').filter(Boolean).length < 8) {
    const inferredContext = {};
    return {
      filledItems: [],
      stillMissingItems: initialMissingItems,
      detectedSignals: [],
      inferredContext,
      updatedPrompt: buildUpdatedPrompt({
        userText,
        category,
        inferredContext,
        filledItems: [],
        stillMissingItems: initialMissingItems,
      }),
    };
  }

  const inferredContext = {
    audience: detectFirstSignal(normalizedReference, audienceSignals),
    tone: detectFirstSignal(normalizedReference, toneSignals),
    callToAction: detectFirstSignal(normalizedReference, ctaSignals),
    format: detectFirstSignal(normalizedReference, formatSignals),
    constraints: detectConstraints(cleanReference, normalizedReference),
    sourceSummary: sentenceSummary(cleanReference),
  };

  if (userText) {
    inferredContext.objective = sentenceSummary(userText);
  }

  Object.keys(inferredContext).forEach((key) => {
    if (Array.isArray(inferredContext[key]) && inferredContext[key].length === 0) delete inferredContext[key];
    if (!inferredContext[key]) delete inferredContext[key];
  });

  const filledItems = initialMissingItems.filter((item) => fillMatchesMissingItem(item, inferredContext));
  const stillMissingItems = initialMissingItems.filter((item) => !filledItems.includes(item));
  const detectedSignals = unique([
    ...detectAllSignals(normalizedReference, audienceSignals).map((item) => `Audiencia: ${item}`),
    ...detectAllSignals(normalizedReference, toneSignals).map((item) => `Tono: ${item}`),
    ...detectAllSignals(normalizedReference, ctaSignals).map((item) => `CTA: ${item}`),
    ...detectAllSignals(normalizedReference, formatSignals).map((item) => `Formato: ${item}`),
    ...(inferredContext.constraints || []).map((item) => `Restriccion: ${item}`),
  ]);

  return {
    filledItems,
    stillMissingItems,
    detectedSignals,
    inferredContext,
    updatedPrompt: buildUpdatedPrompt({
      userText,
      category,
      inferredContext,
      filledItems,
      stillMissingItems,
    }),
  };
}
