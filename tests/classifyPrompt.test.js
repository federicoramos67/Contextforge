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
});
