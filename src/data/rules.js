// Acceso a las reglas de contexto por idioma.
//
// Cada idioma tiene su propio archivo de reglas con los mismos `id`, de modo
// que el idioma solo cambia los textos que se muestran, nunca la taxonomía.
// El clasificador usa `getRuleVariants(id)` para puntuar el prompt contra las
// keywords de todos los idiomas y quedarse con el mejor match, así un prompt
// en español clasifica bien aunque la interfaz esté en inglés, y al revés.
import en from './contextRules.en.json';
import es from './contextRules.es.json';
import { DEFAULT_LOCALE } from '../i18n/index.js';

const RULES_BY_LOCALE = { en, es };

export const GENERAL_CONTEXT_ID = 'general_context';

export function getRules(locale = DEFAULT_LOCALE) {
  return RULES_BY_LOCALE[locale] ?? RULES_BY_LOCALE[DEFAULT_LOCALE];
}

export function getRule(id, locale = DEFAULT_LOCALE) {
  const rules = getRules(locale);
  return (
    rules.find((rule) => rule.id === id) ??
    rules.find((rule) => rule.id === GENERAL_CONTEXT_ID)
  );
}

export function getGeneralContextRule(locale = DEFAULT_LOCALE) {
  return getRule(GENERAL_CONTEXT_ID, locale);
}

// Ids de categoría en orden estable, tomados del idioma base.
export const RULE_IDS = RULES_BY_LOCALE[DEFAULT_LOCALE].map((rule) => rule.id);

/**
 * Devuelve, para un id de categoría, la variante de cada idioma disponible,
 * etiquetada con su `locale`.
 *
 * El clasificador puntúa cada variante por separado en lugar de mezclar las
 * keywords de todos los idiomas en una sola bolsa: si se mezclaran, el máximo
 * teórico de la categoría crecería con cada idioma agregado y la confianza de
 * un prompt en español bajaría solo por existir la traducción al inglés.
 *
 * El `locale` de cada variante permite además desempatar: cuando dos idiomas
 * puntúan igual, gana el del idioma activo, y las señales que se le muestran al
 * usuario quedan en el idioma que está leyendo.
 */
export function getRuleVariants(id) {
  return Object.entries(RULES_BY_LOCALE)
    .map(([locale, rules]) => {
      const rule = rules.find((item) => item.id === id);
      return rule ? { locale, rule } : null;
    })
    .filter(Boolean);
}
