import { normalizeText, unique } from './textUtils';

const GENERAL_CHECKLIST = [
  'Objetivo',
  'Contexto',
  'Material disponible',
  'Que queres recibir',
  'Limites o condiciones',
];

const GENERAL_RISKS = [
  'La IA puede responder de forma generica si no entiende el objetivo concreto.',
  'Puede inventar detalles o asumir restricciones que no fueron indicadas.',
  'La respuesta puede requerir varias idas y vueltas para llegar a algo usable.',
];

const itemSignals = [
  {
    match: /codigo|archivo|bloque/,
    signals: ['codigo', 'archivo', 'componente', 'funcion', 'script', 'repo', 'react', 'vite', 'node', 'python', 'javascript'],
  },
  {
    match: /error|mensaje/,
    signals: ['error', 'mensaje', 'stack', 'trace', 'log', 'terminal', 'exception', 'failed', 'falla'],
  },
  {
    match: /esperabas|salida esperada|output esperado|resultado esperado/,
    signals: ['espero', 'esperaba', 'deberia', 'salida esperada', 'output esperado', 'resultado esperado', 'quiero que devuelva'],
  },
  {
    match: /paso realmente|paso actual|que paso/,
    signals: ['paso', 'ocurre', 'sucede', 'actualmente', 'en realidad', 'recibo', 'devuelve'],
  },
  {
    match: /comando/,
    signals: ['npm', 'node', 'python', 'py ', 'pnpm', 'yarn', 'comando', 'terminal', 'powershell'],
  },
  {
    match: /workflow|flujo/,
    signals: ['workflow', 'flujo', 'json', 'export', 'exportado', 'n8n'],
  },
  {
    match: /nodo/,
    signals: ['nodo', 'node problematico', 'http request', 'set node', 'code node', 'if node'],
  },
  {
    match: /input|entrada/,
    signals: ['input', 'entrada', 'payload', 'webhook', 'datos de ejemplo', 'ejemplo de entrada'],
  },
  {
    match: /servicio|herramienta/,
    signals: ['servicio', 'gmail', 'slack', 'sheets', 'api', 'webhook', 'zapier', 'make', 'n8n'],
  },
  {
    match: /frecuencia/,
    signals: ['frecuencia', 'diario', 'cada', 'semanal', 'mensual', 'cuando llega', 'trigger'],
  },
  {
    match: /restric|limite|condicion/,
    signals: ['restriccion', 'limite', 'condicion', 'sin', 'solo', 'no puedo', 'privacidad', 'credenciales'],
  },
  {
    match: /objetivo|pregunta central/,
    signals: ['quiero', 'necesito', 'busco', 'objetivo', 'ayuda', 'resolver', 'analizar', 'corregir'],
  },
  {
    match: /contexto/,
    signals: ['contexto', 'situacion', 'caso', 'actualmente', 'tengo', 'estoy trabajando'],
  },
  {
    match: /material disponible|documento|archivo de datos|captura|url/,
    signals: ['tengo', 'adjunto', 'archivo', 'captura', 'pdf', 'csv', 'excel', 'url', 'link', 'codigo'],
  },
  {
    match: /formato de salida|que queres recibir|tipo de entrega/,
    signals: ['formato', 'tabla', 'lista', 'paso a paso', 'checklist', 'resumen', 'diagnostico', 'codigo corregido'],
  },
];

function getChecklist(category) {
  if (Array.isArray(category?.checklist) && category.checklist.length) {
    return category.checklist.filter(Boolean);
  }

  return GENERAL_CHECKLIST;
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

function buildRiskWarning(item, categoryLabel, categoryId) {
  const normalizedItem = normalizeText(item);

  if (categoryId === 'n8n_automation' && /workflow|nodo|input|output|error/.test(normalizedItem)) {
    return 'En n8n, sin workflow, nodo, datos y error exacto, es facil proponer cambios en el lugar equivocado.';
  }

  if (categoryId === 'programming_debug' && /codigo|error|comando/.test(normalizedItem)) {
    return 'En programacion, sin codigo, error y comando, la IA puede confundir sintomas con causa raiz.';
  }

  if (/error|mensaje/.test(normalizedItem)) {
    return 'Sin el error completo, la IA puede diagnosticar una causa equivocada.';
  }

  if (/input|entrada|output|salida/.test(normalizedItem)) {
    return 'Sin ejemplos de entrada y salida, es facil proponer una solucion que no encaje con los datos reales.';
  }

  if (/codigo|archivo|workflow|flujo|nodo/.test(normalizedItem)) {
    return `Sin ${item.toLowerCase()}, la respuesta para ${categoryLabel} puede quedarse en recomendaciones demasiado generales.`;
  }

  if (/restric|limite|condicion|credencial/.test(normalizedItem)) {
    return 'Sin restricciones claras, la IA puede sugerir pasos inviables o inseguros.';
  }

  if (/objetivo|esperabas|resultado|formato/.test(normalizedItem)) {
    return 'Sin definir el resultado esperado, la IA puede optimizar para una meta distinta a la tuya.';
  }

  return `Falta ${item.toLowerCase()}, asi que la IA podria asumirlo en lugar de pedirlo.`;
}

function buildQuestion(item) {
  const normalizedItem = normalizeText(item);

  if (/error|mensaje/.test(normalizedItem)) {
    return 'Cual es el mensaje de error completo y en que momento aparece?';
  }

  if (/codigo|archivo|bloque/.test(normalizedItem)) {
    return 'Que archivo, bloque de codigo o fragmento exacto deberia revisar la IA?';
  }

  if (/workflow|flujo/.test(normalizedItem)) {
    return 'Podes compartir el workflow exportado sin credenciales o describir sus pasos principales?';
  }

  if (/nodo/.test(normalizedItem)) {
    return 'Que nodo falla o concentra el comportamiento que queres corregir?';
  }

  if (/input|entrada/.test(normalizedItem)) {
    return 'Cual es un ejemplo realista de entrada que recibe el sistema?';
  }

  if (/output|salida|resultado/.test(normalizedItem)) {
    return 'Que salida esperabas recibir y que salida estas obteniendo ahora?';
  }

  if (/restric|limite|condicion/.test(normalizedItem)) {
    return 'Que restricciones, herramientas o condiciones debe respetar la respuesta?';
  }

  if (/formato|que queres recibir|tipo de entrega/.test(normalizedItem)) {
    return 'En que formato queres recibir la respuesta final?';
  }

  if (/objetivo/.test(normalizedItem)) {
    return 'Cual es el objetivo concreto que queres lograr con la IA?';
  }

  return `Que informacion podes agregar sobre "${item}"?`;
}

export function auditMissingContext(userText, category = {}) {
  const normalizedText = normalizeText(userText);
  const categoryLabel = category?.label || 'esta consulta';
  const categoryId = category?.id || 'general_context';
  const checklist = getChecklist(category);

  const missingItems = checklist.filter((item) => !hasItemContext(normalizedText, item));
  const selectedMissingItems = missingItems.length
    ? missingItems.slice(0, 5)
    : [
        'Ejemplo concreto o caso real',
        'Restricciones o limites importantes',
        'Formato exacto de salida',
      ];

  const riskWarnings = unique(
    (missingItems.length ? selectedMissingItems.map((item) => buildRiskWarning(item, categoryLabel, categoryId)) : GENERAL_RISKS)
  ).slice(0, 4);

  const clarificationQuestions = unique(
    selectedMissingItems.map((item) => buildQuestion(item))
  ).slice(0, 5);

  return {
    missingItems: selectedMissingItems,
    riskWarnings,
    clarificationQuestions,
  };
}
