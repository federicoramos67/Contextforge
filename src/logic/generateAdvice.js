import { DEFAULT_LOCALE, getTranslator } from '../i18n/index.js';

export function generateAdvice(category, locale = DEFAULT_LOCALE) {
  const t = getTranslator(locale);
  const matchedKeywords = category.matchedKeywords || [];
  const diagnosticExplanation = matchedKeywords.length
    ? t('advice.diagnosticWithKeywords', {
        keywords: matchedKeywords.join(', '),
      })
    : t('advice.diagnosticWithoutKeywords');

  return {
    category: category.label,
    confidence: category.confidence,
    description: category.description,
    primaryFormats: category.primaryFormats,
    secondaryFormats: category.secondaryFormats,
    avoid: category.avoid,
    checklist: category.checklist,
    reason: category.reason,
    matchedKeywords,
    diagnosticExplanation,
  };
}
