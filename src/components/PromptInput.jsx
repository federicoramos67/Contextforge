import { useI18n } from '../i18n/useI18n.js';

export default function PromptInput({
  value,
  onChange,
  onAnalyze,
  examples,
  onExample,
}) {
  const { t } = useI18n();

  return (
    <section className="panel input-panel">
      <div className="section-heading">
        <p className="eyebrow">{t('input.eyebrow')}</p>
        <h2>{t('input.title')}</h2>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('input.placeholder')}
        rows={8}
        aria-label={t('input.title')}
      />

      <div className="actions-row">
        <button className="primary-button" onClick={onAnalyze}>
          {t('input.analyze')}
        </button>
        <span className="hint">{t('input.privacyHint')}</span>
      </div>

      <div className="examples">
        <p>{t('input.examplesTitle')}</p>
        <div className="example-grid">
          {examples.map((example) => (
            <button key={example.id} onClick={() => onExample(example.text)}>
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
