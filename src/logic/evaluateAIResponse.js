import { DEFAULT_LOCALE, getTranslator } from '../i18n/index.js';
import { normalizeText, unique } from './textUtils';

// Marcadores de vaguedad y de acción concreta. Se comparan contra la respuesta
// pegada por el usuario, que puede estar en cualquier idioma, así que las
// listas son bilingües a propósito.
const vaguePatterns = [
  'depende',
  'podria',
  'en general',
  'tal vez',
  'quizas',
  'probablemente',
  'puede ser',
  'seria recomendable',
  'it depends',
  'might',
  'in general',
  'maybe',
  'perhaps',
  'probably',
  'could be',
  'it would be advisable',
];

const concreteStepPatterns = [
  /\b1[.)]/,
  /\b2[.)]/,
  /paso\s+\d/,
  /step\s+\d/,
  /primero/,
  /segundo/,
  /luego/,
  /despues/,
  /first/,
  /second/,
  /then/,
  /finally/,
  /hacer|hac[eé]|revis[aá]|cambi[aá]|agreg[aá]|ejecut[aá]|verific[aá]|prob[aá]|copi[aá]|peg[aá]/,
  /\brun\b|\bcheck\b|\bchange\b|\badd\b|\bverify\b|\btest\b|\bcopy\b|\bpaste\b|\breplace\b/,
];

// Palabras del prompt original demasiado genéricas para probar que la respuesta
// se mantuvo en tema.
const stopWords = [
  'necesito',
  'quiero',
  'ayuda',
  'sobre',
  'para',
  'este',
  'esta',
  'need',
  'want',
  'help',
  'about',
  'this',
  'that',
  'with',
  'from',
];

function includesAny(normalizedText, values = []) {
  return values.some((value) => {
    const normalizedValue = normalizeText(value);
    return normalizedValue && normalizedText.includes(normalizedValue);
  });
}

function checklistWeakPoints(normalizedResponse, checklist = [], t) {
  return checklist
    .filter(Boolean)
    .filter(
      (item) =>
        !includesAny(
          normalizedResponse,
          normalizeText(item)
            .split(' ')
            .filter((word) => word.length > 4),
        ),
    )
    .slice(0, 5)
    .map((item) => t('evaluatorLogic.notAddressed', { item }));
}

function hasConcreteSteps(normalizedResponse) {
  return concreteStepPatterns.some((pattern) =>
    pattern.test(normalizedResponse),
  );
}

function vagueMatches(normalizedResponse) {
  return vaguePatterns.filter((pattern) =>
    normalizedResponse.includes(normalizeText(pattern)),
  );
}

function objectiveWords(userText) {
  return normalizeText(userText)
    .split(' ')
    .filter((word) => word.length > 4)
    .filter((word) => !stopWords.includes(word));
}

function responseMentionsObjective(userText, normalizedResponse) {
  const words = objectiveWords(userText);
  if (!words.length) return true;

  const matches = words.filter((word) => normalizedResponse.includes(word));
  return matches.length >= Math.min(2, words.length);
}

function inferCompletionLevel({
  normalizedResponse,
  missingOrWeakPoints,
  riskWarnings,
  concreteSteps,
}) {
  const wordCount = normalizedResponse.split(' ').filter(Boolean).length;

  if (wordCount < 20) return 'low';
  if (!concreteSteps && riskWarnings.length >= 2) return 'low';
  if (
    missingOrWeakPoints.length <= 1 &&
    riskWarnings.length <= 1 &&
    concreteSteps &&
    wordCount >= 60
  )
    return 'high';
  return 'medium';
}

function buildStrengths({ normalizedResponse, advice, concreteSteps, t }) {
  const strengths = [];

  if (concreteSteps) {
    strengths.push(t('evaluatorLogic.strengths.concreteSteps'));
  }

  if (includesAny(normalizedResponse, advice?.primaryFormats || [])) {
    strengths.push(t('evaluatorLogic.strengths.mentionsFormat'));
  }

  if (includesAny(normalizedResponse, advice?.secondaryFormats || [])) {
    strengths.push(t('evaluatorLogic.strengths.considersSecondary'));
  }

  if (normalizedResponse.split(' ').filter(Boolean).length >= 80) {
    strengths.push(t('evaluatorLogic.strengths.developed'));
  }

  return strengths.length
    ? strengths
    : [t('evaluatorLogic.strengths.baseline')];
}

function buildNextPrompt({
  userText,
  category,
  missingOrWeakPoints,
  riskWarnings,
  missingContextAudit,
  t,
}) {
  const categoryLabel = category?.label || t('evaluatorLogic.originalTask');
  const bullets = (items) => items.map((item) => `- ${item}`).join('\n');

  const missingContext = bullets(
    missingContextAudit?.missingItems?.length
      ? missingContextAudit.missingItems
      : t('evaluatorLogic.nextPrompt.defaultMissingContext'),
  );

  const weakPoints = bullets(
    missingOrWeakPoints.length
      ? missingOrWeakPoints
      : t('evaluatorLogic.nextPrompt.defaultWeakPoints'),
  );

  const risks = bullets(
    riskWarnings.length
      ? riskWarnings
      : t('evaluatorLogic.nextPrompt.defaultRisks'),
  );

  const closing = bullets(t('evaluatorLogic.nextPrompt.closing'));

  return `${t('evaluatorLogic.nextPrompt.role', { category: categoryLabel })}

${t('evaluatorLogic.nextPrompt.objectiveIntro')}
"${userText || t('evaluatorLogic.nextPrompt.fallbackObjective')}"

${t('evaluatorLogic.nextPrompt.weakPointsIntro')}
${weakPoints}

${t('evaluatorLogic.nextPrompt.missingContextIntro')}
${missingContext}

${t('evaluatorLogic.nextPrompt.risksIntro')}
${risks}

${t('evaluatorLogic.nextPrompt.closingIntro')}
${closing}`;
}

export function evaluateAIResponse({
  userText = '',
  aiResponse = '',
  category = {},
  advice = {},
  missingContextAudit = null,
  locale = DEFAULT_LOCALE,
}) {
  const t = getTranslator(locale);
  const cleanResponse = String(aiResponse || '').trim();
  const normalizedResponse = normalizeText(cleanResponse);

  if (
    !normalizedResponse ||
    normalizedResponse.split(' ').filter(Boolean).length < 8
  ) {
    const missingOrWeakPoints = [t('evaluatorLogic.emptyWeakPoint')];
    const riskWarnings = [t('evaluatorLogic.emptyRisk')];

    return {
      completionLevel: 'low',
      strengths: [t('evaluatorLogic.emptyStrength')],
      missingOrWeakPoints,
      riskWarnings,
      nextPrompt: buildNextPrompt({
        userText,
        category,
        missingOrWeakPoints,
        riskWarnings,
        missingContextAudit,
        t,
      }),
    };
  }

  const concreteSteps = hasConcreteSteps(normalizedResponse);
  const missingOrWeakPoints = checklistWeakPoints(
    normalizedResponse,
    advice?.checklist || category?.checklist || [],
    t,
  );
  const riskWarnings = [];
  const vague = vagueMatches(normalizedResponse);

  if (!concreteSteps) {
    missingOrWeakPoints.push(t('evaluatorLogic.weakPoints.noConcreteSteps'));
    riskWarnings.push(t('evaluatorLogic.risks.hardToExecute'));
  }

  if (vague.length >= 2) {
    riskWarnings.push(
      t('evaluatorLogic.risks.vagueLanguage', {
        matches: unique(vague).join(', '),
      }),
    );
  }

  if (!responseMentionsObjective(userText, normalizedResponse)) {
    riskWarnings.push(t('evaluatorLogic.risks.offTarget'));
  }

  if (
    missingContextAudit?.missingItems?.length &&
    !includesAny(normalizedResponse, missingContextAudit.missingItems)
  ) {
    missingOrWeakPoints.push(
      t('evaluatorLogic.weakPoints.ignoresMissingContext'),
    );
  }

  const uniqueWeakPoints = unique(missingOrWeakPoints).slice(0, 6);
  const uniqueRisks = unique(riskWarnings).slice(0, 5);
  const strengths = buildStrengths({
    normalizedResponse,
    advice,
    concreteSteps,
    t,
  });
  const completionLevel = inferCompletionLevel({
    normalizedResponse,
    missingOrWeakPoints: uniqueWeakPoints,
    riskWarnings: uniqueRisks,
    concreteSteps,
  });

  return {
    completionLevel,
    strengths,
    missingOrWeakPoints: uniqueWeakPoints.length
      ? uniqueWeakPoints
      : [t('evaluatorLogic.weakPoints.none')],
    riskWarnings: uniqueRisks.length
      ? uniqueRisks
      : [t('evaluatorLogic.risks.none')],
    nextPrompt: buildNextPrompt({
      userText,
      category,
      missingOrWeakPoints: uniqueWeakPoints,
      riskWarnings: uniqueRisks,
      missingContextAudit,
      t,
    }),
  };
}
