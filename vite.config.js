import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // El sitio se sirve desde https://federicoramos67.github.io/Contextforge/,
  // por lo que los assets del bundle necesitan este prefijo de ruta.
  base: '/Contextforge/',
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      // La cobertura se mide sobre la logica de negocio (logic/), que es
      // donde viven las funciones puras y testeables. Los componentes React
      // se validan aparte y no cuentan para el umbral.
      include: ['src/logic/**/*.js'],
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
