import { describe, expect, it } from 'vitest';
import { scoreContext } from '../src/logic/scoreContext';

describe('scoreContext', () => {
  it('gives a perfect score when the text hits every check', () => {
    const result = scoreContext(
      'Quiero resolver un problema: tengo un PDF y necesito un resultado en tabla, sin usar internet.'
    );

    expect(result.score).toBe(100);
    expect(result.level).toBe('Alto');
    expect(result.improvements).toHaveLength(0);
    expect(result.checks.every((c) => c.passed)).toBe(true);
  });

  it('scores an empty prompt at zero with all improvements suggested', () => {
    const result = scoreContext('');

    expect(result.score).toBe(0);
    expect(result.level).toBe('Bajo');
    expect(result.improvements).toHaveLength(5);
    expect(result.checks.every((c) => !c.passed)).toBe(true);
  });

  it('classifies a mid-range score as Medio', () => {
    // goal (quiero) + contentType (pdf) + problem (falla) = 65 puntos
    const result = scoreContext('Quiero un PDF que falla.');

    expect(result.score).toBe(65);
    expect(result.level).toBe('Medio');
  });

  it('exposes each check without its internal test function', () => {
    const result = scoreContext('texto cualquiera');

    for (const check of result.checks) {
      expect(check).toHaveProperty('id');
      expect(check).toHaveProperty('label');
      expect(check).toHaveProperty('points');
      expect(check).toHaveProperty('passed');
      expect(check).not.toHaveProperty('test');
    }
  });
});
