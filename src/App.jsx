import { useMemo, useState } from 'react';
import PromptInput from './components/PromptInput';
import ResultCard from './components/ResultCard';
import Checklist from './components/Checklist';
import ScorePanel from './components/ScorePanel';
import PromptSuggestion from './components/PromptSuggestion';
import { classifyPrompt } from './logic/classifyPrompt';
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

export default function App() {
  const [userText, setUserText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState('');

  const markdownReport = useMemo(() => {
    if (!analysis) return '';
    return buildMarkdownReport({
      userText,
      advice: analysis.advice,
      scoreData: analysis.scoreData,
      refinedPrompt: analysis.refinedPrompt,
    });
  }, [analysis, userText]);

  function analyze() {
    const cleanText = userText.trim();

    if (!cleanText) {
      setAnalysis(null);
      setCopiedMessage('Primero escribí una necesidad o prompt.');
      return;
    }

    const category = classifyPrompt(cleanText);
    const advice = generateAdvice(category);
    const scoreData = scoreContext(cleanText);
    const refinedPrompt = generateRefinedPrompt(cleanText, category);

    setAnalysis({ category, advice, scoreData, refinedPrompt });
    setCopiedMessage('Análisis generado.');
  }

  async function copyToClipboard(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(successMessage);
    } catch (error) {
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
          <span>v0.1</span>
          <strong>Reglas locales</strong>
        </div>
      </header>

      {copiedMessage && <div className="status-message">{copiedMessage}</div>}

      <div className="layout">
        <PromptInput
          value={userText}
          onChange={setUserText}
          onAnalyze={analyze}
          examples={examples}
          onExample={(text) => {
            setUserText(text);
            setCopiedMessage('Ejemplo cargado. Presioná “Analizar contexto”.');
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
