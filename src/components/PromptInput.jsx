export default function PromptInput({ value, onChange, onAnalyze, examples, onExample }) {
  return (
    <section className="panel input-panel">
      <div className="section-heading">
        <p className="eyebrow">Entrada</p>
        <h2>Escribí el prompt o necesidad del usuario</h2>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ejemplo: Quiero que una IA revise mi landing page y me diga por qué no convierte..."
        rows={8}
      />

      <div className="actions-row">
        <button className="primary-button" onClick={onAnalyze}>
          Analizar contexto
        </button>
        <span className="hint">No se envían datos a ningún servidor: esta versión funciona con reglas locales.</span>
      </div>

      <div className="examples">
        <p>Ejemplos rápidos:</p>
        <div className="example-grid">
          {examples.map((example) => (
            <button key={example.label} onClick={() => onExample(example.text)}>
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
