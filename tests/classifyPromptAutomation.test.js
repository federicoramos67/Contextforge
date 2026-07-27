import { describe, expect, it, test } from 'vitest';
import { classifyPrompt } from '../src/logic/classifyPrompt';

// Prompt exacto del bug: antes clasificaba como `visual_ui` porque el único
// match visual era la keyword genérica `web`. Debe quedar como caso de
// regresión permanente.
const BUG_PROMPT =
  'Quiero armar un flujo automático que cada vez que llegue un formulario de contacto en mi web, mande los datos a una planilla y dispare un mail de respuesta';

describe('classifyPrompt - automatización y desambiguación de `web`', () => {
  // Casos de automatización con vocabulario variado (conceptos ES/EN + herramientas).
  const automationCases = [
    ['bug: flujo automático + formulario + web (regresión)', BUG_PROMPT],
    [
      'conectar + zapier + automatizar',
      'Quiero conectar mi tienda con una hoja de cálculo usando Zapier para automatizar los pedidos nuevos.',
    ],
    [
      'workflow + webhook + trigger + pipeline + sin código',
      'Necesito un workflow con un webhook y un trigger que dispare un pipeline sin código.',
    ],
    [
      'integrar + make',
      'Quiero integrar dos aplicaciones con Make para automatizar tareas repetitivas entre ellas.',
    ],
    [
      'bot + apps script + formulario',
      'Armar un bot con apps script que procese los formularios y responda automatico.',
    ],
  ];

  test.each(automationCases)(
    'clasifica como automation -> %s',
    (_label, prompt) => {
      expect(classifyPrompt(prompt).id).toBe('automation');
    },
  );

  it('no clasifica el prompt del bug como diseño visual', () => {
    expect(classifyPrompt(BUG_PROMPT).id).not.toBe('visual_ui');
  });

  // Categorías que ya funcionaban bien: confirman que no se rompió nada.
  // Los prompts de código/PDF/web replican los ejemplos precargados de la app.
  const otherCategoryCases = [
    [
      'programming_debug',
      'Tengo un error en una app React con Vite. Quiero que una IA me ayude a corregir el bug y me explique qué archivo tocar.',
    ],
    [
      'long_document',
      'Necesito que una IA resuma un informe PDF largo y me saque las ideas principales en formato académico.',
    ],
    [
      'marketing_campaign',
      'Quiero crear una campaña de email marketing con una CTA clara para renovar las suscripciones de clientes.',
    ],
    [
      'visual_ui',
      'Necesito rediseñar la interfaz visual de mi app, revisar los botones, colores y tipografía.',
    ],
    [
      'web_analysis',
      'Quiero que una IA revise mi landing page y me diga por qué no convierte. Necesito recomendaciones para el hero y el CTA.',
    ],
  ];

  test.each(otherCategoryCases)(
    'mantiene la categoría %s',
    (expectedId, prompt) => {
      expect(classifyPrompt(prompt).id).toBe(expectedId);
    },
  );

  it('`web` sigue contando cuando no hay señales de automatización', () => {
    // Prompt puramente visual: la supresión de `web` NO debe dispararse.
    const result = classifyPrompt(
      'Revisá el diseño visual de mi web y los colores del hero.',
    );
    expect(result.id).toBe('visual_ui');
    expect(result.matchedKeywords).toContain('web');
  });

  it('un formulario que se rediseña sigue siendo diseño visual', () => {
    // `formulario` es ambiguo (se diseña tanto como se automatiza) y no está entre
    // las señales que suprimen `web`, así que este prompt visual no debe migrar.
    const result = classifyPrompt(
      'Quiero rediseñar el formulario de contacto de mi web, se ve feo.',
    );
    expect(result.id).toBe('visual_ui');
  });
});
