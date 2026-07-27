import { useCallback, useEffect, useMemo, useState } from 'react';
import { LanguageContext } from './LanguageContext.js';
import {
  LOCALE_STORAGE_KEY,
  detectLocale,
  getTranslator,
  isSupportedLocale,
} from './index.js';

/**
 * Provee el idioma activo a toda la app.
 *
 * El idioma inicial se detecta una sola vez (elección guardada → navegador →
 * español). Cada cambio se persiste en localStorage y se refleja en el
 * atributo `lang` del documento, que es lo que usan lectores de pantalla y
 * traductores automáticos del navegador.
 */
export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => detectLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next) => {
    if (!isSupportedLocale(next)) return;

    setLocaleState(next);

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Sin localStorage el idioma simplemente no persiste entre sesiones;
      // la app sigue funcionando con el idioma elegido en memoria.
    }
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t: getTranslator(locale) }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
