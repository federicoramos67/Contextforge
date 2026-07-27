import { describe, expect, it } from 'vitest';
import en from '../src/i18n/locales/en.js';
import es from '../src/i18n/locales/es.js';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  detectLocale,
  getLocaleName,
  getTranslator,
  isSupportedLocale,
  normalizeLocale,
} from '../src/i18n/index.js';

// Aplana un diccionario a la lista de sus rutas ('a.b.c'), tratando los arrays
// como hojas: lo que debe coincidir entre idiomas es la forma, no la longitud
// de cada lista.
function paths(node, prefix = '') {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) {
    return [prefix];
  }

  return Object.entries(node).flatMap(([key, value]) =>
    paths(value, prefix ? `${prefix}.${key}` : key),
  );
}

function fakeStorage(value) {
  return {
    getItem: () => value,
    setItem: () => {},
  };
}

describe('diccionarios', () => {
  it('expone exactamente los idiomas soportados', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en', 'es']);
    expect(isSupportedLocale(DEFAULT_LOCALE)).toBe(true);
    expect(isSupportedLocale('fr')).toBe(false);
  });

  it('mantiene las mismas claves en español y en inglés', () => {
    const esPaths = paths(es).sort();
    const enPaths = paths(en).sort();

    expect(enPaths.filter((path) => !esPaths.includes(path))).toEqual([]);
    expect(esPaths.filter((path) => !enPaths.includes(path))).toEqual([]);
  });

  it('mantiene el mismo tipo en cada clave de ambos idiomas', () => {
    const typeAt = (dictionary, path) =>
      path.split('.').reduce((node, key) => node[key], dictionary);

    for (const path of paths(es)) {
      expect(Array.isArray(typeAt(en, path))).toBe(
        Array.isArray(typeAt(es, path)),
      );
    }
  });

  it('no deja ningún texto vacío', () => {
    for (const dictionary of [es, en]) {
      for (const path of paths(dictionary)) {
        const value = path
          .split('.')
          .reduce((node, key) => node[key], dictionary);
        const items = Array.isArray(value) ? value : [value];
        for (const item of items) {
          expect(String(item).trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('describe cada idioma con su propio nombre', () => {
    expect(getLocaleName('es')).toBe('Español');
    expect(getLocaleName('en')).toBe('English');
  });
});

describe('getTranslator', () => {
  it('devuelve el texto del idioma pedido', () => {
    expect(getTranslator('es')('input.analyze')).toBe('Analizar contexto');
    expect(getTranslator('en')('input.analyze')).toBe('Analyze context');
  });

  it('interpola parámetros', () => {
    expect(getTranslator('en')('result.confidence', { value: 72 })).toBe(
      '72% confidence',
    );
  });

  it('deja el marcador intacto cuando falta el parámetro', () => {
    expect(getTranslator('en')('result.confidence')).toContain('{value}');
  });

  it('interpola cada elemento cuando la clave apunta a un array', () => {
    const conditions = getTranslator('en')('refinedPrompt.conditions');

    expect(Array.isArray(conditions)).toBe(true);
    expect(conditions.length).toBeGreaterThan(0);
  });

  it('devuelve el path cuando la clave no existe', () => {
    expect(getTranslator('es')('no.existe.esta.clave')).toBe(
      'no.existe.esta.clave',
    );
  });

  it('cae al idioma base ante un idioma desconocido', () => {
    expect(getTranslator('fr')('input.analyze')).toBe(
      getTranslator('es')('input.analyze'),
    );
  });
});

describe('detectLocale', () => {
  it('prioriza la elección guardada por el usuario', () => {
    expect(
      detectLocale({
        storage: fakeStorage('en'),
        navigatorLanguages: ['es-AR'],
      }),
    ).toBe('en');
  });

  it('ignora un idioma guardado que ya no está soportado', () => {
    expect(
      detectLocale({
        storage: fakeStorage('fr'),
        navigatorLanguages: ['en-GB'],
      }),
    ).toBe('en');
  });

  it('usa el idioma del navegador cuando no hay elección guardada', () => {
    expect(
      detectLocale({
        storage: fakeStorage(null),
        navigatorLanguages: ['en-US', 'es'],
      }),
    ).toBe('en');
  });

  it('cae al idioma base cuando el navegador no ofrece ninguno soportado', () => {
    expect(
      detectLocale({
        storage: fakeStorage(null),
        navigatorLanguages: ['fr-FR', 'de'],
      }),
    ).toBe(DEFAULT_LOCALE);
  });

  it('sobrevive a un localStorage que lanza', () => {
    const brokenStorage = {
      getItem: () => {
        throw new Error('acceso denegado');
      },
    };

    expect(
      detectLocale({ storage: brokenStorage, navigatorLanguages: ['en'] }),
    ).toBe('en');
  });

  it('usa una clave de almacenamiento estable', () => {
    expect(LOCALE_STORAGE_KEY).toBe('contextforge_locale');
  });
});

describe('normalizeLocale', () => {
  it('reduce etiquetas regionales al idioma base', () => {
    expect(normalizeLocale('es-AR')).toBe('es');
    expect(normalizeLocale('EN-GB')).toBe('en');
  });

  it('devuelve null para idiomas no soportados', () => {
    expect(normalizeLocale('pt-BR')).toBeNull();
    expect(normalizeLocale('')).toBeNull();
    expect(normalizeLocale(undefined)).toBeNull();
  });
});
