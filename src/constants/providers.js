// Definición de campos del panel de configuración de proveedores de IA.
// Los nombres de proveedor son marcas y no se traducen; el único campo con
// texto traducible es Ollama, cuya etiqueta se resuelve con `labelKey`.
export const CONFIG_PROVIDERS = [
  {
    id: 'mistral',
    label: 'Mistral',
    type: 'password',
    placeholder: 'VITE_MISTRAL_KEY',
  },
  { id: 'groq', label: 'Groq', type: 'password', placeholder: 'VITE_GROQ_KEY' },
  {
    id: 'gemini',
    label: 'Google Gemini',
    type: 'password',
    placeholder: 'VITE_GEMINI_KEY',
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    type: 'password',
    placeholder: 'VITE_ANTHROPIC_KEY',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    type: 'password',
    placeholder: 'VITE_OPENAI_KEY',
  },
  {
    id: 'ollama',
    labelKey: 'settings.ollamaLabel',
    type: 'text',
    placeholder: 'http://localhost:11434',
  },
];

// Formulario vacío inicial del panel (una entrada por proveedor).
export const EMPTY_FORM = {
  mistral: '',
  groq: '',
  gemini: '',
  anthropic: '',
  openai: '',
  ollama: '',
};
