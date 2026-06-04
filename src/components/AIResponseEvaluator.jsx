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

const levelLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export default function AIResponseEvaluator({
  aiResponse,
  evaluation,
  onChangeResponse,
  onEvaluate,
  onCopyNextPrompt,
}) {
  if (aiResponse === undefined) return null;

  return (
    <section className="panel ai-response-card">
      <div className="section-heading">
        <p className="eyebrow">Cierre del ciclo</p>
        <h2>Evaluar respuesta de IA</h2>
      </div>

      <textarea
        value={aiResponse}
        onChange={(event) => onChangeResponse(event.target.value)}
        placeholder="Pegá acá la respuesta que te dio la IA externa."
      />

      <div className="actions-row wrap">
        <button className="primary-button" onClick={onEvaluate}>Evaluar respuesta</button>
      </div>

      {evaluation && (
        <div className="ai-evaluation-result">
          <div className="result-topline">
            <div>
              <p className="eyebrow">Nivel de completitud</p>
              <h3>{levelLabels[evaluation.completionLevel] || 'Media'}</h3>
            </div>
            <div className={`level level-${evaluation.completionLevel}`}>
              {evaluation.completionLevel}
            </div>
          </div>

          <div className="result-grid">
            <ListBlock title="Que respondio bien" items={evaluation.strengths} />
            <ListBlock title="Que falta o esta debil" items={evaluation.missingOrWeakPoints} />
            <ListBlock title="Riesgos" items={evaluation.riskWarnings} />
          </div>

          <div className="reason-box next-prompt-box">
            <h3>Siguiente prompt recomendado</h3>
            <pre>{evaluation.nextPrompt}</pre>
          </div>

          <div className="actions-row wrap">
            <button className="secondary-button" onClick={onCopyNextPrompt}>
              Copiar siguiente prompt
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
