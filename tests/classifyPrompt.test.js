import { describe, expect, it } from 'vitest';
import { classifyPrompt } from '../src/logic/classifyPrompt';

describe('classifyPrompt', () => {
  it('detects n8n automation prompts', () => {
    const result = classifyPrompt(
      'Necesito corregir un workflow de n8n que falla cuando llega un webhook.'
    );

    expect(result.id).toBe('n8n_automation');
  });

  it('detects advanced data analysis prompts', () => {
    const result = classifyPrompt(
      'Necesito analizar un CSV de ventas y crear KPIs para un dashboard.'
    );

    expect(result.id).toBe('advanced_data_analysis');
  });

  it('returns general context for empty prompts', () => {
    const result = classifyPrompt('');

    expect(result.id).toBe('general_context');
  });

  it('prioritizes PDF summaries over web page analysis', () => {
    const result = classifyPrompt('Necesito resumir un PDF de 200 páginas.');

    expect(result.id).toBe('long_document');
    expect(result.id).not.toBe('web_analysis');
  });

  it('detects document PDF summary prompts as long documents', () => {
    const result = classifyPrompt('Resumí este documento PDF.');

    expect(result.id).toBe('long_document');
    expect(result.id).not.toBe('web_analysis');
  });

  it('keeps landing page analysis classified as web analysis', () => {
    const result = classifyPrompt('Analizá esta landing page.');

    expect(result.id).toBe('web_analysis');
    expect(result.id).not.toBe('long_document');
  });
});
