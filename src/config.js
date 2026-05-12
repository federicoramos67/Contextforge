// Configuración de proveedores de IA para ContextForge
// Los valores se leen desde import.meta.env.VITE_* (build time) y localStorage (runtime).
// localStorage tiene precedencia sobre las variables de entorno.

export const STORAGE_KEY = 'contextforge_api_keys';

// Lee las keys guardadas desde la UI (localStorage). Devuelve {} si no hay nada.
export function getStoredKeys() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

const CONFIG = {
  ollama: {
    id: 'ollama',
    name: 'Ollama',
    url: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
    model: import.meta.env.VITE_OLLAMA_MODEL || 'llama3',
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    key: import.meta.env.VITE_GROQ_KEY,
    model: 'llama3-8b-8192',
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral',
    key: import.meta.env.VITE_MISTRAL_KEY,
    model: 'mistral-small-latest',
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    key: import.meta.env.VITE_GEMINI_KEY,
    model: 'gemini-1.5-flash',
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    key: import.meta.env.VITE_ANTHROPIC_KEY,
    model: 'claude-haiku-3-5-20251001',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    key: import.meta.env.VITE_OPENAI_KEY,
    model: 'gpt-4o-mini',
  },
};

// Orden de prioridad: Ollama → Groq → Mistral → Gemini → Anthropic → OpenAI
const PRIORITY = ['ollama', 'groq', 'mistral', 'gemini', 'anthropic', 'openai'];

// Devuelve el primer proveedor activo con su key/URL efectiva resuelta.
// Para cada proveedor busca primero en localStorage y luego en import.meta.env.
export function getActiveProvider() {
  const stored = getStoredKeys();

  for (const id of PRIORITY) {
    const p = CONFIG[id];

    if (id === 'ollama') {
      const url = stored.ollama || import.meta.env.VITE_OLLAMA_URL;
      if (url) return { ...p, url };
    } else {
      const key = stored[id] || p.key;
      if (key) return { ...p, key };
    }
  }

  return null;
}

export default CONFIG;
