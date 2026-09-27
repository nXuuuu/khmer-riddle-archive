"use client";

import { useState } from "react";

export default function RiddleCard({ item }) {
  const [revealed, setRevealed] = useState(false);

  // Use a short version of the UUID for display, or the original ID if it's the static one
  const displayId = item.id.length > 15 ? item.id.slice(0, 8) : item.id;

  return (
    <article className="modern-card" style={{ padding: "clamp(18px, 3vw, 24px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <span className="gr-card-badge">{item.category}</span>
        <span className="gr-card-id">#{displayId}</span>
      </div>

      {item.hint && (
        <p className="gr-card-hint">"{item.hint}"</p>
      )}

      <div className="gr-card-question">
        <p className="gr-card-q-text" lang="km">« {item.question} »</p>
      </div>

      <div className="gr-card-source">
        <span>{item.source}</span>
      </div>

      <button
        type="button"
        onClick={() => setRevealed(r => !r)}
        className={`gr-card-reveal-btn ${revealed ? "active" : ""}`}
      >
        {revealed ? "Hide Answer" : "Reveal Answer"}
      </button>

      {revealed && (
        <div className="gr-card-ans-box">
          <span className="gr-card-ans-title">ANSWER</span>
          <p className="gr-card-ans-en">{item.answer_en}</p>
          <p className="gr-card-ans-km" lang="km">{item.answer_kh}</p>
          {item.explanation && <p className="gr-card-explanation">{item.explanation}</p>}
        </div>
      )}
    </article>
  );
}
