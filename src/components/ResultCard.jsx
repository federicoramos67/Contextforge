import { useI18n } from '../i18n/useI18n.js';

export default function ResultCard({ advice }) {
  const { t } = useI18n();

  if (!advice) {
    return (
      <section className="panel empty-state">
        <p className="eyebrow">{t('result.emptyEyebrow')}</p>
        <h2>{t('result.emptyTitle')}</h2>
        <p>{t('result.emptyBody')}</p>
      </section>
    );
  }

  return (
    <section className="panel result-card">
      <div className="result-topline">
        <div>
          <p className="eyebrow">{t('result.categoryEyebrow')}</p>
          <h2>{advice.category}</h2>
        </div>
        <div className="confidence-pill">
          {t('result.confidence', { value: advice.confidence })}
        </div>
      </div>

      <p className="description">{advice.description}</p>

      <div className="result-grid">
        <div className="mini-card strong-card">
          <h3>{t('result.primaryFormats')}</h3>
          <ul>
            {advice.primaryFormats.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mini-card">
          <h3>{t('result.secondaryFormats')}</h3>
          <ul>
            {advice.secondaryFormats.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mini-card warning-card">
          <h3>{t('result.avoid')}</h3>
          <ul>
            {advice.avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="reason-box">
        <h3>{t('result.reason')}</h3>
        <p>{advice.reason}</p>
      </div>

      <div className="reason-box">
        <h3>{t('result.diagnostic')}</h3>
        <p>{advice.diagnosticExplanation}</p>
      </div>

      {advice.matchedKeywords?.length > 0 && (
        <div className="reason-box">
          <h3>{t('result.keywords')}</h3>
          <p>{advice.matchedKeywords.join(', ')}</p>
        </div>
      )}
    </section>
  );
}
