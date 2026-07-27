import { SUPPORTED_LOCALES, getLocaleName } from '../i18n/index.js';
import { useI18n } from '../i18n/useI18n.js';

// Control segmentado de idioma: [ES] [EN]. Se apoya en el mismo lenguaje visual
// que ModeSwitcher para que el header se lea como una sola familia de controles.
export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={t('language.label')}
    >
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`language-btn${code === locale ? ' active' : ''}`}
          onClick={() => setLocale(code)}
          title={t('language.switchTo', { language: getLocaleName(code) })}
          aria-pressed={code === locale}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
