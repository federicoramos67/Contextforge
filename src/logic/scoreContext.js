import { normalizeText } from './textUtils';

const checks = [
  {
    id: 'goal',
    label: 'Objetivo claro',
    points: 25,
    test: (text) => /quiero|necesito|busco|objetivo|ayuda|crear|analizar|corregir|configurar|resolver|mejorar/.test(text),
    improvement: 'Agregá una frase que empiece con “Quiero lograr...” o “Necesito que la IA...”.',
  },
  {
    id: 'contentType',
    label: 'Tipo de contenido mencionado',
    points: 20,
    test: (text) => /pdf|captura|imagen|codigo|html|url|enlace|texto|excel|csv|video|audio|log|documento|web|pagina/.test(text),
    improvement: 'Indicá qué material tenés disponible: captura, PDF, código, URL, texto, tabla, logs, etc.',
  },
  {
    id: 'problem',
    label: 'Problema o necesidad concreta',
    points: 20,
    test: (text) => /problema|error|no funciona|falla|duda|mejorar|optimizar|revisar|evaluar|comparar|decidir|entender/.test(text),
    improvement: 'Explicá cuál es el problema, duda o necesidad concreta.',
  },
  {
    id: 'expectedOutput',
    label: 'Resultado esperado',
    points: 20,
    test: (text) => /resultado|salida|entregable|lista|tabla|paso a paso|resumen|codigo corregido|plan|guia|guía|diagnostico|diagnóstico/.test(text),
    improvement: 'Pedí un resultado concreto: tabla, guía paso a paso, diagnóstico, resumen, código corregido o checklist.',
  },
  {
    id: 'constraints',
    label: 'Restricciones o contexto',
    points: 15,
    test: (text) => /sin|con|solo|gratis|windows|linux|android|tiempo|presupuesto|novato|principiante|rapido|rápido|local|online|no tengo/.test(text),
    improvement: 'Agregá restricciones: sistema operativo, nivel de experiencia, presupuesto, herramientas disponibles o límites.',
  },
];

export function scoreContext(text) {
  const normalized = normalizeText(text);
  const results = checks.map((check) => ({
    ...check,
    passed: check.test(normalized),
  }));

  const score = results.reduce((total, item) => total + (item.passed ? item.points : 0), 0);
  const improvements = results.filter((item) => !item.passed).map((item) => item.improvement);

  let level = 'Bajo';
  if (score >= 80) level = 'Alto';
  else if (score >= 55) level = 'Medio';

  return {
    score,
    level,
    checks: results.map(({ id, label, points, passed }) => ({ id, label, points, passed })),
    improvements,
  };
}
