export default function PromptSuggestion({ prompt, onCopyPrompt, onCopyReport, onDownloadMarkdown }) {
  if (!prompt) return null;

  return (
    <section className="panel prompt-card">
      <div className="section-heading">
        <p className="eyebrow">Próximo paso</p>
        <h2>Prompt refinado para copiar</h2>
      </div>

      <pre>{prompt}</pre>

      <div className="actions-row wrap">
        <button className="primary-button" onClick={onCopyPrompt}>Copiar prompt</button>
        <button className="secondary-button" onClick={onCopyReport}>Copiar diagnóstico</button>
        <button className="secondary-button" onClick={onDownloadMarkdown}>Descargar Markdown</button>
      </div>
    </section>
  );
}
