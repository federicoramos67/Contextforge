import { describe, expect, it, test } from 'vitest';
import { auditMissingContext } from '../src/logic/auditMissingContext';
import { autofillContextFromReference } from '../src/logic/autofillContextFromReference';
import { buildMarkdownReport } from '../src/logic/exportMarkdown';
import { classifyPrompt } from '../src/logic/classifyPrompt';
import { evaluateAIResponse } from '../src/logic/evaluateAIResponse';
import { generateAdvice } from '../src/logic/generateAdvice';
import { generateRefinedPrompt } from '../src/logic/generateRefinedPrompt';
import { scoreContext } from '../src/logic/scoreContext';

// Pares equivalentes: el mismo pedido escrito en cada idioma debe caer en la
// misma categoría, sin importar en qué idioma esté la interfaz.
const equivalentPrompts = [
  [
    'n8n_automation',
    'Necesito corregir un workflow de n8n que falla cuando llega un webhook.',
    'I need to fix an n8n workflow that fails when a webhook arrives.',
  ],
  [
    'programming_debug',
    'Tengo un error en una app React con Vite y necesito ver el codigo.',
    'I have an error in a React app built with Vite and need to check the code.',
  ],
  [
    'long_document',
    'Necesito resumir un informe PDF de 200 paginas.',
    'I need to summarize a 200-page PDF report.',
  ],
  [
    'web_analysis',
    'Quiero mejorar la conversion de mi landing page y su SEO.',
    'I want to improve my landing page conversion and its SEO.',
  ],
  [
    'advanced_data_analysis',
    'Necesito analizar un dataset de ventas y crear KPIs para un dashboard.',
    'I need to analyze a sales dataset and build KPIs for a dashboard.',
  ],
];

describe('clasificación entre idiomas', () => {
  test.each(equivalentPrompts)(
    'clasifica como %s tanto el prompt en español como el equivalente en inglés',
    (expectedId, spanishPrompt, englishPrompt) => {
      expect(classifyPrompt(spanishPrompt, 'es').id).toBe(expectedId);
      expect(classifyPrompt(englishPrompt, 'en').id).toBe(expectedId);
    },
  );

  test.each(equivalentPrompts)(
    'clasifica %s igual aunque el idioma de la interfaz no sea el del prompt',
    (expectedId, spanishPrompt, englishPrompt) => {
      // Prompt en español con la interfaz en inglés, y viceversa.
      expect(classifyPrompt(spanishPrompt, 'en').id).toBe(expectedId);
      expect(classifyPrompt(englishPrompt, 'es').id).toBe(expectedId);
    },
  );

  it('devuelve los textos de la categoría en el idioma pedido, no en el del prompt', () => {
    const spanishPrompt =
      'Necesito corregir un workflow de n8n que falla con un webhook.';

    expect(classifyPrompt(spanishPrompt, 'en').label).toBe('n8n automation');
    expect(classifyPrompt(spanishPrompt, 'es').label).toBe(
      'Automatización con n8n',
    );
  });

  it('no diluye la confianza por existir el otro idioma', () => {
    // El máximo teórico se calcula por variante y no sobre la suma de las
    // keywords de todos los idiomas, así que un match fuerte sigue dando una
    // confianza alta en ambos. Las listas de cada idioma no tienen el mismo
    // largo, por eso se comparan contra un piso y no entre sí.
    const spanish = classifyPrompt(equivalentPrompts[0][1], 'es');
    const english = classifyPrompt(equivalentPrompts[0][2], 'en');

    expect(spanish.confidence).toBeGreaterThan(35);
    expect(english.confidence).toBeGreaterThan(35);
    expect(Math.abs(spanish.confidence - english.confidence)).toBeLessThan(10);
  });

  it('muestra las señales detectadas en el idioma que el usuario está leyendo', () => {
    // Las variantes de n8n puntúan igual en los dos idiomas ('workflow n8n' vs
    // 'n8n workflow'), así que el desempate por idioma activo es lo único que
    // evita mostrarle keywords en inglés a quien lee la interfaz en español.
    const spanishPrompt =
      'Quiero corregir un workflow de n8n que falla cuando llega un webhook.';

    const spanish = classifyPrompt(spanishPrompt, 'es');
    const english = classifyPrompt(spanishPrompt, 'en');

    expect(spanish.id).toBe(english.id);
    expect(spanish.matchedKeywords).toContain('workflow n8n');
    expect(english.matchedKeywords).toContain('n8n workflow');
  });

  it('cae a general_context en ambos idiomas cuando no hay señales', () => {
    expect(classifyPrompt('', 'en').id).toBe('general_context');
    expect(classifyPrompt('aaaa bbbb cccc dddd', 'en').id).toBe(
      'general_context',
    );
  });
});

describe('pipeline en inglés', () => {
  // goal (want/need/fix) + contentType (code) + problem (bug) = 65 puntos,
  // suficiente para caer en el nivel medio y probar su etiqueta traducida.
  const prompt = 'I want to fix a bug in my React code.';
  const category = classifyPrompt(prompt, 'en');

  it('genera la explicación diagnóstica en inglés', () => {
    const advice = generateAdvice(category, 'en');

    expect(advice.diagnosticExplanation).toContain(
      'This category was detected',
    );
  });

  it('puntúa el contexto con etiquetas y niveles en inglés', () => {
    const score = scoreContext(prompt, 'en');

    expect(score.score).toBe(65);
    expect(score.levelId).toBe('medium');
    expect(score.level).toBe('Medium');
    expect(score.checks[0].label).toBe('Clear goal');
  });

  it('expone un levelId estable e independiente del idioma', () => {
    // La UI usa levelId para la clase CSS del badge; si dependiera del idioma
    // el color se rompería al traducir.
    expect(scoreContext(prompt, 'en').levelId).toBe(
      scoreContext(prompt, 'es').levelId,
    );
  });

  it('audita el contexto faltante en inglés', () => {
    const audit = auditMissingContext(prompt, category, 'en');

    expect(audit.missingItems.length).toBeGreaterThan(0);
    expect(audit.clarificationQuestions.join(' ')).toMatch(
      /\?$|What|Which|How/,
    );
    expect(audit.riskWarnings.join(' ')).not.toMatch(/[áéíóúñ¿]/);
  });

  it('genera el prompt refinado en inglés', () => {
    const refined = generateRefinedPrompt(prompt, category, 'en');

    expect(refined).toContain("User's original task:");
    expect(refined).toContain('Response conditions:');
    expect(refined).toContain('Do not invent data');
  });

  it('evalúa una respuesta de IA en inglés', () => {
    const evaluation = evaluateAIResponse({
      userText: prompt,
      aiResponse: '',
      category,
      advice: generateAdvice(category, 'en'),
      locale: 'en',
    });

    expect(evaluation.completionLevel).toBe('low');
    expect(evaluation.missingOrWeakPoints[0]).toBe(
      'The response is empty or too short to evaluate.',
    );
    expect(evaluation.nextPrompt).toContain('Act as a specialist in');
  });

  it('detecta señales de material en inglés y las etiqueta en inglés', () => {
    const result = autofillContextFromReference({
      userText: 'I want to write a new campaign.',
      referenceText:
        'Email campaign for small businesses. The goal is to reach leads and get them to book a demo, in a professional tone.',
      category,
      advice: { checklist: ['Audience', 'Tone', 'Output format'] },
      locale: 'en',
    });

    expect(result.inferredContext.audience).toBe('small businesses');
    expect(result.inferredContext.tone).toBe('professional');
    expect(result.inferredContext.callToAction).toBe('book a meeting');
    expect(result.inferredContext.format).toBe('email');
    expect(result.detectedSignals.join(' ')).toContain('Audience:');
  });

  it('traduce las señales aunque el material esté en el otro idioma', () => {
    const spanishMaterial =
      'Campaña de email para clientes de pymes con tono profesional. El objetivo es que agenden una demo.';

    const spanish = autofillContextFromReference({
      userText: 'Quiero una campaña.',
      referenceText: spanishMaterial,
      category,
      advice: { checklist: ['Audiencia'] },
      locale: 'es',
    });
    const english = autofillContextFromReference({
      userText: 'Quiero una campaña.',
      referenceText: spanishMaterial,
      category,
      advice: { checklist: ['Audiencia'] },
      locale: 'en',
    });

    expect(spanish.inferredContext.audience).toBe('clientes');
    expect(english.inferredContext.audience).toBe('customers');
    expect(english.inferredContext.tone).toBe('professional');
  });

  it('exporta el reporte Markdown con los encabezados en inglés', () => {
    const advice = generateAdvice(category, 'en');
    const report = buildMarkdownReport({
      userText: prompt,
      advice,
      scoreData: scoreContext(prompt, 'en'),
      refinedPrompt: generateRefinedPrompt(prompt, category, 'en'),
      missingContextAudit: auditMissingContext(prompt, category, 'en'),
      locale: 'en',
    });

    expect(report).toContain('# Context report — ContextForge');
    expect(report).toContain('## Detected category');
    expect(report).toContain('## Checklist to share with the AI');
    expect(report).toContain('Missing-context audit');
    expect(report).not.toContain('Categoría detectada');
  });

  it('traduce las claves del contexto inferido en el reporte', () => {
    const report = buildMarkdownReport({
      userText: prompt,
      advice: generateAdvice(category, 'en'),
      scoreData: scoreContext(prompt, 'en'),
      refinedPrompt: 'refined',
      contextAutofill: {
        inferredContext: {
          audience: 'customers',
          constraints: ['no discounts'],
        },
        filledItems: [],
        stillMissingItems: [],
        updatedPrompt: 'updated',
      },
      locale: 'en',
    });

    expect(report).toContain('- Audience: customers');
    expect(report).toContain('- Constraints: no discounts');
  });
});

describe('idioma por defecto', () => {
  it('mantiene el español cuando no se pasa idioma', () => {
    const prompt = 'Necesito corregir un bug en React.';

    expect(classifyPrompt(prompt).label).toBe(
      classifyPrompt(prompt, 'es').label,
    );
    expect(scoreContext(prompt).level).toBe(scoreContext(prompt, 'es').level);
  });
});
