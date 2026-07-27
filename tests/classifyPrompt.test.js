import { describe, expect, it } from 'vitest';
import { classifyPrompt } from '../src/logic/classifyPrompt';

describe('classifyPrompt', () => {
  it('detects n8n automation prompts', () => {
    const result = classifyPrompt(
      'Necesito corregir un workflow de n8n que falla cuando llega un webhook.',
    );

    expect(result.id).toBe('n8n_automation');
  });

  it('detects advanced data analysis prompts', () => {
    const result = classifyPrompt(
      'Necesito analizar un CSV de ventas y crear KPIs para un dashboard.',
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

  it('detects email subscription renewal campaigns as marketing campaigns', () => {
    const result = classifyPrompt(
      'Quiero crear una campaña de email para renovar suscripciones vencidas.',
    );

    expect(result.id).toBe('marketing_campaign');
    expect(result.id).not.toBe('visual_ui');
  });

  it('detects previous campaign material with CTA as marketing campaign', () => {
    const result = classifyPrompt(
      'Campaña anterior para clientes existentes con CTA renovar ahora.',
    );

    expect(result.id).toBe('marketing_campaign');
  });

  it('keeps landing page improvement classified as web analysis', () => {
    const result = classifyPrompt('Necesito mejorar una landing page.');

    expect(result.id).toBe('web_analysis');
  });

  it('still detects explicit UI redesign prompts as visual UI', () => {
    const result = classifyPrompt('Necesito rediseñar una UI de una app.');

    expect(result.id).toBe('visual_ui');
  });
});
