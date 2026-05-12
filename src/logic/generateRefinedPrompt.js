export function generateRefinedPrompt(userText, category) {
  const files = [...category.primaryFormats, ...category.secondaryFormats]
    .map((item) => `- ${item}`)
    .join('\n');

  return `${category.role}

Tarea original del usuario:
"${userText.trim()}"

Antes de responder, considerá que voy a compartir este contexto recomendado:
${files}

Necesito que me ayudes con: ${category.expectedOutput}.

Condiciones de respuesta:
- Explicá primero qué información falta, si falta algo.
- Priorizá lo más importante.
- Devolvé pasos concretos y verificables.
- No inventes datos que no estén en el material compartido.`;
}
