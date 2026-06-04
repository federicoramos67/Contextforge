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
  if (!audit) return null;

  return (
    <section className="panel audit-card">
      <div className="section-heading">
        <p className="eyebrow">Auditoria de contexto</p>
        <h2>Que conviene aclarar antes de consultar a la IA</h2>
      </div>

      <div className="result-grid">
        <AuditBlock title="Contexto faltante" items={audit.missingItems} />
        <AuditBlock title="Riesgos si no se agrega" items={audit.riskWarnings} />
        <AuditBlock title="Preguntas utiles antes de consultar a la IA" items={audit.clarificationQuestions} />
      </div>
    </section>
  );
}
