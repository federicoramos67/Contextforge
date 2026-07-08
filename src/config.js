// Configuración de proveedores de IA para ContextForge
// Los valores se leen desde import.meta.env.VITE_* (build time) y localStorage (runtime).
// localStorage tiene precedencia sobre las variables de entorno.

export const STORAGE_KEY = 'contextforge_api_keys';
// Proveedor seleccionado manualmente; 'auto' o ausente = usar orden de prioridad
export const ACTIVE_PROVIDER_KEY = 'contextforge_active_provider';

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
    model: 'openai/gpt-oss-20b',
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
    model: 'claude-haiku-4-5-20251001',
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

// Devuelve los proveedores que tienen key disponible (localStorage o .env), en orden de prioridad
export function getAvailableProviders() {
  const stored = getStoredKeys();
  return PRIORITY
    .filter(id => {
      if (id === 'ollama') return !!(stored.ollama || import.meta.env.VITE_OLLAMA_URL);
      return !!(stored[id] || CONFIG[id].key);
    })
    .map(id => ({ id, name: CONFIG[id].name }));
}

// Devuelve el primer proveedor activo con su key/URL efectiva resuelta.
// Respeta la selección manual (ACTIVE_PROVIDER_KEY) si ese proveedor tiene key disponible;
// en caso contrario aplica el orden de prioridad automático.
export function getActiveProvider() {
  const stored = getStoredKeys();
  const selectedId = localStorage.getItem(ACTIVE_PROVIDER_KEY);

  const order = (selectedId && selectedId !== 'auto')
    ? [selectedId, ...PRIORITY.filter(id => id !== selectedId)]
    : PRIORITY;

  for (const id of order) {
    const p = CONFIG[id];
    if (!p) continue;

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
