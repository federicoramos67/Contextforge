import { useI18n } from '../i18n/useI18n.js';

// Control segmentado del header: [Modo reglas] [● Modo IA · X] [⚙].
// Sin estado propio: recibe el modo y el proveedor activo por props.
export default function ModeSwitcher({
  useAI,
  setUseAI,
  activeProvider,
  showConfig,
  setShowConfig,
}) {
  const { t } = useI18n();

  const shortName = activeProvider
    ? activeProvider.name.length > 7
      ? activeProvider.name.slice(0, 6) + '…'
      : activeProvider.name
    : '';

  return (
    <div className="mode-switcher">
      {/* Segmento izquierdo: siempre visible */}
      <button
        className={`mode-btn${!useAI ? ' active' : ''}`}
        onClick={() => setUseAI(false)}
        title={t('modes.rulesTitle')}
      >
        {t('modes.rules')}
      </button>

      {/* Segmento derecho: botón IA + sufijo gear formando una sola unidad pill */}
      <div className="mode-ai-group">
        {/*
          Estado 1 — sin proveedor: "Modo IA ⚙", click abre config
          Estado 2 — proveedor listo, modo reglas: "● Modo IA · X", click activa IA
          Estado 3 — modo IA activo: "● X" con punto pulsante
        */}
        <button
          className={`mode-btn mode-btn-ai${useAI && activeProvider ? ' active' : ''}${activeProvider ? ' with-gear' : ''}`}
          onClick={() => {
            if (!activeProvider) {
              setShowConfig((s) => !s);
            } else {
              setUseAI(true);
            }
          }}
          title={
            !activeProvider
              ? t('modes.aiNeedsKeyTitle')
              : t('modes.aiActivateTitle', { name: activeProvider.name })
          }
        >
          {!activeProvider ? (
            // Estado 1: sin proveedor
            <>
              {t('modes.ai')} <span className="mode-gear-inline">⚙</span>
            </>
          ) : useAI ? (
            // Estado 3: IA activa, dot pulsante + nombre abreviado
            <>
              <span className="mode-dot mode-dot--pulse" />
              {shortName}
            </>
          ) : (
            // Estado 2: proveedor listo, modo reglas activo
            <>
              <span className="mode-dot" />
              {t('modes.ai')} · {shortName}
            </>
          )}
        </button>

        {/* Sufijo ⚙: tercer segmento del pill, abre config sin cambiar modo */}
        {activeProvider && (
          <button
            className={`mode-gear-btn${showConfig ? ' open' : ''}`}
            onClick={() => setShowConfig((s) => !s)}
            title={t('modes.settingsTitle')}
            aria-label={t('modes.settingsAriaLabel')}
          >
            ⚙
          </button>
        )}
      </div>
    </div>
  );
}
