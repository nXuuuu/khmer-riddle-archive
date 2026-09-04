"use client";

import { useState } from "react";

export default function RiddleCard({ item }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <article className="modern-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <span className="gr-card-badge">{item.category}</span>
        <span className="gr-card-id">#{item.id}</span>
      </div>

      {item.questionHint && (
        <p className="gr-card-hint">"{item.questionHint}"</p>
      )}

      <div className="gr-card-question">
        <p className="gr-card-q-text" lang="km">« {item.question} »</p>
      </div>

      <div className="gr-card-source">
        <span>{item.sourceEn}</span>
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
          <p className="gr-card-ans-en">{item.answerEn}</p>
          <p className="gr-card-ans-km" lang="km">{item.answer}</p>
          {item.explanation && <p className="gr-card-explanation">{item.explanation}</p>}
          {item.contributor && <p className="gr-card-contributor">Added by {item.contributor}</p>}
        </div>
      )}
    </article>
  );
}
