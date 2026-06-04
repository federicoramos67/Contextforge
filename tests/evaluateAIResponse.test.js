import { describe, expect, it } from 'vitest';
import { evaluateAIResponse } from '../src/logic/evaluateAIResponse';

const category = {
  id: 'programming_debug',
  label: 'Programacion / depuracion de codigo',
  checklist: [
    'Archivo o bloque de codigo completo',
    'Mensaje de error completo',
    'Que esperabas que pasara',
    'Que paso realmente',
    'Comando usado para ejecutar',
  ],
};

const advice = {
  checklist: category.checklist,
  primaryFormats: ['Codigo fuente copiado como texto o archivos del proyecto', 'Logs completos de error'],
  secondaryFormats: ['Comando exacto ejecutado'],
};

describe('evaluateAIResponse', () => {
  it('marks an empty response as low completion', () => {
    const result = evaluateAIResponse({
      userText: 'Necesito corregir un bug en React.',
      aiResponse: '',
      category,
      advice,
    });

    expect(result.completionLevel).toBe('low');
    expect(result.riskWarnings.length).toBeGreaterThan(0);
  });

  it('flags vague responses with risks', () => {
    const result = evaluateAIResponse({
      userText: 'Necesito corregir un bug en React.',
      aiResponse: 'Depende del caso. En general podria ser un problema de configuracion o de codigo.',
      category,
      advice,
    });

    expect(['low', 'medium']).toContain(result.completionLevel);
    expect(result.riskWarnings.length).toBeGreaterThan(0);
  });

  it('recognizes responses with concrete steps as medium or high', () => {
    const result = evaluateAIResponse({
      userText: 'Necesito corregir un bug en React con npm run build.',
      aiResponse: `Primero revisa el archivo App.jsx y confirma el mensaje de error completo.
1. Ejecuta npm run build.
2. Copia el log completo.
3. Cambia el componente que falla y vuelve a probar.
El resultado esperado es que el build termine sin errores.`,
      category,
      advice,
    });

    expect(['medium', 'high']).toContain(result.completionLevel);
    expect(result.strengths).toContain('Incluye pasos o acciones concretas.');
  });

  it('always generates a non-empty next prompt', () => {
    const result = evaluateAIResponse({
      userText: 'Quiero mejorar una respuesta de IA.',
      aiResponse: '',
      category,
      advice,
      missingContextAudit: {
        missingItems: ['Mensaje de error completo'],
        riskWarnings: [],
        clarificationQuestions: [],
      },
    });

    expect(result.nextPrompt.trim().length).toBeGreaterThan(0);
  });
});
