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

function InferredContext({ inferredContext }) {
  const entries = Object.entries(inferredContext || {}).filter(([, value]) => {
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  if (!entries.length) return null;

  return (
    <div className="mini-card strong-card">
      <h3>Contexto inferido</h3>
      <dl className="context-definition-list">
        {entries.map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{Array.isArray(value) ? value.join('; ') : value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ContextAutofill({
  referenceText,
  contextAutofill,
  onChangeReference,
  onAutofill,
  onCopyUpdatedPrompt,
}) {
  return (
    <section className="panel context-autofill-card">
      <div className="section-heading">
        <p className="eyebrow">Material de referencia</p>
        <h2>Rellenar contexto con material de referencia</h2>
      </div>

      <textarea
        value={referenceText}
        onChange={(event) => onChangeReference(event.target.value)}
        placeholder="Pegá una campaña anterior, brief, email, documento, texto de cliente o documentación base."
      />

      <div className="actions-row wrap">
        <button className="primary-button" onClick={onAutofill}>Rellenar contexto</button>
      </div>

      {contextAutofill && (
        <div className="context-autofill-result">
          <div className="result-grid">
            <ListBlock title="Contexto rellenado" items={contextAutofill.filledItems} />
            <ListBlock title="Señales detectadas" items={contextAutofill.detectedSignals} />
            <ListBlock title="Contexto todavía faltante" items={contextAutofill.stillMissingItems} />
          </div>

          <div className="result-grid context-autofill-secondary">
            <InferredContext inferredContext={contextAutofill.inferredContext} />
          </div>

          <div className="reason-box next-prompt-box">
            <h3>Prompt actualizado</h3>
            <pre>{contextAutofill.updatedPrompt}</pre>
          </div>

          <div className="actions-row wrap">
            <button className="secondary-button" onClick={onCopyUpdatedPrompt}>
              Copiar prompt actualizado
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
