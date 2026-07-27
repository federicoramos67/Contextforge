import { useI18n } from '../i18n/useI18n.js';

export default function ScorePanel({ scoreData }) {
  const { t } = useI18n();

  if (!scoreData) return null;

  return (
    <section className="panel score-panel">
      <div className="score-header">
        <div>
          <p className="eyebrow">{t('score.eyebrow')}</p>
          <h2>{scoreData.score}/100</h2>
        </div>
        {/* La clase usa levelId, que es estable entre idiomas; la etiqueta
            visible sí está traducida. */}
        <span className={`level level-${scoreData.levelId}`}>
          {scoreData.level}
        </span>
      </div>

      <div
        className="score-bar"
        aria-label={t('score.barLabel', { score: scoreData.score })}
      >
        <div style={{ width: `${scoreData.score}%` }} />
      </div>

      <div className="checks">
        {scoreData.checks.map((check) => (
          <div
            key={check.id}
            className={check.passed ? 'check passed' : 'check missing'}
          >
            <span>{check.passed ? '✓' : '!'}</span>
            <p>{check.label}</p>
            <small>{check.points} pts</small>
          </div>
        ))}
      </div>

      {scoreData.improvements.length > 0 && (
        <div className="improvements">
          <h3>{t('score.improvements')}</h3>
          <ul>
            {scoreData.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
