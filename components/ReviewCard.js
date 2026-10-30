"use client";

export default function ReviewCard({ entry, onReview, disabled }) {
  const displayId = entry.id ? entry.id.slice(0, 8) : "";
  const dateStr = entry.created_at
    ? new Date(entry.created_at).toLocaleDateString()
    : "";

  return (
    <article className="modern-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <span className="gr-card-badge">{entry.category}</span>
        <span className="gr-card-id" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          #{displayId} · {dateStr}
        </span>
      </div>

      {entry.image_url && (
        <div className="gr-card-image-wrap" style={{ marginBottom: "16px", maxHeight: "220px", overflow: "hidden", borderRadius: "var(--radius-sm)" }}>
          <img src={entry.image_url} alt="Submitted visual clue" style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
        </div>
      )}

      <div style={{ marginBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px" }}>
          Question (Khmer)
        </span>
        <p lang="km" style={{ fontSize: "18px", fontWeight: 700, marginTop: "4px", lineHeight: 1.6 }}>
          « {entry.question} »
        </p>
      </div>

      {entry.hint && (
        <p style={{ fontStyle: "italic", color: "var(--text-secondary)", marginBottom: "12px", fontSize: "14px" }}>
          "{entry.hint}"
        </p>
      )}

      <div style={{ background: "var(--bg-base)", padding: "12px 16px", borderRadius: "var(--radius-sm)", marginBottom: "12px", fontSize: "13px" }}>
        <div style={{ marginBottom: "6px" }}>
          <strong style={{ color: "var(--text-secondary)" }}>Answers: </strong>
          <span lang="km" style={{ fontWeight: 600 }}>{entry.answer_kh}</span>
          <span style={{ color: "var(--text-muted)" }}> ({entry.answer_en})</span>
        </div>
        {entry.explanation && (
          <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>
            <strong>Explanation: </strong>{entry.explanation}
          </div>
        )}
      </div>

      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "18px" }}>
        <strong>Source: </strong>{entry.source}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={() => onReview(entry.id, "published")}
          disabled={disabled}
          className="gr-btn-primary"
          style={{ flex: 1, padding: "10px 16px", fontSize: "13px", fontWeight: 700, background: "#10b981", borderColor: "#10b981" }}
        >
          Publish · ផ្សព្វផ្សាយ
        </button>
        <button
          type="button"
          onClick={() => onReview(entry.id, "returned")}
          disabled={disabled}
          className="gr-btn-secondary"
          style={{ flex: 1, padding: "10px 16px", fontSize: "13px", fontWeight: 700, color: "#ef4444", borderColor: "#ef4444" }}
        >
          Return · ត្រឡប់
        </button>
      </div>
    </article>
  );
}
