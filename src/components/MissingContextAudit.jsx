import { useI18n } from '../i18n/useI18n.js';

function AuditBlock({ title, items }) {
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

export default function MissingContextAudit({ audit }) {
  const { t } = useI18n();

  if (!audit) return null;

  return (
    <section className="panel audit-card">
      <div className="section-heading">
        <p className="eyebrow">{t('audit.eyebrow')}</p>
        <h2>{t('audit.title')}</h2>
      </div>

      <div className="result-grid">
        <AuditBlock title={t('audit.missing')} items={audit.missingItems} />
        <AuditBlock title={t('audit.risks')} items={audit.riskWarnings} />
        <AuditBlock
          title={t('audit.questions')}
          items={audit.clarificationQuestions}
        />
      </div>
    </section>
  );
}
