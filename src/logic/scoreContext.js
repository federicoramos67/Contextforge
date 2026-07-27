import { DEFAULT_LOCALE, getTranslator } from '../i18n/index.js';
import { normalizeText } from './textUtils';

// Cada check aporta puntos si su patrón aparece en el prompt. Los patrones
// cubren vocabulario en español y en inglés porque el usuario puede escribir en
// cualquier idioma, independientemente del idioma de la interfaz. Las etiquetas
// y las sugerencias sí se traducen, y viven en los diccionarios de i18n bajo
// `score.checks.<id>` y `score.improvementHints.<id>`.
//
// Los patrones se comparan contra texto ya normalizado (minúsculas y sin
// acentos), por eso se escriben en su forma sin tildes.
const checks = [
  {
    id: 'goal',
    points: 25,
    test: (text) =>
      /quiero|necesito|busco|objetivo|ayuda|crear|analizar|corregir|configurar|resolver|mejorar|want|need|goal|help|create|analyz|analys|fix|configure|solve|improve|build/.test(
        text,
      ),
  },
  {
    id: 'contentType',
    points: 20,
    test: (text) =>
      /pdf|captura|imagen|codigo|html|url|enlace|texto|excel|csv|video|audio|log|documento|web|pagina|screenshot|image|code|link|text|document|page|spreadsheet|dataset|file|table/.test(
        text,
      ),
  },
  {
    id: 'problem',
    points: 20,
    test: (text) =>
      /problema|error|no funciona|falla|duda|mejorar|optimizar|revisar|evaluar|comparar|decidir|entender|not working|fail|issue|bug|optimi|review|evaluate|compare|decide|understand/.test(
        text,
      ),
  },
  {
    id: 'expectedOutput',
    points: 20,
    test: (text) =>
      /resultado|salida|entregable|lista|tabla|paso a paso|resumen|codigo corregido|plan|guia|diagnostico|result|output|deliverable|list|step by step|summary|fixed code|guide|diagnosis|checklist/.test(
        text,
      ),
  },
  {
    id: 'constraints',
    points: 15,
    test: (text) =>
      /sin|con|solo|gratis|windows|linux|android|tiempo|presupuesto|novato|principiante|rapido|local|online|no tengo|without|only|free|budget|beginner|constraint|deadline|quick|fast|limit/.test(
        text,
      ),
  },
];

// Umbrales de calidad. `levelId` es estable entre idiomas y es lo que usa la UI
// para elegir el color del badge; `level` es solo la etiqueta traducida.
function resolveLevelId(score) {
  if (score >= 80) return 'high';
  if (score >= 55) return 'medium';
  return 'low';
}

export function scoreContext(text, locale = DEFAULT_LOCALE) {
  const t = getTranslator(locale);
  const normalized = normalizeText(text);
  const results = checks.map((check) => ({
    id: check.id,
    label: t(`score.checks.${check.id}`),
    points: check.points,
    passed: check.test(normalized),
  }));

  const score = results.reduce(
    (total, item) => total + (item.passed ? item.points : 0),
    0,
  );
  const improvements = results
    .filter((item) => !item.passed)
    .map((item) => t(`score.improvementHints.${item.id}`));
  const levelId = resolveLevelId(score);

  return {
    score,
    levelId,
    level: t(`score.levels.${levelId}`),
    checks: results,
    improvements,
  };
}
