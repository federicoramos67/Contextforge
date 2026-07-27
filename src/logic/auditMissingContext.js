import { DEFAULT_LOCALE, getTranslator } from '../i18n/index.js';
import { normalizeText, unique } from './textUtils';

// Señales que indican que un item del checklist ya está cubierto por el prompt.
// `match` identifica de qué trata el item del checklist (que viene traducido,
// por eso el patrón contempla ambos idiomas) y `signals` son las palabras que,
// si aparecen en el prompt del usuario, dan ese item por cubierto.
const itemSignals = [
  {
    match: /codigo|archivo|bloque|code|file|block|snippet/,
    signals: [
      'codigo',
      'archivo',
      'componente',
      'funcion',
      'script',
      'repo',
      'react',
      'vite',
      'node',
      'python',
      'javascript',
      'code',
      'file',
      'function',
      'component',
    ],
  },
  {
    match: /error|mensaje|message/,
    signals: [
      'error',
      'mensaje',
      'stack',
      'trace',
      'log',
      'terminal',
      'exception',
      'failed',
      'falla',
      'message',
    ],
  },
  {
    match:
      /esperabas|salida esperada|output esperado|resultado esperado|expected|you expected/,
    signals: [
      'espero',
      'esperaba',
      'deberia',
      'salida esperada',
      'output esperado',
      'resultado esperado',
      'quiero que devuelva',
      'expected',
      'should return',
    ],
  },
  {
    match: /paso realmente|paso actual|que paso|actually happened|what happens/,
    signals: [
      'paso',
      'ocurre',
      'sucede',
      'actualmente',
      'en realidad',
      'recibo',
      'devuelve',
      'happens',
      'returns',
      'currently',
    ],
  },
  {
    match: /comando|command/,
    signals: [
      'npm',
      'node',
      'python',
      'py ',
      'pnpm',
      'yarn',
      'comando',
      'terminal',
      'powershell',
      'command',
    ],
  },
  {
    match: /workflow|flujo|flow/,
    signals: [
      'workflow',
      'flujo',
      'json',
      'export',
      'exportado',
      'n8n',
      'exported',
    ],
  },
  {
    match: /nodo|node/,
    signals: [
      'nodo',
      'node problematico',
      'http request',
      'set node',
      'code node',
      'if node',
      'node',
    ],
  },
  {
    match: /input|entrada/,
    signals: [
      'input',
      'entrada',
      'payload',
      'webhook',
      'datos de ejemplo',
      'ejemplo de entrada',
      'example input',
    ],
  },
  {
    match: /servicio|herramienta|service|tool/,
    signals: [
      'servicio',
      'gmail',
      'slack',
      'sheets',
      'api',
      'webhook',
      'zapier',
      'make',
      'n8n',
      'service',
      'tool',
    ],
  },
  {
    match: /frecuencia|frequency/,
    signals: [
      'frecuencia',
      'diario',
      'cada',
      'semanal',
      'mensual',
      'cuando llega',
      'trigger',
      'daily',
      'weekly',
      'monthly',
      'frequency',
    ],
  },
  {
    match: /restric|limite|condicion|constraint|limit|condition/,
    signals: [
      'restriccion',
      'limite',
      'condicion',
      'sin',
      'solo',
      'no puedo',
      'privacidad',
      'credenciales',
      'constraint',
      'limit',
      'without',
      'only',
      'privacy',
    ],
  },
  {
    match: /objetivo|pregunta central|goal|core question/,
    signals: [
      'quiero',
      'necesito',
      'busco',
      'objetivo',
      'ayuda',
      'resolver',
      'analizar',
      'corregir',
      'want',
      'need',
      'goal',
      'solve',
      'fix',
    ],
  },
  {
    match: /contexto|context/,
    signals: [
      'contexto',
      'situacion',
      'caso',
      'actualmente',
      'tengo',
      'estoy trabajando',
      'context',
      'currently',
      'i have',
    ],
  },
  {
    match:
      /material disponible|documento|archivo de datos|captura|url|available material|screenshot|data file/,
    signals: [
      'tengo',
      'adjunto',
      'archivo',
      'captura',
      'pdf',
      'csv',
      'excel',
      'url',
      'link',
      'codigo',
      'attached',
      'screenshot',
      'file',
    ],
  },
  {
    match:
      /formato de salida|que queres recibir|tipo de entrega|output format|you want to receive|deliverable/,
    signals: [
      'formato',
      'tabla',
      'lista',
      'paso a paso',
      'checklist',
      'resumen',
      'diagnostico',
      'codigo corregido',
      'format',
      'table',
      'list',
      'step by step',
      'summary',
    ],
  },
];

function getChecklist(category, t) {
  if (Array.isArray(category?.checklist) && category.checklist.length) {
    return category.checklist.filter(Boolean);
  }

  return t('auditLogic.generalChecklist');
}

function getSignalsForItem(item) {
  const normalizedItem = normalizeText(item);
  const words = normalizedItem.split(' ').filter((word) => word.length > 3);
  const mappedSignals = itemSignals
    .filter(({ match }) => match.test(normalizedItem))
    .flatMap(({ signals }) => signals);

  return unique([...words, ...mappedSignals]).map(normalizeText);
}

function hasItemContext(normalizedText, item) {
  const signals = getSignalsForItem(item);
  if (!signals.length) return false;

  return signals.some((signal) => {
    if (!signal || signal.length < 3) return false;
    return normalizedText.includes(signal);
  });
}

function buildRiskWarning(item, categoryLabel, categoryId, t) {
  const normalizedItem = normalizeText(item);

  if (
    categoryId === 'n8n_automation' &&
    /workflow|nodo|node|input|output|error/.test(normalizedItem)
  ) {
    return t('auditLogic.risks.n8n');
  }

  if (
    categoryId === 'programming_debug' &&
    /codigo|code|error|comando|command/.test(normalizedItem)
  ) {
    return t('auditLogic.risks.programming');
  }

  if (/error|mensaje|message/.test(normalizedItem)) {
    return t('auditLogic.risks.error');
  }

  if (/input|entrada|output|salida/.test(normalizedItem)) {
    return t('auditLogic.risks.io');
  }

  if (
    /codigo|code|archivo|file|workflow|flujo|flow|nodo|node/.test(
      normalizedItem,
    )
  ) {
    return t('auditLogic.risks.material', {
      item: item.toLowerCase(),
      category: categoryLabel,
    });
  }

  if (
    /restric|limite|condicion|credencial|constraint|limit|condition|credential/.test(
      normalizedItem,
    )
  ) {
    return t('auditLogic.risks.constraints');
  }

  if (
    /objetivo|esperabas|resultado|formato|goal|expected|result|format/.test(
      normalizedItem,
    )
  ) {
    return t('auditLogic.risks.objective');
  }

  return t('auditLogic.risks.generic', { item: item.toLowerCase() });
}

function buildQuestion(item, t) {
  const normalizedItem = normalizeText(item);

  if (/error|mensaje|message/.test(normalizedItem))
    return t('auditLogic.questions.error');
  if (/codigo|code|archivo|file|bloque|block/.test(normalizedItem))
    return t('auditLogic.questions.code');
  if (/workflow|flujo|flow/.test(normalizedItem))
    return t('auditLogic.questions.workflow');
  if (/nodo|node/.test(normalizedItem)) return t('auditLogic.questions.node');
  if (/input|entrada/.test(normalizedItem))
    return t('auditLogic.questions.input');
  if (/output|salida|resultado|result/.test(normalizedItem))
    return t('auditLogic.questions.output');
  if (
    /restric|limite|condicion|constraint|limit|condition/.test(normalizedItem)
  ) {
    return t('auditLogic.questions.constraints');
  }
  if (
    /formato|que queres recibir|tipo de entrega|format|you want to receive|deliverable/.test(
      normalizedItem,
    )
  ) {
    return t('auditLogic.questions.format');
  }
  if (/objetivo|goal/.test(normalizedItem))
    return t('auditLogic.questions.objective');

  return t('auditLogic.questions.generic', { item });
}

export function auditMissingContext(
  userText,
  category = {},
  locale = DEFAULT_LOCALE,
) {
  const t = getTranslator(locale);
  const normalizedText = normalizeText(userText);
  const categoryLabel = category?.label || t('auditLogic.thisQuery');
  const categoryId = category?.id || 'general_context';
  const checklist = getChecklist(category, t);

  const missingItems = checklist.filter(
    (item) => !hasItemContext(normalizedText, item),
  );
  const selectedMissingItems = missingItems.length
    ? missingItems.slice(0, 5)
    : t('auditLogic.fallbackMissingItems');

  const riskWarnings = unique(
    missingItems.length
      ? selectedMissingItems.map((item) =>
          buildRiskWarning(item, categoryLabel, categoryId, t),
        )
      : t('auditLogic.generalRisks'),
  ).slice(0, 4);

  const clarificationQuestions = unique(
    selectedMissingItems.map((item) => buildQuestion(item, t)),
  ).slice(0, 5);

  return {
    missingItems: selectedMissingItems,
    riskWarnings,
    clarificationQuestions,
  };
}
