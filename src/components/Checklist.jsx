export default function Checklist({ checklist }) {
  if (!checklist?.length) return null;

  return (
    <section className="panel checklist-card">
      <p className="eyebrow">Checklist</p>
      <h2>Antes de pedirle ayuda a una IA, prepará esto</h2>
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
