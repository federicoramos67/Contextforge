import { useI18n } from '../i18n/useI18n.js';

export default function PromptSuggestion({
  prompt,
  onCopyPrompt,
  onCopyReport,
  onDownloadMarkdown,
}) {
  const { t } = useI18n();

  if (!prompt) return null;

  return (
    <section className="panel prompt-card">
      <div className="section-heading">
        <p className="eyebrow">{t('prompt.eyebrow')}</p>
        <h2>{t('prompt.title')}</h2>
      </div>

      <pre>{prompt}</pre>

      <div className="actions-row wrap">
        <button className="primary-button" onClick={onCopyPrompt}>
          {t('prompt.copyPrompt')}
        </button>
        <button className="secondary-button" onClick={onCopyReport}>
          {t('prompt.copyReport')}
        </button>
        <button className="secondary-button" onClick={onDownloadMarkdown}>
          {t('prompt.downloadMarkdown')}
        </button>
      </div>
    </section>
  );
}
