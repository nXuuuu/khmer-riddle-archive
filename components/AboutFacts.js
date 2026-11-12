import collection from "../collection.config.js";

// "About" as a row of museum fact labels.
const FACTS = [
  { label: "Curated by", value: collection.curator },
  { label: "Sources", value: collection.source },
  { label: "Course", value: "ICT 340 — Vibe Coding · AUPP" },
  { label: "Status", value: "A living archive, still growing" },
];

export default function AboutFacts() {
  return (
    <section id="about" className="mu-section" aria-label="About this archive">
      <div className="gr-container">
        <header className="gr-section-header reveal">
          <span className="gr-section-label">About · អំពី</span>
          <h2 className="gr-section-title">About this <em>archive</em></h2>
        </header>
        <div className="mu-facts">
          {FACTS.map((f, i) => (
            <div key={f.label} className={`mu-fact reveal delay-${i + 1}`}>
              <span className="mu-label">{f.label}</span>
              <p>{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
