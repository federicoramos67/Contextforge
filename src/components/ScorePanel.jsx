export default function ScorePanel({ scoreData }) {
  if (!scoreData) return null;

  return (
    <section className="panel score-panel">
      <div className="score-header">
        <div>
          <p className="eyebrow">Calidad del contexto</p>
          <h2>{scoreData.score}/100</h2>
        </div>
        <span className={`level level-${scoreData.level.toLowerCase()}`}>{scoreData.level}</span>
      </div>

      <div className="score-bar" aria-label={`Puntaje ${scoreData.score} de 100`}>
        <div style={{ width: `${scoreData.score}%` }} />
      </div>

      <div className="checks">
        {scoreData.checks.map((check) => (
          <div key={check.id} className={check.passed ? 'check passed' : 'check missing'}>
            <span>{check.passed ? '✓' : '!'}</span>
            <p>{check.label}</p>
            <small>{check.points} pts</small>
          </div>
        ))}
      </div>

      {scoreData.improvements.length > 0 && (
        <div className="improvements">
          <h3>Mejoras sugeridas</h3>
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
