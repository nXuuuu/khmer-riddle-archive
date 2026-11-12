import collection from "../collection.config.js";
import SectionHeading from "./SectionHeading.js";

// "About" as a row of museum fact labels.
const FACTS = [
  { km: "រៀបចំដោយ", label: "Curated by", value: collection.curator },
  { km: "ប្រភព", label: "Sources", value: collection.source },
  { km: "មុខវិជ្ជា", label: "Course", value: "ICT 340 — Vibe Coding · AUPP" },
  { km: "ស្ថានភាព", label: "Status", value: "A living archive, still growing" },
];

export default function AboutFacts() {
  return (
    <section id="about" className="mu-section" aria-label="About this archive">
      <div className="gr-container">
        <SectionHeading label="About" km="អំពីបណ្ណសារនេះ" en={<>About this <em>archive</em></>} />
        <div className="mu-facts">
          {FACTS.map((f, i) => (
            <div key={f.label} className={`mu-fact reveal delay-${i + 1}`}>
              <span className="mu-label"><span lang="km">{f.km}</span> · {f.label}</span>
              <p>{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
