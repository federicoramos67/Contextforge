import { useEffect, useMemo, useRef, useState } from 'react';
import { getRule } from '../data/rules.js';
import { classifyPrompt } from '../logic/classifyPrompt';
import { classifyWithAI } from '../logic/classifyWithAI';
import { scoreContext } from '../logic/scoreContext';
import { generateAdvice } from '../logic/generateAdvice';
import { generateRefinedPrompt } from '../logic/generateRefinedPrompt';
import { auditMissingContext } from '../logic/auditMissingContext';
import { evaluateAIResponse } from '../logic/evaluateAIResponse';
import { autofillContextFromReference } from '../logic/autofillContextFromReference';
import { buildMarkdownReport } from '../logic/exportMarkdown';
import { useI18n } from '../i18n/useI18n.js';

// Hook que concentra el dominio de análisis: el estado del prompt y sus
// resultados, la orquestación (reglas locales o IA con fallback), y las
// acciones sobre el resultado (copiar, descargar, evaluar, autocompletar).
//
// Recibe del componente el modo (useAI), el proveedor activo resuelto
// (activeProvider) y el canal de estado global (setCopiedMessage), que son
// app-level y compartidos con el panel de configuración. El idioma se toma del
// contexto: cada análisis se genera en el idioma activo al momento de pedirlo.
export function useAnalysis({ useAI, activeProvider, setCopiedMessage }) {
  const { locale, t } = useI18n();
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
      locale,
    });
  }, [
    analysis,
    aiResponse,
    contextAutofill,
    locale,
    referenceText,
    responseEvaluation,
    userText,
  ]);

  // El efecto de re-traducción corre solo cuando cambia el idioma, pero
  // necesita leer el estado más reciente. Guardarlo en una ref evita volver a
  // dispararlo con cada tecla que el usuario escribe en el textarea.
  const latest = useRef(null);
  useEffect(() => {
    latest.current = {
      userText,
      analysis,
      aiResponse,
      referenceText,
      contextAutofill,
      responseEvaluation,
    };
  });

  // Al cambiar de idioma se vuelve a derivar el análisis que ya está en
  // pantalla, para no dejar la mitad de la página en el idioma anterior. Lo
  // que escribió un proveedor de IA se conserva tal cual: retraducirlo
  // requeriría otra llamada paga, así que solo se actualiza en el próximo
  // análisis.
  useEffect(() => {
    const current = latest.current;
    if (!current?.analysis) return;

    const previous = current.analysis.category;
    const category =
      previous._source === 'ai'
        ? previous
        : {
            ...getRule(previous.id, locale),
            confidence: previous.confidence,
            matchedKeywords: previous.matchedKeywords,
            _source: 'rules',
          };

    const advice = generateAdvice(category, locale);
    const missingContextAudit = auditMissingContext(
      current.userText,
      category,
      locale,
    );

    setAnalysis({
      category,
      advice,
      scoreData: scoreContext(current.userText, locale),
      refinedPrompt: generateRefinedPrompt(current.userText, category, locale),
      missingContextAudit,
    });

    if (current.responseEvaluation) {
      setResponseEvaluation(
        evaluateAIResponse({
          userText: current.userText,
          aiResponse: current.aiResponse,
          category,
          advice,
          missingContextAudit,
          locale,
        }),
      );
    }

    if (current.contextAutofill) {
      setContextAutofill(
        autofillContextFromReference({
          userText: current.userText,
          referenceText: current.referenceText,
          category,
          advice,
          missingContextAudit,
          locale,
        }),
      );
    }
  }, [locale]);

  async function analyze() {
    const cleanText = userText.trim();

    if (!cleanText) {
      setAnalysis(null);
      setCopiedMessage(t('status.writeSomethingFirst'));
      return;
    }

    let category;

    if (useAI && activeProvider) {
      setCopiedMessage(
        t('status.analyzingWith', { name: activeProvider.name }),
      );
      const aiCategory = await classifyWithAI(cleanText, locale);
      if (aiCategory._fallback) {
        setCopiedMessage(
          t('status.aiUnavailable', { reason: aiCategory._fallbackReason }),
        );
      }
      // `_source` distingue el texto que escribió un proveedor del que sale de
      // las reglas locales. Solo el segundo se puede volver a traducir en el
      // acto al cambiar de idioma (ver el efecto de más abajo).
      category = {
        ...aiCategory,
        _source: aiCategory._fallback ? 'rules' : 'ai',
      };
    } else {
      category = { ...classifyPrompt(cleanText, locale), _source: 'rules' };
    }

    const advice = generateAdvice(category, locale);
    const scoreData = scoreContext(cleanText, locale);
    const refinedPrompt = generateRefinedPrompt(cleanText, category, locale);
    const missingContextAudit = auditMissingContext(
      cleanText,
      category,
      locale,
    );

    setResponseEvaluation(null);
    setContextAutofill(null);
    setAnalysis({
      category,
      advice,
      scoreData,
      refinedPrompt,
      missingContextAudit,
    });

    if (!category._fallback) {
      setCopiedMessage(t('status.analysisReady'));
    }
  }

  async function copyToClipboard(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(successMessage);
    } catch {
      setCopiedMessage(t('status.copyFailed'));
    }
  }

  function downloadMarkdown() {
    if (!markdownReport) return;

    const blob = new Blob([markdownReport], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = t('report.fileName');
    link.click();
    URL.revokeObjectURL(url);
    setCopiedMessage(t('status.markdownDownloaded'));
  }

  function evaluateResponse() {
    if (!analysis) return;

    const evaluation = evaluateAIResponse({
      userText,
      aiResponse,
      category: analysis.category,
      advice: analysis.advice,
      missingContextAudit: analysis.missingContextAudit,
      locale,
    });

    setResponseEvaluation(evaluation);
    setCopiedMessage(t('status.responseEvaluated'));
  }

  function autofillReferenceContext() {
    if (!analysis) return;

    const result = autofillContextFromReference({
      userText,
      referenceText,
      category: analysis.category,
      advice: analysis.advice,
      missingContextAudit: analysis.missingContextAudit,
      locale,
    });

    setContextAutofill(result);
    setCopiedMessage(t('status.contextFilled'));
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
