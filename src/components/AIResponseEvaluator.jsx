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

export default function AIResponseEvaluator({
  aiResponse,
  evaluation,
  onChangeResponse,
  onEvaluate,
  onCopyNextPrompt,
}) {
  const { t } = useI18n();

  if (aiResponse === undefined) return null;

  return (
    <section className="panel ai-response-card">
      <div className="section-heading">
        <p className="eyebrow">{t('evaluator.eyebrow')}</p>
        <h2>{t('evaluator.title')}</h2>
      </div>

      <textarea
        value={aiResponse}
        onChange={(event) => onChangeResponse(event.target.value)}
        placeholder={t('evaluator.placeholder')}
        aria-label={t('evaluator.title')}
      />

      <div className="actions-row wrap">
        <button className="primary-button" onClick={onEvaluate}>
          {t('evaluator.action')}
        </button>
      </div>

      {evaluation && (
        <div className="ai-evaluation-result">
          <div className="result-topline">
            <div>
              <p className="eyebrow">{t('evaluator.completionEyebrow')}</p>
            </div>
            {/* El nivel se muestra una sola vez, en el badge de color; antes se
                repetía como título traducido y como id crudo al lado. */}
            <div className={`level level-${evaluation.completionLevel}`}>
              {t(`evaluator.levels.${evaluation.completionLevel}`)}
            </div>
          </div>

          <div className="result-grid">
            <ListBlock
              title={t('evaluator.strengths')}
              items={evaluation.strengths}
            />
            <ListBlock
              title={t('evaluator.weakPoints')}
              items={evaluation.missingOrWeakPoints}
            />
            <ListBlock
              title={t('evaluator.risks')}
              items={evaluation.riskWarnings}
            />
          </div>

          <div className="reason-box next-prompt-box">
            <h3>{t('evaluator.nextPrompt')}</h3>
            <pre>{evaluation.nextPrompt}</pre>
          </div>

          <div className="actions-row wrap">
            <button className="secondary-button" onClick={onCopyNextPrompt}>
              {t('evaluator.copyNextPrompt')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
