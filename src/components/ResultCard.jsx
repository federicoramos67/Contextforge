export default function ResultCard({ advice }) {
  if (!advice) {
    return (
      <section className="panel empty-state">
        <p className="eyebrow">Resultado</p>
        <h2>Esperando un prompt</h2>
        <p>Escribí una necesidad en lenguaje natural y ContextForge te recomendará el mejor tipo de contexto para compartir con una IA.</p>
      </section>
    );
  }

  return (
    <section className="panel result-card">
      <div className="result-topline">
        <div>
          <p className="eyebrow">Categoría detectada</p>
          <h2>{advice.category}</h2>
        </div>
        <div className="confidence-pill">{advice.confidence}% confianza</div>
      </div>

      <p className="description">{advice.description}</p>

      <div className="result-grid">
        <div className="mini-card strong-card">
          <h3>Formato principal</h3>
          <ul>
            {advice.primaryFormats.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mini-card">
          <h3>Complementos útiles</h3>
          <ul>
            {advice.secondaryFormats.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mini-card warning-card">
          <h3>Qué evitar</h3>
          <ul>
            {advice.avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="reason-box">
        <h3>Por qué</h3>
        <p>{advice.reason}</p>
      </div>

      <div className="reason-box">
        <h3>Por qué se detectó esta categoría</h3>
        <p>{advice.diagnosticExplanation}</p>
      </div>

      {advice.matchedKeywords?.length > 0 && (
        <div className="reason-box">
          <h3>Keywords detectadas</h3>
          <p>{advice.matchedKeywords.join(', ')}</p>
        </div>
      )}
    </section>
  );
}
