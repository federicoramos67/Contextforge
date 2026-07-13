import { useMemo, useState } from 'react';
import PromptInput from './components/PromptInput';
import ResultCard from './components/ResultCard';
import Checklist from './components/Checklist';
import ScorePanel from './components/ScorePanel';
import PromptSuggestion from './components/PromptSuggestion';
import MissingContextAudit from './components/MissingContextAudit';
import AIResponseEvaluator from './components/AIResponseEvaluator';
import ContextAutofill from './components/ContextAutofill';
import ProviderSettings from './components/ProviderSettings';
import { classifyPrompt } from './logic/classifyPrompt';
import { classifyWithAI } from './logic/classifyWithAI';
import { getActiveProvider, getStoredKeys, ACTIVE_PROVIDER_KEY } from './config';
import { scoreContext } from './logic/scoreContext';
import { generateAdvice } from './logic/generateAdvice';
import { generateRefinedPrompt } from './logic/generateRefinedPrompt';
import { auditMissingContext } from './logic/auditMissingContext';
import { evaluateAIResponse } from './logic/evaluateAIResponse';
import { autofillContextFromReference } from './logic/autofillContextFromReference';
import { buildMarkdownReport } from './logic/exportMarkdown';
import { examples } from './constants/examples';
import './style.css';

export default function App() {
  const [userText, setUserText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [responseEvaluation, setResponseEvaluation] = useState(null);
  const [referenceText, setReferenceText] = useState('');
  const [contextAutofill, setContextAutofill] = useState(null);

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

  const markdownReport = useMemo(() => {
    if (!analysis) return '';
    return buildMarkdownReport({
      userText,
      advice: analysis.advice,
      scoreData: analysis.scoreData,
      refinedPrompt: analysis.refinedPrompt,
      missingContextAudit: analysis.missingContextAudit,
      referenceText,
      contextAutofill,
      aiResponse,
      responseEvaluation,
    });
  }, [analysis, aiResponse, contextAutofill, referenceText, responseEvaluation, userText]);

  async function analyze() {
    const cleanText = userText.trim();

    if (!cleanText) {
      setAnalysis(null);
      setCopiedMessage('Primero escribí una necesidad o prompt.');
      return;
    }

    let category;

    if (useAI && activeProvider) {
      setCopiedMessage(`Analizando con ${activeProvider.name}...`);
      category = await classifyWithAI(cleanText);
      if (category._fallback) {
        setCopiedMessage(`Modo IA no disponible (${category._fallbackReason}). Se usó el modo reglas local.`);
      }
    } else {
      category = classifyPrompt(cleanText);
    }

    const advice = generateAdvice(category);
    const scoreData = scoreContext(cleanText);
    const refinedPrompt = generateRefinedPrompt(cleanText, category);
    const missingContextAudit = auditMissingContext(cleanText, category);

    setResponseEvaluation(null);
    setContextAutofill(null);
    setAnalysis({ category, advice, scoreData, refinedPrompt, missingContextAudit });

    if (!category._fallback) {
      setCopiedMessage('Análisis generado.');
    }
  }

  async function copyToClipboard(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(successMessage);
    } catch {
      setCopiedMessage('No pude copiar automáticamente. Seleccioná el texto y copialo manualmente.');
    }
  }

  function downloadMarkdown() {
    if (!markdownReport) return;

    const blob = new Blob([markdownReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contextforge-diagnostico.md';
    link.click();
    URL.revokeObjectURL(url);
    setCopiedMessage('Markdown descargado.');
  }

  function evaluateResponse() {
    if (!analysis) return;

    const evaluation = evaluateAIResponse({
      userText,
      aiResponse,
      category: analysis.category,
      advice: analysis.advice,
      missingContextAudit: analysis.missingContextAudit,
    });

    setResponseEvaluation(evaluation);
    setCopiedMessage('Respuesta evaluada.');
  }

  function autofillReferenceContext() {
    if (!analysis) return;

    const result = autofillContextFromReference({
      userText,
      referenceText,
      category: analysis.category,
      advice: analysis.advice,
      missingContextAudit: analysis.missingContextAudit,
    });

    setContextAutofill(result);
    setCopiedMessage('Contexto rellenado desde material de referencia.');
  }

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
          <span>v0.5.0-alpha</span>

          {/* Segmented control: [Modo reglas] [● Modo IA · Mistral][⚙] */}
          <div className="mode-switcher">
            {/* Segmento izquierdo: siempre visible */}
            <button
              className={`mode-btn${!useAI ? ' active' : ''}`}
              onClick={() => setUseAI(false)}
              title="Usar clasificación local por reglas"
            >
              Modo reglas
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
                    ? 'Configurá una API key para activar el Modo IA'
                    : `Activar Modo IA — ${activeProvider.name}`
                }
              >
                {!activeProvider ? (
                  // Estado 1: sin proveedor
                  <>Modo IA <span className="mode-gear-inline">⚙</span></>
                ) : useAI ? (
                  // Estado 3: IA activa, dot pulsante + nombre abreviado
                  <><span className="mode-dot mode-dot--pulse" />{activeProvider.name.length > 7 ? activeProvider.name.slice(0, 6) + '…' : activeProvider.name}</>
                ) : (
                  // Estado 2: proveedor listo, modo reglas activo
                  <><span className="mode-dot" />Modo IA · {activeProvider.name.length > 7 ? activeProvider.name.slice(0, 6) + '…' : activeProvider.name}</>
                )}
              </button>

              {/* Sufijo ⚙: tercer segmento del pill, abre config sin cambiar modo */}
              {activeProvider && (
                <button
                  className={`mode-gear-btn${showConfig ? ' open' : ''}`}
                  onClick={() => setShowConfig((s) => !s)}
                  title="Configurar proveedores de IA"
                  aria-label="Configurar API"
                >
                  ⚙
                </button>
              )}
            </div>
          </div>
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
