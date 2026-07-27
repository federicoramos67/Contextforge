import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// Mockeamos el resolvedor de proveedor para no depender de localStorage/env
// y poder controlar si hay proveedor activo en cada caso.
vi.mock('../src/config', () => ({
  getActiveProvider: vi.fn(),
}));

import { classifyWithAI } from '../src/logic/classifyWithAI';
import { getActiveProvider } from '../src/config';

// Respuesta valida que devolveria un proveedor OpenAI-compat (Groq).
function mockAIResponse(content) {
  return {
    ok: true,
    json: async () => ({ choices: [{ message: { content } }] }),
  };
}

describe('classifyWithAI', () => {
  beforeEach(() => {
    getActiveProvider.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back to local rules when there is no provider configured', async () => {
    getActiveProvider.mockReturnValue(null);

    const result = await classifyWithAI(
      'Necesito corregir un workflow de n8n.',
    );

    expect(result._fallback).toBe(true);
    expect(result._fallbackReason).toBe('Sin proveedor configurado');
    expect(result.id).toBeDefined();
  });

  it('maps a successful AI response and normalizes 0-1 confidence to 0-100', async () => {
    getActiveProvider.mockReturnValue({
      id: 'groq',
      key: 'test-key',
      model: 'test-model',
    });

    const aiContent = JSON.stringify({
      id: 'general_context',
      label: 'Contexto general',
      confidence: 0.9,
      matchedKeywords: ['algo'],
      description: 'Una descripcion',
      primaryFormats: ['formato principal'],
      secondaryFormats: ['formato secundario'],
      avoid: ['evitar esto'],
      checklist: ['item de checklist'],
      reason: 'una razon',
      diagnosticExplanation: 'explicacion',
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockAIResponse(aiContent)),
    );

    const result = await classifyWithAI('texto del usuario');

    expect(result._fallback).toBeUndefined();
    expect(result.confidence).toBe(90);
    expect(result.label).toBe('Contexto general');
    expect(result.primaryFormats).toEqual(['formato principal']);
  });

  it('falls back to local rules when the provider call throws', async () => {
    getActiveProvider.mockReturnValue({
      id: 'groq',
      key: 'test-key',
      model: 'test-model',
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down')),
    );

    const result = await classifyWithAI('texto del usuario');

    expect(result._fallback).toBe(true);
    expect(result._fallbackReason).toBe('network down');
  });

  it('falls back when the provider returns non-JSON garbage', async () => {
    getActiveProvider.mockReturnValue({
      id: 'groq',
      key: 'test-key',
      model: 'test-model',
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockAIResponse('no hay json aca')),
    );

    const result = await classifyWithAI('texto del usuario');

    expect(result._fallback).toBe(true);
  });
});
