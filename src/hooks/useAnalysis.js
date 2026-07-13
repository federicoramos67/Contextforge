import { useMemo, useState } from 'react';
import { classifyPrompt } from '../logic/classifyPrompt';
import { classifyWithAI } from '../logic/classifyWithAI';
import { scoreContext } from '../logic/scoreContext';
import { generateAdvice } from '../logic/generateAdvice';
import { generateRefinedPrompt } from '../logic/generateRefinedPrompt';
import { auditMissingContext } from '../logic/auditMissingContext';
import { evaluateAIResponse } from '../logic/evaluateAIResponse';
import { autofillContextFromReference } from '../logic/autofillContextFromReference';
import { buildMarkdownReport } from '../logic/exportMarkdown';

// Hook que concentra el dominio de análisis: el estado del prompt y sus
// resultados, la orquestación (reglas locales o IA con fallback), y las
// acciones sobre el resultado (copiar, descargar, evaluar, autocompletar).
//
// Recibe del componente el modo (useAI), el proveedor activo resuelto
// (activeProvider) y el canal de estado global (setCopiedMessage), que son
// app-level y compartidos con el panel de configuración.
export function useAnalysis({ useAI, activeProvider, setCopiedMessage }) {
  const [userText, setUserText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [aiResponse, setAiResponse] = useState('');
  const [responseEvaluation, setResponseEvaluation] = useState(null);
  const [referenceText, setReferenceText] = useState('');
  const [contextAutofill, setContextAutofill] = useState(null);

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

  return {
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
  };
}
