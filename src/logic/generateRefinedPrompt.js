import { DEFAULT_LOCALE, getTranslator } from '../i18n/index.js';

export function generateRefinedPrompt(
  userText,
  category,
  locale = DEFAULT_LOCALE,
) {
  const t = getTranslator(locale);
  const files = [...category.primaryFormats, ...category.secondaryFormats]
    .map((item) => `- ${item}`)
    .join('\n');
  const conditions = t('refinedPrompt.conditions')
    .map((item) => `- ${item}`)
    .join('\n');

  return `${category.role}

${t('refinedPrompt.originalTask')}
"${userText.trim()}"

${t('refinedPrompt.contextIntro')}
${files}

${t('refinedPrompt.needHelpWith', { expectedOutput: category.expectedOutput })}

${t('refinedPrompt.conditionsTitle')}
${conditions}`;
}
