import { describe, expect, it } from 'vitest';
import { generateAdvice } from '../src/logic/generateAdvice';

const baseCategory = {
  label: 'Automatizacion n8n',
  confidence: 82,
  description: 'Flujos de trabajo en n8n.',
  primaryFormats: ['JSON del workflow'],
  secondaryFormats: ['captura'],
  avoid: ['texto vago'],
  checklist: ['Adjuntar workflow'],
  reason: 'La IA necesita ver el flujo.',
};

describe('generateAdvice', () => {
  it('maps the category fields straight into the advice object', () => {
    const advice = generateAdvice({ ...baseCategory, matchedKeywords: ['n8n', 'webhook'] });

    expect(advice.category).toBe('Automatizacion n8n');
    expect(advice.confidence).toBe(82);
    expect(advice.primaryFormats).toEqual(['JSON del workflow']);
    expect(advice.matchedKeywords).toEqual(['n8n', 'webhook']);
  });

  it('builds a keyword-based explanation when there are matched keywords', () => {
    const advice = generateAdvice({ ...baseCategory, matchedKeywords: ['n8n', 'webhook'] });

    expect(advice.diagnosticExplanation).toContain('n8n, webhook');
  });

  it('falls back to a generic explanation when there are no keywords', () => {
    const advice = generateAdvice({ ...baseCategory });

    expect(advice.matchedKeywords).toEqual([]);
    expect(advice.diagnosticExplanation).toContain('sin keywords');
  });
});
