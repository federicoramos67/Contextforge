// Ids de los ejemplos precargados que ofrece PromptInput. La etiqueta y el
// texto de cada uno viven en los diccionarios de i18n (`examples.<id>`), para
// que el prompt de ejemplo aparezca en el idioma de la interfaz.
export const EXAMPLE_IDS = ['landing', 'codeError', 'pdf', 'automation'];

export function getExamples(t) {
  return EXAMPLE_IDS.map((id) => ({
    id,
    label: t(`examples.${id}.label`),
    text: t(`examples.${id}.text`),
  }));
}
