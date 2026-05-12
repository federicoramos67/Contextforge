import rules from '../data/contextRules.json';
import { normalizeText } from './textUtils';

function matchesKeyword(text, keyword) {
  const normalizedKeyword = normalizeText(keyword);

  if (text.includes(normalizedKeyword)) return true;

  const keywordParts = normalizedKeyword.split(' ');
  return keywordParts.length > 1 && keywordParts.every((part) => text.includes(part));
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
      const matchedKeywords = rule.keywords.filter((keyword) => matchesKeyword(normalized, keyword));

      const score = matchedKeywords.reduce((total, keyword) => {
        const normalizedKeyword = normalizeText(keyword);
        const weight = normalizedKeyword.length > 7 ? 2 : 1;
        return total + weight;
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

  const maxReasonableScore = 12;
  const baseConfidence = Math.round((best.score / maxReasonableScore) * 100);
  const keywordBonus = Math.min(25, best.matchedKeywords.length * 8);
  const confidence = Math.min(95, baseConfidence + keywordBonus);

  return {
    ...best,
    confidence,
  };
}
