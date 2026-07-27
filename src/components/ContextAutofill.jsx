import { useI18n } from '../i18n/useI18n.js';

function ListBlock({ title, items }) {
  if (!items?.length) return null;

  return (
    <div className="mini-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function InferredContext({ inferredContext }) {
  const { t } = useI18n();
  const entries = Object.entries(inferredContext || {}).filter(([, value]) => {
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  if (!entries.length) return null;

  // Las claves ('audience', 'tone', ...) son estables; acá se traducen a su
  // etiqueta legible. Una clave sin traducción se muestra tal cual.
  const labelFor = (key) => {
    const path = `autofillLogic.labels.${key}`;
    const label = t(path);
    return label === path ? key : label;
  };

  return (
    <div className="mini-card strong-card">
      <h3>{t('autofill.inferred')}</h3>
      <dl className="context-definition-list">
        {entries.map(([key, value]) => (
          <div key={key}>
            <dt>{labelFor(key)}</dt>
            <dd>{Array.isArray(value) ? value.join('; ') : value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ContextAutofill({
  referenceText,
  contextAutofill,
  onChangeReference,
  onAutofill,
  onCopyUpdatedPrompt,
}) {
  const { t } = useI18n();

  return (
    <section className="panel context-autofill-card">
      <div className="section-heading">
        <p className="eyebrow">{t('autofill.eyebrow')}</p>
        <h2>{t('autofill.title')}</h2>
      </div>

      <textarea
        value={referenceText}
        onChange={(event) => onChangeReference(event.target.value)}
        placeholder={t('autofill.placeholder')}
        aria-label={t('autofill.title')}
      />

      <div className="actions-row wrap">
        <button className="primary-button" onClick={onAutofill}>
          {t('autofill.action')}
        </button>
      </div>

      {contextAutofill && (
        <div className="context-autofill-result">
          <div className="result-grid">
            <ListBlock
              title={t('autofill.filled')}
              items={contextAutofill.filledItems}
            />
            <ListBlock
              title={t('autofill.signals')}
              items={contextAutofill.detectedSignals}
            />
            <ListBlock
              title={t('autofill.stillMissing')}
              items={contextAutofill.stillMissingItems}
            />
          </div>

          <div className="result-grid context-autofill-secondary">
            <InferredContext
              inferredContext={contextAutofill.inferredContext}
            />
          </div>

          <div className="reason-box next-prompt-box">
            <h3>{t('autofill.updatedPrompt')}</h3>
            <pre>{contextAutofill.updatedPrompt}</pre>
          </div>

          <div className="actions-row wrap">
            <button className="secondary-button" onClick={onCopyUpdatedPrompt}>
              {t('autofill.copyUpdatedPrompt')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
