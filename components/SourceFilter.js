"use client";

export default function SourceFilter({ sources, selected, onSelect }) {
  return (
    <div className="gr-source-container">
      <span className="gr-source-label">Filter by Preservation Source (Elders & Texts)</span>
      <div className="gr-source-row">
        <button
          type="button"
          onClick={() => onSelect("All")}
          className={`gr-source-pill ${selected === "All" ? "active" : ""}`}
        >
          All Sources
        </button>
        {sources.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => onSelect(src)}
            className={`gr-source-pill ${selected === src ? "active" : ""}`}
          >
            {src}
          </button>
        ))}
      </div>
    </div>
  );
}
