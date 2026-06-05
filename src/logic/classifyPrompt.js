import rules from '../data/contextRules.json';
import { normalizeText } from './textUtils';

function matchesKeyword(text, keyword) {
  const normalizedKeyword = normalizeText(keyword);

  if (normalizedKeyword.length <= 3) {
    return new RegExp(`(^|\\s)${normalizedKeyword}(?=\\s|$)`).test(text);
  }

  if (text.includes(normalizedKeyword)) return true;

  const keywordParts = normalizedKeyword.split(' ');
  return keywordParts.length > 1 && keywordParts.every((part) => text.includes(part));
}

const documentPriorityKeywords = ['pdf', 'documento', 'informe', 'resumen', 'resumir', 'resumi', 'libro', 'manual', 'tesis', 'paper'];
const marketingPriorityKeywords = ['campana', 'campaña', 'email', 'correo', 'newsletter', 'marketing', 'clientes', 'suscripcion', 'suscripción', 'suscripciones', 'renovar', 'cta', 'llamada a la accion', 'llamada a la acción'];
const strongWebKeywords = ['landing', 'seo', 'url', 'enlace', 'html', 'hero', 'cta', 'conversion', 'conversión'];
const ambiguousWebPageKeywords = ['pagina', 'página'];

function hasDocumentContext(text) {
  return documentPriorityKeywords.some((keyword) => text.includes(normalizeText(keyword)));
}

function isSuppressedWebKeyword(rule, keyword, text) {
  if (rule.id !== 'web_analysis' || !hasDocumentContext(text)) return false;

  const normalizedKeyword = normalizeText(keyword);
  return ambiguousWebPageKeywords.map(normalizeText).includes(normalizedKeyword);
}

function getKeywordWeight(keyword, ruleId) {
  const normalizedKeyword = normalizeText(keyword);

  if (ruleId === 'long_document' && documentPriorityKeywords.map(normalizeText).includes(normalizedKeyword)) {
    return 3;
  }

  if (ruleId === 'marketing_campaign' && marketingPriorityKeywords.map(normalizeText).includes(normalizedKeyword)) {
    return 4;
  }

  if (ruleId === 'web_analysis' && strongWebKeywords.map(normalizeText).includes(normalizedKeyword)) {
    return 3;
  }

  return normalizedKeyword.length > 7 ? 2 : 1;
}

export function classifyPrompt(text) {
  const normalized = normalizeText(text);

  if (!normalized || normalized.length < 8) {
    return {
      ...rules.find((rule) => rule.id === 'general_context'),
      confidence: 0,
      matchedKeywords: [],
    };
  }

  const scored = rules
    .filter((rule) => rule.id !== 'general_context')
    .map((rule) => {
      const matchedKeywords = rule.keywords.filter((keyword) => {
        return matchesKeyword(normalized, keyword) && !isSuppressedWebKeyword(rule, keyword, normalized);
      });

      const score = matchedKeywords.reduce((total, keyword) => {
        return total + getKeywordWeight(keyword, rule.id);
      }, 0);

      return { ...rule, score, matchedKeywords };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  if (!best || best.score === 0) {
    return {
      ...rules.find((rule) => rule.id === 'general_context'),
      confidence: 20,
      matchedKeywords: [],
    };
  }

  // Calcula el máximo posible para esta categoría según el peso real de sus keywords.
  const maxPossibleScore = best.keywords.reduce((total, keyword) => {
    return total + getKeywordWeight(keyword, best.id);
  }, 0);

  const baseConfidence = Math.round((best.score / maxPossibleScore) * 100);
  const keywordBonus = Math.min(25, best.matchedKeywords.length * 8);
  const confidence = Math.min(95, baseConfidence + keywordBonus);

  return {
    ...best,
    confidence,
  };
}
