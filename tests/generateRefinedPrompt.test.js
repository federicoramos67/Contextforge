import { describe, expect, it } from 'vitest';
import { generateRefinedPrompt } from '../src/logic/generateRefinedPrompt';

const category = {
  role: 'Sos un experto en automatizacion.',
  primaryFormats: ['JSON del workflow', 'captura del error'],
  secondaryFormats: ['URL del webhook'],
  expectedOutput: 'un diagnostico paso a paso',
};

describe('generateRefinedPrompt', () => {
  it('starts with the category role', () => {
    const prompt = generateRefinedPrompt('Necesito ayuda', category);

    expect(prompt.startsWith('Sos un experto en automatizacion.')).toBe(true);
  });

  it('embeds the trimmed user text', () => {
    const prompt = generateRefinedPrompt('   Mi workflow falla   ', category);

    expect(prompt).toContain('"Mi workflow falla"');
  });

  it('lists primary and secondary formats as bullet points', () => {
    const prompt = generateRefinedPrompt('texto', category);

    expect(prompt).toContain('- JSON del workflow');
    expect(prompt).toContain('- captura del error');
    expect(prompt).toContain('- URL del webhook');
  });

  it('includes the expected output', () => {
    const prompt = generateRefinedPrompt('texto', category);

    expect(prompt).toContain('Necesito que me ayudes con: un diagnostico paso a paso.');
  });
});
