"use client";

export default function ShowcaseCard({ item, index, isRevealed, onToggle }) {
  return (
    <article className="vt-carousel-card" style={{ "--card-index": index }}>
      {item.image_url && (
        <div className="gr-card-image-wrap">
          <img src={item.image_url} alt="Riddle visual clue" loading="lazy" />
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span className="gr-card-badge">{item.category}</span>
        <span className="gr-card-id">#{item.id.slice(0, 6)}</span>
      </div>
      <p className="gr-card-q-text" lang="km" style={{ fontSize: 17, marginBottom: 12, minHeight: 60 }}>
        « {item.question} »
      </p>
      {item.hint && (
        <p className="gr-card-hint" style={{ marginBottom: 16 }}>"{item.hint}"</p>
      )}
      <div style={{ marginTop: "auto" }}>
        <button
          type="button"
          onClick={() => onToggle(item.id)}
          className={`gr-card-reveal-btn ${isRevealed ? "active" : ""}`}
        >
          {isRevealed ? "Hide Answer" : "Reveal Answer"}
        </button>
        {isRevealed && (
          <div className="gr-card-ans-box" style={{ marginTop: 12 }}>
            <p className="gr-card-ans-en">{item.answer_en}</p>
            <p className="gr-card-ans-km" lang="km">{item.answer_kh}</p>
          </div>
        )}
      </div>
    </article>
  );
}
