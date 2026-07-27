import { describe, expect, it } from 'vitest';
import { extractJSON } from '../src/logic/classifyWithAI';

describe('extractJSON', () => {
  it('parses clean JSON', () => {
    const result = extractJSON('{"id":"n8n_automation","confidence":80}');

    expect(result).toEqual({ id: 'n8n_automation', confidence: 80 });
  });

  it('parses JSON wrapped in a ```json markdown fence', () => {
    const raw = '```json\n{"id":"web_analysis","confidence":75}\n```';
    const result = extractJSON(raw);

    expect(result).toEqual({ id: 'web_analysis', confidence: 75 });
  });

  it('parses JSON wrapped in a plain ``` fence without language', () => {
    const raw = '```\n{"id":"general_context"}\n```';
    const result = extractJSON(raw);

    expect(result).toEqual({ id: 'general_context' });
  });

  it('extracts JSON surrounded by explanatory text', () => {
    const raw =
      'Claro, aca tenes la respuesta: {"id":"long_document"} Espero que ayude.';
    const result = extractJSON(raw);

    expect(result).toEqual({ id: 'long_document' });
  });

  it('parses JSON with leading and trailing whitespace', () => {
    const result = extractJSON('   \n {"id":"visual_ui"} \n  ');

    expect(result).toEqual({ id: 'visual_ui' });
  });

  it('throws when there is no JSON to extract', () => {
    expect(() => extractJSON('no hay ningun objeto aca')).toThrow();
  });
});
