import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La versión mostrada en la app sale de package.json, que es la única fuente
// de verdad; antes estaba escrita a mano en App.jsx y se desincronizaba.
const { version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  // El sitio se sirve desde https://federicoramos67.github.io/Contextforge/,
  // por lo que los assets del bundle necesitan este prefijo de ruta.
  base: '/Contextforge/',
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      // La cobertura se mide sobre el nucleo puro y testeable: la logica de
      // negocio, el motor de i18n y el acceso a las reglas. Los componentes
      // React se validan aparte y no cuentan para el umbral.
      include: ['src/logic/**/*.js', 'src/i18n/**/*.js', 'src/data/**/*.js'],
      // useI18n solo lee el contexto de React: se ejercita renderizando la app,
      // no desde los tests de logica pura.
      exclude: ['src/i18n/useI18n.js'],
      reporter: ['text', 'html'],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
