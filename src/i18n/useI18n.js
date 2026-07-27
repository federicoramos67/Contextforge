import { useContext } from 'react';
import { LanguageContext } from './LanguageContext.js';

/**
 * Acceso al idioma activo desde cualquier componente.
 *
 * Devuelve `{ locale, setLocale, t }`, donde `t` es el traductor del idioma
 * actual. Lanza si se usa fuera de <LanguageProvider>, para que un olvido se
 * vea en desarrollo en lugar de degradar a textos sin traducir.
 */
export function useI18n() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useI18n debe usarse dentro de <LanguageProvider>.');
  }

  return context;
}
