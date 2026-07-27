// Núcleo de i18n, sin dependencias de React.
//
// La lógica de negocio (src/logic/*) importa `getTranslator(locale)` y recibe
// una función `t` pura, de modo que sigue siendo testeable sin montar la app.
// La capa de UI usa el contexto de ./LanguageProvider.jsx, que envuelve esto.
import en from './locales/en.js';
import es from './locales/es.js';

const DICTIONARIES = { en, es };

// Español es el idioma base: es el que se usa como respaldo cuando una clave
// falta en otro diccionario, y el default de las funciones de lógica.
export const DEFAULT_LOCALE = 'es';

export const SUPPORTED_LOCALES = Object.keys(DICTIONARIES).sort();

export const LOCALE_STORAGE_KEY = 'contextforge_locale';

export function isSupportedLocale(locale) {
  return Object.hasOwn(DICTIONARIES, locale);
}

export function getLocaleName(locale) {
  return DICTIONARIES[locale]?.meta.localeName ?? locale;
}

// Devuelve el valor en `path` ('a.b.c') o undefined si el camino no existe.
function resolvePath(dictionary, path) {
  return path
    .split('.')
    .reduce((node, key) => (node == null ? undefined : node[key]), dictionary);
}

// Reemplaza los marcadores {param} de una plantilla. Un parámetro ausente deja
// el marcador intacto para que el hueco se note en desarrollo.
function interpolate(template, params) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(params, key) ? String(params[key]) : match,
  );
}

/**
 * Crea la función de traducción de un idioma.
 *
 * `t(path, params)` devuelve strings interpolados; para claves que apuntan a
 * arrays (por ejemplo listas de condiciones) devuelve el array con cada
 * elemento interpolado, lo que evita tener que numerar las claves a mano.
 *
 * Si la clave falta en el idioma pedido cae al diccionario español, y si
 * tampoco está devuelve el propio path, que es visible en pantalla y fácil de
 * rastrear.
 */
export function getTranslator(locale = DEFAULT_LOCALE) {
  const primary = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
  const fallback = DICTIONARIES[DEFAULT_LOCALE];

  return function t(path, params = {}) {
    const value = resolvePath(primary, path) ?? resolvePath(fallback, path);

    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === 'string' ? interpolate(item, params) : item,
      );
    }

    if (typeof value !== 'string') return path;

    return interpolate(value, params);
  };
}

// Normaliza etiquetas BCP 47 ('es-AR', 'en-US') al idioma soportado más cercano.
export function normalizeLocale(value) {
  const base = String(value || '')
    .toLowerCase()
    .split('-')[0];
  return isSupportedLocale(base) ? base : null;
}

/**
 * Resuelve el idioma inicial: elección guardada por el usuario, luego el
 * idioma del navegador y, si nada aplica, el idioma base del proyecto.
 * Recibe `storage` y `navigatorLanguages` para poder testearlo sin DOM.
 */
export function detectLocale({ storage, navigatorLanguages } = {}) {
  const store =
    storage ?? (typeof localStorage === 'undefined' ? null : localStorage);

  try {
    const stored = store?.getItem(LOCALE_STORAGE_KEY);
    if (stored && isSupportedLocale(stored)) return stored;
  } catch {
    // localStorage puede fallar en modo privado o con cookies bloqueadas:
    // seguimos con la detección por navegador.
  }

  const languages =
    navigatorLanguages ??
    (typeof navigator === 'undefined'
      ? []
      : (navigator.languages ?? [navigator.language]));

  for (const language of languages) {
    const normalized = normalizeLocale(language);
    if (normalized) return normalized;
  }

  return DEFAULT_LOCALE;
}
