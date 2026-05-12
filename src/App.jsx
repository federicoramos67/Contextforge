import { useMemo, useState } from 'react';
import PromptInput from './components/PromptInput';
import ResultCard from './components/ResultCard';
import Checklist from './components/Checklist';
import ScorePanel from './components/ScorePanel';
import PromptSuggestion from './components/PromptSuggestion';
import { classifyPrompt } from './logic/classifyPrompt';
import { classifyWithAI } from './logic/classifyWithAI';
import { getActiveProvider, getStoredKeys, STORAGE_KEY } from './config';
import { scoreContext } from './logic/scoreContext';
import { generateAdvice } from './logic/generateAdvice';
import { generateRefinedPrompt } from './logic/generateRefinedPrompt';
import { buildMarkdownReport } from './logic/exportMarkdown';
import './style.css';

const examples = [
  {
    label: 'Landing page',
    text: 'Quiero que una IA revise mi landing page y me diga por qué no convierte. Necesito recomendaciones priorizadas para mejorar el hero y el CTA.',
  },
  {
    label: 'Error de código',
    text: 'Tengo un error en una app React con Vite. Quiero que una IA me ayude a corregir el bug y me explique qué archivo tocar.',
  },
  {
    label: 'Documento PDF',
    text: 'Necesito que una IA resuma un informe PDF largo y me saque las ideas principales en formato académico.',
  },
  {
    label: 'Automatización',
    text: 'Quiero automatizar un flujo en n8n para tomar datos de un formulario y generar una respuesta automática.',
  },
];

// Definición de campos del panel de configuración
const CONFIG_PROVIDERS = [
  { id: 'mistral',   label: 'Mistral',          type: 'password', placeholder: 'VITE_MISTRAL_KEY' },
  { id: 'groq',      label: 'Groq',             type: 'password', placeholder: 'VITE_GROQ_KEY' },
  { id: 'gemini',    label: 'Google Gemini',    type: 'password', placeholder: 'VITE_GEMINI_KEY' },
  { id: 'anthropic', label: 'Anthropic',        type: 'password', placeholder: 'VITE_ANTHROPIC_KEY' },
  { id: 'openai',    label: 'OpenAI',           type: 'password', placeholder: 'VITE_OPENAI_KEY' },
  { id: 'ollama',    label: 'Ollama (URL local)',type: 'text',     placeholder: 'http://localhost:11434' },
];

const EMPTY_FORM = { mistral: '', groq: '', gemini: '', anthropic: '', openai: '', ollama: '' };

// Enmascara una key mostrando solo los últimos 4 caracteres
function maskKey(value) {
  if (!value || value.length <= 4) return value;
  return '••••••••' + value.slice(-4);
}

// Para Ollama muestra la URL completa (no es sensible); para el resto aplica máscara
function maskValue(id, value) {
  return id === 'ollama' ? value : maskKey(value);
}

export default function App() {
  const [userText, setUserText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState('');
  const [useAI, setUseAI] = useState(false);

  // Estado del panel de configuración
  const [showConfig, setShowConfig] = useState(false);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  // savedKeys se inicializa leyendo localStorage para mostrar indicadores de "Guardada"
  const [savedKeys, setSavedKeys] = useState(() => getStoredKeys());

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
    });
  }, [analysis, userText]);

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
        setCopiedMessage('No se pudo conectar con la IA. Usando modo reglas.');
      }
    } else {
      category = classifyPrompt(cleanText);
    }

    const advice = generateAdvice(category);
    const scoreData = scoreContext(cleanText);
    const refinedPrompt = generateRefinedPrompt(cleanText, category);

    setAnalysis({ category, advice, scoreData, refinedPrompt });

    if (!category._fallback) {
      setCopiedMessage('Análisis generado.');
    }
  }

  // Guarda las keys ingresadas en localStorage.
  // Los campos vacíos conservan el valor previo (no borran la key existente).
  function saveConfig() {
    const toSave = { ...savedKeys };

    for (const { id } of CONFIG_PROVIDERS) {
      if (formValues[id].trim()) {
        toSave[id] = formValues[id].trim();
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setSavedKeys(toSave);
    setFormValues(EMPTY_FORM);
    setShowConfig(false);

    // getActiveProvider() ya lee el localStorage actualizado en el próximo render
    const active = getActiveProvider();
    setCopiedMessage(
      active
        ? `Proveedor activo: ${active.name}`
        : 'Sin proveedor activo — usando modo heurístico',
    );
  }

  // Elimina todas las keys guardadas en localStorage
  function clearConfig() {
    localStorage.removeItem(STORAGE_KEY);
    setSavedKeys({});
    setFormValues(EMPTY_FORM);

    const active = getActiveProvider();
    setCopiedMessage(
      active
        ? `Keys de UI borradas. Proveedor activo por .env: ${active.name}`
        : 'Keys borradas — sin proveedor activo. Usando modo heurístico.',
    );
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
          <span>v0.2</span>
          <strong>{useAI && activeProvider ? `IA — ${activeProvider.name}` : 'Reglas locales'}</strong>
          <button
            className={`mode-toggle-btn${useAI ? ' active' : ''}`}
            onClick={() => setUseAI((u) => !u)}
            disabled={!activeProvider}
            title={
              !activeProvider
                ? 'Configurá una API key en .env para activar el Modo IA'
                : 'Cambiar modo de análisis'
            }
          >
            {useAI && activeProvider ? `Modo IA — ${activeProvider.name}` : 'Modo reglas'}
          </button>
          <button
            className={`config-open-btn${showConfig ? ' open' : ''}`}
            onClick={() => setShowConfig((s) => !s)}
          >
            ⚙ Configurar API
          </button>
        </div>
      </header>

      {showConfig && (
        <section className="config-panel panel">
          <h3>Proveedores de IA</h3>
          <div className="config-grid">
            {CONFIG_PROVIDERS.map(({ id, label, type, placeholder }) => (
              <div key={id} className="config-field">
                <label htmlFor={`cfg-${id}`}>{label}</label>
                <input
                  id={`cfg-${id}`}
                  type={type}
                  value={formValues[id]}
                  onChange={(e) => setFormValues((v) => ({ ...v, [id]: e.target.value }))}
                  placeholder={placeholder}
                  autoComplete="off"
                />
                {savedKeys[id] && (
                  <small className="config-saved">
                    Guardada: {maskValue(id, savedKeys[id])}
                  </small>
                )}
              </div>
            ))}
          </div>
          <div className="actions-row">
            <button className="primary-button" onClick={saveConfig}>Guardar</button>
            <button className="secondary-button" onClick={clearConfig}>Borrar todo</button>
          </div>
        </section>
      )}

      {copiedMessage && <div className="status-message">{copiedMessage}</div>}

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
    </main>
  );
}
