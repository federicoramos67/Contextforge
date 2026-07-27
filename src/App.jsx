import { useCallback, useMemo, useState } from 'react';
import PromptInput from './components/PromptInput';
import ResultCard from './components/ResultCard';
import Checklist from './components/Checklist';
import ScorePanel from './components/ScorePanel';
import PromptSuggestion from './components/PromptSuggestion';
import MissingContextAudit from './components/MissingContextAudit';
import AIResponseEvaluator from './components/AIResponseEvaluator';
import ContextAutofill from './components/ContextAutofill';
import ProviderSettings from './components/ProviderSettings';
import ModeSwitcher from './components/ModeSwitcher';
import LanguageSwitcher from './components/LanguageSwitcher';
import {
  getActiveProvider,
  getStoredKeys,
  ACTIVE_PROVIDER_KEY,
} from './config';
import { useAnalysis } from './hooks/useAnalysis';
import { getExamples } from './constants/examples';
import { useI18n } from './i18n/useI18n.js';
import { APP_VERSION } from './constants/version';
import './style.css';

export default function App() {
  const { locale, t } = useI18n();
  const [useAI, setUseAI] = useState(false);

  // El mensaje de estado es un aviso puntual, ya renderizado en el idioma en
  // que se disparó. Se guarda junto a ese idioma y se muestra solo si sigue
  // coincidiendo con el actual, así al cambiar de idioma desaparece en lugar
  // de quedar desfasado. Es estado derivado: no hace falta un efecto.
  const [statusMessage, setStatusMessage] = useState(null);
  const setCopiedMessage = useCallback(
    (text) => setStatusMessage(text ? { text, locale } : null),
    [locale],
  );
  const copiedMessage =
    statusMessage?.locale === locale ? statusMessage.text : '';

  // Estado del panel de configuración (el resto vive dentro de ProviderSettings)
  const [showConfig, setShowConfig] = useState(false);
  // savedKeys se inicializa leyendo localStorage para mostrar indicadores de "Guardada"
  const [savedKeys, setSavedKeys] = useState(() => getStoredKeys());
  // Proveedor seleccionado manualmente; 'auto' = respetar orden de prioridad
  const [selectedProviderId, setSelectedProviderId] = useState(
    () => localStorage.getItem(ACTIVE_PROVIDER_KEY) || 'auto',
  );

  // getActiveProvider() lee localStorage en cada render, por lo que se actualiza
  // automáticamente tras guardar o borrar keys sin necesidad de estado extra
  const activeProvider = getActiveProvider();

  // Los ejemplos precargados se traducen junto con el resto de la interfaz
  const examples = useMemo(() => getExamples(t), [t]);

  // Dominio de análisis: estado del prompt, resultados y acciones sobre ellos
  const {
    userText,
    setUserText,
    analysis,
    aiResponse,
    setAiResponse,
    responseEvaluation,
    setResponseEvaluation,
    referenceText,
    setReferenceText,
    contextAutofill,
    setContextAutofill,
    markdownReport,
    analyze,
    copyToClipboard,
    downloadMarkdown,
    evaluateResponse,
    autofillReferenceContext,
  } = useAnalysis({ useAI, activeProvider, setCopiedMessage });

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">{t('app.eyebrow')}</p>
          <h1>ContextForge</h1>
          <p>{t('app.intro')}</p>
        </div>
        <div className="hero-badge">
          <span>{APP_VERSION}</span>

          <LanguageSwitcher />

          <ModeSwitcher
            useAI={useAI}
            setUseAI={setUseAI}
            activeProvider={activeProvider}
            showConfig={showConfig}
            setShowConfig={setShowConfig}
          />
        </div>
      </header>

      {showConfig && (
        <ProviderSettings
          savedKeys={savedKeys}
          setSavedKeys={setSavedKeys}
          selectedProviderId={selectedProviderId}
          setSelectedProviderId={setSelectedProviderId}
          setUseAI={setUseAI}
          setCopiedMessage={setCopiedMessage}
          onClose={() => setShowConfig(false)}
        />
      )}

      {copiedMessage && <div className="status-message">{copiedMessage}</div>}

      {/* Aviso persistente: el análisis mostrado se generó por fallback a reglas
          porque el Modo IA falló. A diferencia de status-message, no se pisa con
          la siguiente acción, así el usuario se entera del motivo real. */}
      {analysis?.category?._fallback && (
        <div className="fallback-notice" role="status">
          <strong>{t('app.fallbackTitle')}</strong>{' '}
          {t('app.fallbackBody', { reason: analysis.category._fallbackReason })}
        </div>
      )}

      <div className="layout">
        <PromptInput
          value={userText}
          onChange={setUserText}
          onAnalyze={analyze}
          examples={examples}
          onExample={(text) => {
            setUserText(text);
            setCopiedMessage(t('status.exampleLoaded'));
          }}
        />

        <ResultCard advice={analysis?.advice} />
      </div>

      <MissingContextAudit audit={analysis?.missingContextAudit} />

      {analysis && (
        <ContextAutofill
          referenceText={referenceText}
          contextAutofill={contextAutofill}
          onChangeReference={(value) => {
            setReferenceText(value);
            setContextAutofill(null);
          }}
          onAutofill={autofillReferenceContext}
          onCopyUpdatedPrompt={() =>
            copyToClipboard(
              contextAutofill.updatedPrompt,
              t('status.updatedPromptCopied'),
            )
          }
        />
      )}

      {analysis && (
        <div className="layout secondary-layout">
          <ScorePanel scoreData={analysis.scoreData} />
          <Checklist checklist={analysis.advice.checklist} />
        </div>
      )}

      <PromptSuggestion
        prompt={analysis?.refinedPrompt}
        onCopyPrompt={() =>
          copyToClipboard(
            analysis.refinedPrompt,
            t('status.refinedPromptCopied'),
          )
        }
        onCopyReport={() =>
          copyToClipboard(markdownReport, t('status.reportCopied'))
        }
        onDownloadMarkdown={downloadMarkdown}
      />

      {analysis && (
        <AIResponseEvaluator
          aiResponse={aiResponse}
          evaluation={responseEvaluation}
          onChangeResponse={(value) => {
            setAiResponse(value);
            setResponseEvaluation(null);
          }}
          onEvaluate={evaluateResponse}
          onCopyNextPrompt={() =>
            copyToClipboard(
              responseEvaluation.nextPrompt,
              t('status.nextPromptCopied'),
            )
          }
        />
      )}
    </main>
  );
}
