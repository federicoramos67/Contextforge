import { describe, expect, it } from 'vitest';
import { autofillContextFromReference } from '../src/logic/autofillContextFromReference';

const category = {
  id: 'writing_editing',
  label: 'Redaccion / correccion / estilo',
  checklist: [
    'Objetivo',
    'Tono',
    'Destinatario',
    'Formato de salida',
    'Limites o condiciones',
  ],
};

const advice = {
  checklist: category.checklist,
};

const missingContextAudit = {
  missingItems: [
    'Objetivo',
    'Tono',
    'Destinatario',
    'Formato de salida',
    'Limites o condiciones',
  ],
  riskWarnings: [],
  clarificationQuestions: [],
};

describe('autofillContextFromReference', () => {
  it('keeps missing items when reference text is empty', () => {
    const result = autofillContextFromReference({
      userText: 'Necesito mejorar un email.',
      referenceText: '',
      category,
      advice,
      missingContextAudit,
    });

    expect(result.filledItems).toEqual([]);
    expect(result.stillMissingItems).toEqual(missingContextAudit.missingItems);
  });

  it('detects audience, call to action and format from an email campaign', () => {
    const result = autofillContextFromReference({
      userText: 'Quiero crear una nueva campaña.',
      referenceText:
        'Email de campaña para clientes de pymes. El objetivo es contactar leads y pedirles agendar una demo.',
      category,
      advice,
      missingContextAudit,
    });

    expect(result.inferredContext.audience).toBe('clientes');
    expect(result.inferredContext.callToAction).toBe('agendar');
    expect(result.inferredContext.format).toBe('email');
    expect(result.detectedSignals.length).toBeGreaterThan(0);
  });

  it('detects professional or formal tone', () => {
    const result = autofillContextFromReference({
      userText: 'Necesito redactar una propuesta.',
      referenceText:
        'La propuesta debe mantener un tono profesional y formal para empresas.',
      category,
      advice,
      missingContextAudit,
    });

    expect(['profesional', 'formal']).toContain(result.inferredContext.tone);
  });

  it('always generates a non-empty updated prompt', () => {
    const result = autofillContextFromReference({
      userText: 'Necesito una versión mejorada del prompt.',
      referenceText: '',
      category,
      advice,
      missingContextAudit,
    });

    expect(result.updatedPrompt.trim().length).toBeGreaterThan(0);
  });

  it('extracts only the content from a labeled restriction line', () => {
    const result = autofillContextFromReference({
      userText: 'Quiero crear una campaña de email.',
      referenceText: `Campaña anterior para clientes existentes.
Restricción: no usar descuentos mayores al 15%.
Formato: email comercial breve.`,
      category,
      advice,
      missingContextAudit,
    });

    expect(result.inferredContext.constraints).toContain(
      'no usar descuentos mayores al 15%.',
    );
  });
});
