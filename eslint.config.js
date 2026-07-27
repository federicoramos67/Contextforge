import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
  // Ignorar artefactos de build y dependencias
  { ignores: ['dist', 'node_modules', 'coverage'] },

  // Reglas base recomendadas de ESLint
  js.configs.recommended,

  // Código de la app (React, corre en el navegador)
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // __APP_VERSION__ lo inyecta Vite en build (ver `define` en vite.config.js)
      globals: { ...globals.browser, __APP_VERSION__: 'readonly' },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // extractJSON usa catch {} vacios a proposito para ir probando
      // estrategias de parseo y caer a la siguiente si una falla.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },

  // Tests de Vitest (globals de test + node)
  {
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.vitest },
    },
  },

  // Archivos de configuración que corren en Node
  {
    files: ['*.config.js', 'vite.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Desactiva reglas de estilo que colisionan con Prettier (debe ir al final)
  prettier,
];
