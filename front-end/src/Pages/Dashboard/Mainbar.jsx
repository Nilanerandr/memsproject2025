import "./Dashboard.css";

export default function Mainbar({ children }){
  return (
    <main className="cm-main">
      <section className="cm-content">
        {children ?? <div className="cm-card">Contenu du dashboard…</div>}
      </section>
    </main>
  );
}
