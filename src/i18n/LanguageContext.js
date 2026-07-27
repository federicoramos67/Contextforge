import { createContext } from 'react';

// El contexto vive en su propio módulo para que LanguageProvider.jsx exporte
// únicamente componentes y react-refresh pueda hacer hot reload sin perder el
// estado del árbol.
export const LanguageContext = createContext(null);
