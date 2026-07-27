import {
  RULE_IDS,
  GENERAL_CONTEXT_ID,
  getGeneralContextRule,
  getRule,
  getRuleVariants,
} from '../data/rules.js';
import { DEFAULT_LOCALE } from '../i18n/index.js';
import { normalizeText } from './textUtils';

function matchesKeyword(text, keyword) {
  const normalizedKeyword = normalizeText(keyword);

  if (normalizedKeyword.length <= 3) {
    return new RegExp(`(^|\\s)${normalizedKeyword}(?=\\s|$)`).test(text);
  }

  if (text.includes(normalizedKeyword)) return true;

  const keywordParts = normalizedKeyword.split(' ');
  return (
    keywordParts.length > 1 && keywordParts.every((part) => text.includes(part))
  );
}

// Las listas de desambiguación son deliberadamente multilingües: describen
// señales del texto del usuario, no textos de interfaz, y el prompt puede
// venir en cualquier idioma sin importar en cuál esté la interfaz.
const documentPriorityKeywords = [
  'pdf',
  'documento',
  'informe',
  'resumen',
  'resumir',
  'resumi',
  'libro',
  'manual',
  'tesis',
  'paper',
  'document',
  'report',
  'summary',
  'summarize',
  'summarise',
  'book',
  'thesis',
  'whitepaper',
];
const marketingPriorityKeywords = [
  'campana',
  'campaña',
  'email',
  'correo',
  'newsletter',
  'marketing',
  'clientes',
  'suscripcion',
  'suscripción',
  'suscripciones',
  'renovar',
  'cta',
  'llamada a la accion',
  'llamada a la acción',
  'campaign',
  'customers',
  'subscription',
  'subscriptions',
  'renew',
  'call to action',
  'copywriting',
  'funnel',
];
const strongWebKeywords = [
  'landing',
  'seo',
  'url',
  'enlace',
  'html',
  'hero',
  'cta',
  'conversion',
  'conversión',
  'link',
  'bounce rate',
  'ranking',
];
const ambiguousWebPageKeywords = ['pagina', 'página', 'page'];
// 'web' es demasiado genérica: aparece en visual_ui y web_analysis y no debería
// dominar la clasificación por sí sola. Cuando el prompt trae señales fuertes de
// automatización, se suprime para esas categorías y deja ganar a `automation`.
const ambiguousGenericWebKeywords = ['web'];
const automationSignalKeywords = [
  'webhook',
  'flujo',
  'planilla',
  'trigger',
  'automatiz',
  'workflow',
  'automat',
  'pipeline',
  'spreadsheet',
];
const webKeywordSuppressedRules = ['visual_ui', 'web_analysis'];

function hasDocumentContext(text) {
  return documentPriorityKeywords.some((keyword) =>
    text.includes(normalizeText(keyword)),
  );
}

function hasAutomationContext(text) {
  return automationSignalKeywords.some((keyword) =>
    text.includes(normalizeText(keyword)),
  );
}

function isSuppressedWebKeyword(ruleId, keyword, text) {
  const normalizedKeyword = normalizeText(keyword);

  // 'pagina'/'página'/'page' no cuentan para web_analysis cuando el prompt es un documento.
  if (
    ruleId === 'web_analysis' &&
    hasDocumentContext(text) &&
    ambiguousWebPageKeywords.map(normalizeText).includes(normalizedKeyword)
  ) {
    return true;
  }

  // 'web' no cuenta para categorías visuales/web cuando hay señales de automatización.
  if (
    webKeywordSuppressedRules.includes(ruleId) &&
    ambiguousGenericWebKeywords
      .map(normalizeText)
      .includes(normalizedKeyword) &&
    hasAutomationContext(text)
  ) {
    return true;
  }

  return false;
}

function getKeywordWeight(keyword, ruleId) {
  const normalizedKeyword = normalizeText(keyword);

  if (
    ruleId === 'long_document' &&
    documentPriorityKeywords.map(normalizeText).includes(normalizedKeyword)
  ) {
    return 3;
  }

  if (
    ruleId === 'marketing_campaign' &&
    marketingPriorityKeywords.map(normalizeText).includes(normalizedKeyword)
  ) {
    return 4;
  }

  if (
    ruleId === 'web_analysis' &&
    strongWebKeywords.map(normalizeText).includes(normalizedKeyword)
  ) {
    return 3;
  }

  return normalizedKeyword.length > 7 ? 2 : 1;
}

// Puntúa una categoría contra el texto usando la lista de keywords de un idioma.
function scoreVariant(normalized, { locale, rule }) {
  const matchedKeywords = rule.keywords.filter((keyword) => {
    return (
      matchesKeyword(normalized, keyword) &&
      !isSuppressedWebKeyword(rule.id, keyword, normalized)
    );
  });

  const score = matchedKeywords.reduce(
    (total, keyword) => total + getKeywordWeight(keyword, rule.id),
    0,
  );

  // Máximo teórico de esta variante, usado para normalizar la confianza.
  const maxPossibleScore = rule.keywords.reduce(
    (total, keyword) => total + getKeywordWeight(keyword, rule.id),
    0,
  );

  return { id: rule.id, locale, score, maxPossibleScore, matchedKeywords };
}

/**
 * Elige la mejor variante de una categoría.
 *
 * Ante un empate gana la del idioma activo. Sin este desempate, un prompt en
 * español podía ganar por la variante en inglés (que puntúa igual, con las
 * mismas keywords traducidas) y las señales detectadas se le mostraban al
 * usuario en un idioma que no es el que está leyendo.
 */
function pickBestVariant(variants, locale) {
  return variants.reduce((best, current) => {
    if (current.score !== best.score)
      return current.score > best.score ? current : best;
    if (current.locale === locale) return current;
    return best;
  });
}

/**
 * Clasifica un prompt contra las reglas locales.
 *
 * Cada categoría se puntúa una vez por idioma disponible y se conserva el
 * mejor resultado, de modo que el idioma del prompt y el de la interfaz son
 * independientes: un prompt en español clasifica igual de bien con la interfaz
 * en inglés. `locale` solo decide en qué idioma se devuelven los textos de la
 * categoría ganadora.
 */
export function classifyPrompt(text, locale = DEFAULT_LOCALE) {
  const normalized = normalizeText(text);

  if (!normalized || normalized.length < 8) {
    return {
      ...getGeneralContextRule(locale),
      confidence: 0,
      matchedKeywords: [],
    };
  }

  const scored = RULE_IDS.filter((id) => id !== GENERAL_CONTEXT_ID)
    .map((id) =>
      pickBestVariant(
        getRuleVariants(id).map((variant) => scoreVariant(normalized, variant)),
        locale,
      ),
    )
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  if (!best || best.score === 0) {
    return {
      ...getGeneralContextRule(locale),
      confidence: 20,
      matchedKeywords: [],
    };
  }

  const baseConfidence = Math.round((best.score / best.maxPossibleScore) * 100);
  const keywordBonus = Math.min(25, best.matchedKeywords.length * 8);
  const confidence = Math.min(95, baseConfidence + keywordBonus);

  return {
    ...getRule(best.id, locale),
    confidence,
    matchedKeywords: best.matchedKeywords,
  };
}
