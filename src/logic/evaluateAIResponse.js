import { normalizeText, unique } from './textUtils';

const vaguePatterns = [
  'depende',
  'podria',
  'podría',
  'en general',
  'tal vez',
  'quizas',
  'quizás',
  'probablemente',
  'puede ser',
  'seria recomendable',
  'sería recomendable',
];

const concreteStepPatterns = [
  /\b1[.)]/,
  /\b2[.)]/,
  /paso\s+\d/,
  /primero/,
  /segundo/,
  /luego/,
  /despues/,
  /después/,
  /hacer|hac[eé]|revis[aá]|cambi[aá]|agreg[aá]|ejecut[aá]|verific[aá]|prob[aá]|copi[aá]|peg[aá]/,
];

const genericFallbackPrompt = `Necesito que mejores tu respuesta anterior con acciones concretas.

Inclui:
- pasos verificables;
- supuestos explicitos;
- puntos que todavia faltan;
- riesgos o limites;
- una recomendacion final priorizada.`;

function includesAny(normalizedText, values = []) {
  return values.some((value) => {
    const normalizedValue = normalizeText(value);
    return normalizedValue && normalizedText.includes(normalizedValue);
  });
}

function checklistWeakPoints(normalizedResponse, checklist = []) {
  return checklist
    .filter(Boolean)
    .filter((item) => !includesAny(normalizedResponse, normalizeText(item).split(' ').filter((word) => word.length > 4)))
    .slice(0, 5)
    .map((item) => `No aborda con claridad: ${item}.`);
}

function hasConcreteSteps(normalizedResponse) {
  return concreteStepPatterns.some((pattern) => pattern.test(normalizedResponse));
}

function vagueMatches(normalizedResponse) {
  return vaguePatterns.filter((pattern) => normalizedResponse.includes(normalizeText(pattern)));
}

function objectiveWords(userText) {
  return normalizeText(userText)
    .split(' ')
    .filter((word) => word.length > 4)
    .filter((word) => !['necesito', 'quiero', 'ayuda', 'sobre', 'para', 'este', 'esta'].includes(word));
}

function responseMentionsObjective(userText, normalizedResponse) {
  const words = objectiveWords(userText);
  if (!words.length) return true;

  const matches = words.filter((word) => normalizedResponse.includes(word));
  return matches.length >= Math.min(2, words.length);
}

function inferCompletionLevel({ normalizedResponse, missingOrWeakPoints, riskWarnings, concreteSteps }) {
  const wordCount = normalizedResponse.split(' ').filter(Boolean).length;

  if (wordCount < 20) return 'low';
  if (!concreteSteps && riskWarnings.length >= 2) return 'low';
  if (missingOrWeakPoints.length <= 1 && riskWarnings.length <= 1 && concreteSteps && wordCount >= 60) return 'high';
  return 'medium';
}

function buildStrengths({ normalizedResponse, advice, concreteSteps }) {
  const strengths = [];

  if (concreteSteps) {
    strengths.push('Incluye pasos o acciones concretas.');
  }

  if (includesAny(normalizedResponse, advice?.primaryFormats || [])) {
    strengths.push('Menciona parte del formato o material recomendado.');
  }

  if (includesAny(normalizedResponse, advice?.secondaryFormats || [])) {
    strengths.push('Considera contexto complementario util.');
  }

  if (normalizedResponse.split(' ').filter(Boolean).length >= 80) {
    strengths.push('La respuesta tiene desarrollo suficiente para revisar detalles.');
  }

  return strengths.length ? strengths : ['La respuesta ofrece una base inicial para continuar.'];
}

function buildNextPrompt({ userText, category, missingOrWeakPoints, riskWarnings, missingContextAudit }) {
  const categoryLabel = category?.label || 'la tarea original';
  const missingContext = missingContextAudit?.missingItems?.length
    ? missingContextAudit.missingItems.map((item) => `- ${item}`).join('\n')
    : '- Supuestos que usaste\n- Datos que faltan\n- Acciones concretas para avanzar';

  const weakPoints = missingOrWeakPoints.length
    ? missingOrWeakPoints.map((item) => `- ${item}`).join('\n')
    : '- Revisa si falta algun paso concreto, ejemplo o criterio de verificacion.';

  const risks = riskWarnings.length
    ? riskWarnings.map((item) => `- ${item}`).join('\n')
    : '- Evita respuestas genericas y aclara supuestos.';

  const prompt = `Actua como especialista en ${categoryLabel}.

Mi objetivo original era:
"${userText || 'Necesito una respuesta mas completa y accionable.'}"

Mejorá tu respuesta anterior corrigiendo estos puntos debiles:
${weakPoints}

Tambien necesito que consideres este contexto faltante:
${missingContext}

Riesgos a evitar:
${risks}

Devolveme una version mejorada con:
- pasos concretos y verificables;
- supuestos explicitos;
- prioridades;
- cualquier dato que necesites que te confirme antes de ejecutar cambios.`;

  return prompt.trim() || genericFallbackPrompt;
}

export function evaluateAIResponse({ userText = '', aiResponse = '', category = {}, advice = {}, missingContextAudit = null }) {
  const cleanResponse = String(aiResponse || '').trim();
  const normalizedResponse = normalizeText(cleanResponse);

  if (!normalizedResponse || normalizedResponse.split(' ').filter(Boolean).length < 8) {
    const missingOrWeakPoints = ['La respuesta esta vacia o es demasiado corta para evaluarla.'];
    const riskWarnings = ['No hay suficiente contenido para saber si responde al objetivo original.'];

    return {
      completionLevel: 'low',
      strengths: ['Todavia no hay una respuesta sustantiva para rescatar.'],
      missingOrWeakPoints,
      riskWarnings,
      nextPrompt: buildNextPrompt({ userText, category, missingOrWeakPoints, riskWarnings, missingContextAudit }),
    };
  }

  const concreteSteps = hasConcreteSteps(normalizedResponse);
  const missingOrWeakPoints = checklistWeakPoints(normalizedResponse, advice?.checklist || category?.checklist || []);
  const riskWarnings = [];
  const vague = vagueMatches(normalizedResponse);

  if (!concreteSteps) {
    missingOrWeakPoints.push('No ofrece pasos concretos o verificables.');
    riskWarnings.push('La respuesta puede ser dificil de ejecutar porque no baja a acciones.');
  }

  if (vague.length >= 2) {
    riskWarnings.push(`Usa lenguaje vago sin suficiente accion: ${unique(vague).join(', ')}.`);
  }

  if (!responseMentionsObjective(userText, normalizedResponse)) {
    riskWarnings.push('No parece responder de forma directa al objetivo original.');
  }

  if (missingContextAudit?.missingItems?.length && !includesAny(normalizedResponse, missingContextAudit.missingItems)) {
    missingOrWeakPoints.push('No recupera el contexto faltante detectado antes de consultar a la IA.');
  }

  const uniqueWeakPoints = unique(missingOrWeakPoints).slice(0, 6);
  const uniqueRisks = unique(riskWarnings).slice(0, 5);
  const strengths = buildStrengths({ normalizedResponse, advice, concreteSteps });
  const completionLevel = inferCompletionLevel({
    normalizedResponse,
    missingOrWeakPoints: uniqueWeakPoints,
    riskWarnings: uniqueRisks,
    concreteSteps,
  });

  return {
    completionLevel,
    strengths,
    missingOrWeakPoints: uniqueWeakPoints.length ? uniqueWeakPoints : ['No se detectan debilidades criticas con las reglas actuales.'],
    riskWarnings: uniqueRisks.length ? uniqueRisks : ['No se detectan riesgos fuertes con las reglas actuales.'],
    nextPrompt: buildNextPrompt({
      userText,
      category,
      missingOrWeakPoints: uniqueWeakPoints,
      riskWarnings: uniqueRisks,
      missingContextAudit,
    }),
  };
}
