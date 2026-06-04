import { describe, expect, it } from 'vitest';
import { auditMissingContext } from '../src/logic/auditMissingContext';
import { classifyPrompt } from '../src/logic/classifyPrompt';
import { normalizeText } from '../src/logic/textUtils';

function normalizedItems(items) {
  return items.map((item) => normalizeText(item));
}

describe('auditMissingContext', () => {
  it('finds missing context in an incomplete programming prompt', () => {
    const text = 'Tengo un bug en una app React y necesito ayuda.';
    const category = classifyPrompt(text);
    const audit = auditMissingContext(text, category);

    expect(category.id).toBe('programming_debug');
    expect(normalizedItems(audit.missingItems)).toContain('mensaje de error completo');
    expect(audit.riskWarnings.length).toBeGreaterThan(0);
    expect(audit.clarificationQuestions.length).toBeGreaterThan(0);
  });

  it('finds missing context in an incomplete n8n prompt', () => {
    const text = 'Mi workflow de n8n falla cuando llega un webhook.';
    const category = classifyPrompt(text);
    const audit = auditMissingContext(text, category);

    expect(category.id).toBe('n8n_automation');
    expect(normalizedItems(audit.missingItems)).toContain('nodo problematico');
    expect(normalizedItems(audit.missingItems)).toContain('output esperado');
  });

  it('returns useful fallback items for empty or general prompts', () => {
    const audit = auditMissingContext('', { id: 'general_context' });

    expect(audit.missingItems.length).toBeGreaterThan(0);
    expect(audit.riskWarnings.length).toBeGreaterThan(0);
    expect(audit.clarificationQuestions.length).toBeGreaterThan(0);
  });

  it('does not report checklist items already present in the prompt', () => {
    const text = 'Tengo un archivo React, el error completo y el comando npm run build.';
    const category = classifyPrompt(text);
    const audit = auditMissingContext(text, category);

    expect(normalizedItems(audit.missingItems)).not.toContain('archivo o bloque de codigo completo');
    expect(normalizedItems(audit.missingItems)).not.toContain('mensaje de error completo');
    expect(normalizedItems(audit.missingItems)).not.toContain('comando usado para ejecutar');
  });
});
