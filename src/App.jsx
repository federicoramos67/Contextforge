import { useState } from 'react';
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
import { getActiveProvider, getStoredKeys, ACTIVE_PROVIDER_KEY } from './config';
import { useAnalysis } from './hooks/useAnalysis';
import { examples } from './constants/examples';
import './style.css';

export default function App() {
  const [copiedMessage, setCopiedMessage] = useState('');
  const [useAI, setUseAI] = useState(false);

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
          <p className="eyebrow">Herramienta de estrategia de contexto para IA</p>
          <h1>ContextForge</h1>
          <p>
            Escribí un prompt en lenguaje natural y recibí una recomendación clara sobre qué archivos,
            formatos y contexto conviene compartir con una IA para obtener mejores respuestas.
          </p>
        </div>
        <div className="hero-badge">
          <span>v0.5.1-alpha</span>

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
          <strong>Modo IA no disponible.</strong> Este resultado se generó con el
          modo reglas local. Motivo: {analysis.category._fallbackReason}
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
            setCopiedMessage('Ejemplo cargado. Presioná "Analizar contexto".');
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
          onCopyUpdatedPrompt={() => copyToClipboard(contextAutofill.updatedPrompt, 'Prompt actualizado copiado.')}
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
        onCopyPrompt={() => copyToClipboard(analysis.refinedPrompt, 'Prompt refinado copiado.')}
        onCopyReport={() => copyToClipboard(markdownReport, 'Diagnóstico completo copiado en Markdown.')}
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
          onCopyNextPrompt={() => copyToClipboard(responseEvaluation.nextPrompt, 'Siguiente prompt copiado.')}
        />
      )}
    </main>
  );
}
