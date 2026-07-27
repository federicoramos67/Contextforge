import { describe, expect, it } from 'vitest';
import en from '../src/data/contextRules.en.json';
import es from '../src/data/contextRules.es.json';
import {
  GENERAL_CONTEXT_ID,
  RULE_IDS,
  getGeneralContextRule,
  getRule,
  getRuleVariants,
  getRules,
} from '../src/data/rules.js';

const REQUIRED_FIELDS = [
  'id',
  'label',
  'description',
  'keywords',
  'primaryFormats',
  'secondaryFormats',
  'avoid',
  'checklist',
  'reason',
  'role',
  'expectedOutput',
];

const LIST_FIELDS = [
  'keywords',
  'primaryFormats',
  'secondaryFormats',
  'avoid',
  'checklist',
];

describe('reglas de contexto', () => {
  it('define las mismas categorías en ambos idiomas y en el mismo orden', () => {
    expect(en.map((rule) => rule.id)).toEqual(es.map((rule) => rule.id));
    expect(RULE_IDS).toEqual(es.map((rule) => rule.id));
  });

  it('incluye general_context como categoría de reserva', () => {
    expect(RULE_IDS).toContain(GENERAL_CONTEXT_ID);
  });

  it('respeta el mismo esquema en cada regla de cada idioma', () => {
    for (const rules of [es, en]) {
      for (const rule of rules) {
        expect(Object.keys(rule).sort()).toEqual([...REQUIRED_FIELDS].sort());

        for (const field of LIST_FIELDS) {
          expect(Array.isArray(rule[field])).toBe(true);
        }

        // general_context es la única sin keywords: se usa como reserva.
        if (rule.id !== GENERAL_CONTEXT_ID) {
          expect(rule.keywords.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('no repite keywords dentro de una misma regla', () => {
    for (const rules of [es, en]) {
      for (const rule of rules) {
        expect(new Set(rule.keywords).size).toBe(rule.keywords.length);
      }
    }
  });

  it('traduce realmente las etiquetas en lugar de copiarlas', () => {
    const translated = es.filter(
      (rule, index) => rule.label !== en[index].label,
    );

    expect(translated.length).toBe(es.length);
  });

  it('getRules devuelve el set del idioma pedido', () => {
    expect(getRules('en')).toBe(en);
    expect(getRules('es')).toBe(es);
  });

  it('getRules cae al idioma base ante un idioma desconocido', () => {
    expect(getRules('fr')).toBe(es);
  });

  it('getRule resuelve por id en el idioma pedido', () => {
    expect(getRule('n8n_automation', 'en').label).toBe('n8n automation');
    expect(getRule('n8n_automation', 'es').label).toBe(
      'Automatización con n8n',
    );
  });

  it('getRule cae a general_context ante un id inexistente', () => {
    expect(getRule('categoria_que_no_existe', 'en').id).toBe(
      GENERAL_CONTEXT_ID,
    );
    expect(getGeneralContextRule('en').id).toBe(GENERAL_CONTEXT_ID);
  });

  it('getRuleVariants devuelve una variante por idioma', () => {
    const variants = getRuleVariants('programming_debug');

    expect(variants).toHaveLength(2);
    expect(
      variants.every((variant) => variant.id === 'programming_debug'),
    ).toBe(true);
  });
});
