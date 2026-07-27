import { DEFAULT_LOCALE, getTranslator } from '../i18n/index.js';
import { normalizeText, unique } from './textUtils';

// Cada señal asocia una clave estable con los tokens que la delatan en el
// material de referencia. Los tokens son bilingües porque el material pegado
// puede estar en cualquier idioma; la clave se traduce después contra
// `autofillLogic.values.*`, de modo que la salida sigue el idioma de la
// interfaz aunque el material esté en otro.
const audienceSignals = [
  { key: 'clientes', tokens: ['clientes', 'customers', 'clients'] },
  { key: 'usuarios', tokens: ['usuarios', 'users'] },
  { key: 'empresas', tokens: ['empresas', 'companies', 'enterprises'] },
  { key: 'pymes', tokens: ['pymes', 'small businesses', 'smb'] },
  { key: 'estudiantes', tokens: ['estudiantes', 'students'] },
  { key: 'docentes', tokens: ['docentes', 'teachers'] },
  { key: 'leads', tokens: ['leads'] },
  {
    key: 'equipoInterno',
    tokens: ['equipo interno', 'equipo', 'internal team', 'team'],
  },
];

const toneSignals = [
  { key: 'formal', tokens: ['formal'] },
  { key: 'cercano', tokens: ['cercano', 'friendly', 'casual'] },
  { key: 'profesional', tokens: ['profesional', 'professional'] },
  { key: 'tecnico', tokens: ['tecnico', 'technical'] },
  { key: 'comercial', tokens: ['comercial', 'commercial', 'salesy'] },
  { key: 'academico', tokens: ['academico', 'academic'] },
  { key: 'directo', tokens: ['directo', 'direct'] },
];

const ctaSignals = [
  { key: 'comprar', tokens: ['comprar', 'buy', 'purchase'] },
  { key: 'registrarse', tokens: ['registrarse', 'sign up', 'register'] },
  { key: 'responder', tokens: ['responder', 'reply'] },
  { key: 'agendar', tokens: ['agendar', 'book a', 'schedule'] },
  { key: 'descargar', tokens: ['descargar', 'download'] },
  { key: 'renovar', tokens: ['renovar', 'renew'] },
  { key: 'contactar', tokens: ['contactar', 'contact us', 'get in touch'] },
  {
    key: 'formulario',
    tokens: ['completar formulario', 'formulario', 'fill in the form', 'form'],
  },
];

const formatSignals = [
  { key: 'email', tokens: ['email'] },
  { key: 'campana', tokens: ['campana', 'campaign'] },
  { key: 'landing', tokens: ['landing'] },
  { key: 'informe', tokens: ['informe', 'report'] },
  { key: 'resumen', tokens: ['resumen', 'summary'] },
  { key: 'post', tokens: ['post'] },
  { key: 'anuncio', tokens: ['anuncio', 'advert'] },
  { key: 'propuesta', tokens: ['propuesta', 'proposal'] },
  { key: 'script', tokens: ['script'] },
];

const constraintSignals = [
  'presupuesto',
  'plazo',
  'fecha',
  'limite',
  'no usar',
  'evitar',
  'maximo',
  'minimo',
  'budget',
  'deadline',
  'due date',
  'limit',
  'do not use',
  'avoid',
  'maximum',
  'minimum',
];

// Líneas del tipo "Restricción: ..." o "Constraints: ..." tienen prioridad
// sobre la detección por palabras sueltas: ya vienen etiquetadas por el autor.
const labeledConstraintPattern =
  /^\s*(?:restricci[oó]n(?:es)?|constraints?)\s*:\s*(.+)$/i;

function translateSignal(t, group, key) {
  return t(`autofillLogic.values.${group}.${key}`);
}

function detectFirstSignal(normalizedText, signals, t, group) {
  const found = signals.find(({ tokens }) =>
    tokens.some((token) => normalizedText.includes(normalizeText(token))),
  );
  return found ? translateSignal(t, group, found.key) : undefined;
}

function detectAllSignals(normalizedText, signals, t, group) {
  return signals
    .filter(({ tokens }) =>
      tokens.some((token) => normalizedText.includes(normalizeText(token))),
    )
    .map(({ key }) => translateSignal(t, group, key));
}

function sentenceSummary(referenceText) {
  const clean = String(referenceText || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return '';

  const firstSentence =
    clean.split(/[.!?]\s/).find((part) => part.trim().length > 20) || clean;
  return firstSentence.length > 180
    ? `${firstSentence.slice(0, 177).trim()}...`
    : firstSentence.trim();
}

function detectConstraints(referenceText, normalizedText) {
  const labeledConstraints = String(referenceText || '')
    .split(/\r?\n/)
    .map((line) => line.match(labeledConstraintPattern))
    .filter(Boolean)
    .map((match) => match[1].trim());

  if (labeledConstraints.length) {
    return unique(labeledConstraints).slice(0, 4);
  }

  const clean = String(referenceText || '')
    .replace(/\s+/g, ' ')
    .trim();
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

function inferredLabels(inferredContext, t) {
  const label = (key) => t(`autofillLogic.labels.${key}`);
  const labels = [];

  if (inferredContext.audience)
    labels.push(`${label('audience')}: ${inferredContext.audience}`);
  if (inferredContext.tone)
    labels.push(`${label('tone')}: ${inferredContext.tone}`);
  if (inferredContext.callToAction)
    labels.push(`${label('callToAction')}: ${inferredContext.callToAction}`);
  if (inferredContext.format)
    labels.push(`${label('format')}: ${inferredContext.format}`);
  if (inferredContext.constraints?.length) {
    labels.push(
      `${label('constraints')}: ${inferredContext.constraints.join('; ')}`,
    );
  }
  if (inferredContext.objective)
    labels.push(`${label('objective')}: ${inferredContext.objective}`);

  return labels;
}

function fillMatchesMissingItem(item, inferredContext, t) {
  const normalizedItem = normalizeText(item);

  if (
    /destinatario|publico|audiencia|cliente|usuario|lead|audience|recipient|customer|user/.test(
      normalizedItem,
    )
  ) {
    return Boolean(inferredContext.audience);
  }
  if (/tono|estilo|tone|style/.test(normalizedItem))
    return Boolean(inferredContext.tone);
  if (
    /objetivo|resultado|queres|esperada|goal|result|expected|you want/.test(
      normalizedItem,
    )
  ) {
    return Boolean(inferredContext.objective || inferredContext.callToAction);
  }
  if (/formato|salida|entrega|format|output|deliverable/.test(normalizedItem)) {
    return Boolean(inferredContext.format);
  }
  if (
    /restric|limite|condicion|privacidad|presupuesto|plazo|constraint|limit|condition|privacy|budget|deadline/.test(
      normalizedItem,
    )
  ) {
    return Boolean(inferredContext.constraints?.length);
  }
  if (
    /contexto|material|documento|archivo|texto|context|document|file|text/.test(
      normalizedItem,
    )
  ) {
    return Boolean(inferredContext.sourceSummary);
  }

  return inferredLabels(inferredContext, t).some((label) =>
    normalizeText(label).includes(normalizedItem),
  );
}

function getInitialMissingItems(missingContextAudit, advice, category, t) {
  if (missingContextAudit?.missingItems?.length)
    return missingContextAudit.missingItems;
  if (advice?.checklist?.length) return advice.checklist;
  if (category?.checklist?.length) return category.checklist;
  return t('autofillLogic.defaultMissingItems');
}

function buildUpdatedPrompt({
  userText,
  category,
  inferredContext,
  filledItems,
  stillMissingItems,
  t,
}) {
  const categoryLabel = category?.label || t('autofillLogic.theTask');
  const bullets = (items, emptyKey) =>
    items.length
      ? items.map((item) => `- ${item}`).join('\n')
      : `- ${t(`autofillLogic.updatedPrompt.${emptyKey}`)}`;

  const inferredBlock = bullets(
    inferredLabels(inferredContext, t),
    'noInferred',
  );
  const filledBlock = bullets(filledItems, 'noFilled');
  const missingBlock = bullets(stillMissingItems, 'noMissing');

  return `${t('autofillLogic.updatedPrompt.role', { category: categoryLabel })}

${t('autofillLogic.updatedPrompt.objectiveIntro')}
"${userText || t('autofillLogic.updatedPrompt.fallbackObjective')}"

${t('autofillLogic.updatedPrompt.inferredIntro')}
${inferredBlock}

${t('autofillLogic.updatedPrompt.filledIntro')}
${filledBlock}

${t('autofillLogic.updatedPrompt.missingIntro')}
${missingBlock}

${t('autofillLogic.updatedPrompt.closing')}`;
}

export function autofillContextFromReference({
  userText = '',
  referenceText = '',
  category = {},
  advice = {},
  missingContextAudit = null,
  locale = DEFAULT_LOCALE,
}) {
  const t = getTranslator(locale);
  const cleanReference = String(referenceText || '').trim();
  const normalizedReference = normalizeText(cleanReference);
  const initialMissingItems = getInitialMissingItems(
    missingContextAudit,
    advice,
    category,
    t,
  );

  // Con menos de 8 palabras el material no da para inferir nada confiable:
  // se devuelven los faltantes intactos y un prompt sin contexto agregado.
  if (
    !normalizedReference ||
    normalizedReference.split(' ').filter(Boolean).length < 8
  ) {
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
        t,
      }),
    };
  }

  const inferredContext = {
    audience: detectFirstSignal(
      normalizedReference,
      audienceSignals,
      t,
      'audience',
    ),
    tone: detectFirstSignal(normalizedReference, toneSignals, t, 'tone'),
    callToAction: detectFirstSignal(normalizedReference, ctaSignals, t, 'cta'),
    format: detectFirstSignal(normalizedReference, formatSignals, t, 'format'),
    constraints: detectConstraints(cleanReference, normalizedReference),
    sourceSummary: sentenceSummary(cleanReference),
  };

  if (userText) {
    inferredContext.objective = sentenceSummary(userText);
  }

  Object.keys(inferredContext).forEach((key) => {
    if (
      Array.isArray(inferredContext[key]) &&
      inferredContext[key].length === 0
    )
      delete inferredContext[key];
    if (!inferredContext[key]) delete inferredContext[key];
  });

  const filledItems = initialMissingItems.filter((item) =>
    fillMatchesMissingItem(item, inferredContext, t),
  );
  const stillMissingItems = initialMissingItems.filter(
    (item) => !filledItems.includes(item),
  );
  const label = (key) => t(`autofillLogic.labels.${key}`);
  const detectedSignals = unique([
    ...detectAllSignals(
      normalizedReference,
      audienceSignals,
      t,
      'audience',
    ).map((item) => `${label('audience')}: ${item}`),
    ...detectAllSignals(normalizedReference, toneSignals, t, 'tone').map(
      (item) => `${label('tone')}: ${item}`,
    ),
    ...detectAllSignals(normalizedReference, ctaSignals, t, 'cta').map(
      (item) => `${label('callToAction')}: ${item}`,
    ),
    ...detectAllSignals(normalizedReference, formatSignals, t, 'format').map(
      (item) => `${label('format')}: ${item}`,
    ),
    ...(inferredContext.constraints || []).map(
      (item) => `${label('constraint')}: ${item}`,
    ),
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
      t,
    }),
  };
}
