import { describe, expect, it } from 'vitest';
import { buildMarkdownReport } from '../src/logic/exportMarkdown';

const baseInput = {
  userText: 'Necesito corregir un workflow de n8n.',
  advice: {
    category: 'Automatizacion n8n',
    confidence: 87,
    primaryFormats: ['JSON del workflow'],
    secondaryFormats: ['captura del error'],
    avoid: ['descripciones vagas'],
    checklist: ['Adjuntar el workflow exportado'],
    reason: 'Porque la IA necesita ver el flujo real.',
  },
  scoreData: { score: 80, level: 'Alto', improvements: [] },
  refinedPrompt: 'Prompt refinado de ejemplo.',
};

describe('buildMarkdownReport', () => {
  it('renders the core report with the mandatory sections', () => {
    const report = buildMarkdownReport(baseInput);

    expect(report).toContain('# Diagnostico de contexto - ContextForge');
    expect(report).toContain('Automatizacion n8n');
    expect(report).toContain('Confianza estimada: 87%');
    expect(report).toContain('- JSON del workflow');
    expect(report).toContain('- [ ] Adjuntar el workflow exportado');
    expect(report).toContain('Puntaje: 80/100');
    expect(report).toContain('Nivel: Alto');
    expect(report).toContain('Prompt refinado de ejemplo.');
  });

  it('shows a solid-context note when there are no improvements', () => {
    const report = buildMarkdownReport(baseInput);

    expect(report).toContain('El contexto inicial es solido.');
  });

  it('omits optional sections when their data is absent', () => {
    const report = buildMarkdownReport(baseInput);

    expect(report).not.toContain('Auditoria de contexto faltante');
    expect(report).not.toContain('Contexto rellenado desde material de referencia');
    expect(report).not.toContain('Evaluacion de respuesta de IA');
  });

  it('includes the audit section when a missing-context audit is provided', () => {
    const report = buildMarkdownReport({
      ...baseInput,
      missingContextAudit: {
        missingItems: ['version de n8n'],
        riskWarnings: ['la IA puede inventar nodos'],
        clarificationQuestions: ['que webhook dispara el flujo?'],
      },
    });

    expect(report).toContain('Auditoria de contexto faltante');
    expect(report).toContain('- version de n8n');
    expect(report).toContain('- la IA puede inventar nodos');
    expect(report).toContain('- que webhook dispara el flujo?');
  });

  it('includes the autofill section and renders inferred context', () => {
    const report = buildMarkdownReport({
      ...baseInput,
      referenceText: 'Documentacion pegada.',
      contextAutofill: {
        inferredContext: { objetivo: 'migrar datos', formatos: ['CSV', 'JSON'] },
        filledItems: ['objetivo del workflow'],
        stillMissingItems: ['credenciales'],
        updatedPrompt: 'Prompt actualizado con contexto.',
      },
    });

    expect(report).toContain('Contexto rellenado desde material de referencia');
    expect(report).toContain('- objetivo: migrar datos');
    expect(report).toContain('- formatos: CSV; JSON');
    expect(report).toContain('Prompt actualizado con contexto.');
  });

  it('includes the response-evaluation section when provided', () => {
    const report = buildMarkdownReport({
      ...baseInput,
      aiResponse: 'Respuesta generada por la IA.',
      responseEvaluation: {
        completionLevel: 'Parcial',
        strengths: ['identifico el nodo con error'],
        missingOrWeakPoints: ['no explica el fix'],
        riskWarnings: ['podria romper otro nodo'],
        nextPrompt: 'Pedile el JSON corregido completo.',
      },
    });

    expect(report).toContain('Evaluacion de respuesta de IA');
    expect(report).toContain('Parcial');
    expect(report).toContain('- identifico el nodo con error');
    expect(report).toContain('Pedile el JSON corregido completo.');
  });

  it('falls back to placeholder text for empty lists', () => {
    const report = buildMarkdownReport({
      ...baseInput,
      missingContextAudit: {
        missingItems: [],
        riskWarnings: [],
        clarificationQuestions: [],
      },
      contextAutofill: {
        inferredContext: {},
        filledItems: [],
        stillMissingItems: [],
        updatedPrompt: '',
      },
    });

    expect(report).toContain('- Sin datos.');
    expect(report).toContain('- Sin contexto inferido.');
  });
});
