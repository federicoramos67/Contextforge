export function generateAdvice(category) {
  const matchedKeywords = category.matchedKeywords || [];
  const diagnosticExplanation = matchedKeywords.length
    ? `Se detectó esta categoría porque el prompt contiene señales como: ${matchedKeywords.join(', ')}.`
    : 'Se detectó esta categoría por coincidencias generales del texto, sin keywords específicas.';

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
