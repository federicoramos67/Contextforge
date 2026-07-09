// Clasificador con IA real — reemplaza la lógica heurística cuando hay un proveedor activo.
// Devuelve el mismo shape que classifyPrompt.js con fallback automático si la llamada falla.
import rules from '../data/contextRules.json';
import { classifyPrompt } from './classifyPrompt';
import { getActiveProvider } from '../config';

// Tiempo maximo de espera por proveedor antes de abortar la llamada (ms).
// Si un proveedor se cuelga, el fetch se corta y se dispara el fallback local.
const REQUEST_TIMEOUT_MS = 30000;

function buildSystemPrompt() {
  const categoryList = rules.map((r) => `- ${r.id}: ${r.label}`).join('\n');

  return `You are a context strategy advisor for AI tools. Your job is to analyze the user's need written in natural language and determine what type of information and file formats would help an AI understand and respond better.

You must respond ONLY with a valid JSON object. No explanation, no markdown, no preamble. Just the raw JSON.

Available categories (use the id field to select one):
${categoryList}

Respond with this exact shape:
{
  "id": "string (category id from the list above)",
  "label": "string (category label)",
  "confidence": 0,
  "matchedKeywords": [],
  "description": "string (why this category fits)",
  "primaryFormats": [],
  "secondaryFormats": [],
  "avoid": [],
  "checklist": [],
  "reason": "string (explanation of why this context helps the AI)",
  "diagnosticExplanation": "string (brief explanation of category detection)"
}

If no category fits clearly, use general_context.
Never invent categories outside the list.`;
}

// Intenta extraer un objeto JSON de texto que puede incluir markdown o texto extra
function extractJSON(text) {
  try {
    return JSON.parse(text.trim());
  } catch {}

  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (block) {
    try { return JSON.parse(block[1].trim()); } catch {}
  }

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }

  throw new Error('No se pudo extraer JSON válido de la respuesta de la IA');
}

// --- Adaptadores por proveedor ---

async function callOllama(provider, systemPrompt, userText) {
  const res = await fetch(`${provider.url}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: provider.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText },
      ],
      stream: false,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Ollama ${res.status}`);
  const data = await res.json();
  return data.message.content;
}

// Groq, Mistral y OpenAI comparten el formato de la API de OpenAI
async function callOpenAICompat(endpoint, key, model, systemPrompt, userText) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText },
      ],
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${endpoint} ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callAnthropic(provider, systemPrompt, userText) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': provider.key,
      'anthropic-version': '2023-06-01',
      // Anthropic bloquea por CORS las llamadas directas desde el navegador
      // salvo que se declare explicitamente este header. Solo apto para uso
      // local: expone la API key en el cliente. Ver README (seccion seguridad).
      'anthropic-dangerous-direct-browser-access': 'true',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userText }],
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

async function callGemini(provider, systemPrompt, userText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${provider.key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userText }] }],
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function callProvider(provider, systemPrompt, userText) {
  switch (provider.id) {
    case 'ollama':
      return callOllama(provider, systemPrompt, userText);
    case 'groq':
      return callOpenAICompat(
        'https://api.groq.com/openai/v1/chat/completions',
        provider.key, provider.model, systemPrompt, userText,
      );
    case 'mistral':
      return callOpenAICompat(
        'https://api.mistral.ai/v1/chat/completions',
        provider.key, provider.model, systemPrompt, userText,
      );
    case 'openai':
      return callOpenAICompat(
        'https://api.openai.com/v1/chat/completions',
        provider.key, provider.model, systemPrompt, userText,
      );
    case 'anthropic':
      return callAnthropic(provider, systemPrompt, userText);
    case 'gemini':
      return callGemini(provider, systemPrompt, userText);
    default:
      throw new Error(`Proveedor desconocido: ${provider.id}`);
  }
}

// --- Función principal exportada ---

export async function classifyWithAI(text) {
  const provider = getActiveProvider();

  if (!provider) {
    return { ...classifyPrompt(text), _fallback: true, _fallbackReason: 'Sin proveedor configurado' };
  }

  try {
    const systemPrompt = buildSystemPrompt();
    const raw = await callProvider(provider, systemPrompt, text);
    const aiResult = extractJSON(raw);

    // Normalizar confidence: algunos modelos devuelven escala 0-1 en lugar de 0-100
    if (typeof aiResult.confidence === 'number' && aiResult.confidence <= 1) {
      aiResult.confidence = Math.round(aiResult.confidence * 100);
    }

    // Usar la regla base del JSON para completar campos que la IA pudiera omitir
    const rule = rules.find((r) => r.id === aiResult.id)
      || rules.find((r) => r.id === 'general_context');

    return {
      ...rule,
      label: aiResult.label || rule.label,
      confidence: typeof aiResult.confidence === 'number' ? aiResult.confidence : 50,
      matchedKeywords: Array.isArray(aiResult.matchedKeywords) ? aiResult.matchedKeywords : [],
      description: aiResult.description || rule.description,
      primaryFormats: Array.isArray(aiResult.primaryFormats) && aiResult.primaryFormats.length
        ? aiResult.primaryFormats : rule.primaryFormats,
      secondaryFormats: Array.isArray(aiResult.secondaryFormats) && aiResult.secondaryFormats.length
        ? aiResult.secondaryFormats : rule.secondaryFormats,
      avoid: Array.isArray(aiResult.avoid) && aiResult.avoid.length
        ? aiResult.avoid : rule.avoid,
      checklist: Array.isArray(aiResult.checklist) && aiResult.checklist.length
        ? aiResult.checklist : rule.checklist,
      reason: aiResult.reason || rule.reason,
      diagnosticExplanation: aiResult.diagnosticExplanation || '',
    };
  } catch (err) {
    // AbortSignal.timeout rechaza con un TimeoutError cuando el proveedor
    // no respondio a tiempo: lo traducimos a un mensaje claro para la UI.
    const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError';
    return {
      ...classifyPrompt(text),
      _fallback: true,
      _fallbackReason: isTimeout
        ? `El proveedor no respondio en ${REQUEST_TIMEOUT_MS / 1000}s (timeout)`
        : err.message || 'Error desconocido',
    };
  }
}
