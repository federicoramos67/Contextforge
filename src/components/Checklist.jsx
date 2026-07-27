import { useI18n } from '../i18n/useI18n.js';

export default function Checklist({ checklist }) {
  const { t } = useI18n();

  if (!checklist?.length) return null;

  return (
    <section className="panel checklist-card">
      <p className="eyebrow">{t('checklist.eyebrow')}</p>
      <h2>{t('checklist.title')}</h2>
      <div className="checklist">
        {checklist.map((item) => (
          <label key={item}>
            <input type="checkbox" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
