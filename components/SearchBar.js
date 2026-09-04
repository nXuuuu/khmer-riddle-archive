"use client";

const S = {
  wrap: { position: "relative", width: "100%", marginBottom: 4 },
  icon: {
    position: "absolute", left: 16, top: "50%",
    transform: "translateY(-50%)", color: "var(--text-muted)",
    pointerEvents: "none", lineHeight: 0,
  },
  input: {
    width: "100%", boxSizing: "border-box",
    padding: "13px 44px", backgroundColor: "var(--bg-base)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
    color: "var(--text-primary)", fontSize: 15, lineHeight: 1.7,
    outline: "none", fontFamily: "inherit",
    transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
  },
  clearBtn: {
    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
    color: "var(--text-muted)", fontSize: 18, lineHeight: 1, padding: "2px 4px",
    borderRadius: 4, transition: "color var(--transition-fast)",
  },
};

export default function SearchBar({ query, onChange }) {
  return (
    <div style={S.wrap}>
      <span style={S.icon} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="search"
        value={query}
        onChange={e => onChange(e.target.value)}
        placeholder="Search riddles, answers, categories, or sources…"
        style={S.input}
        aria-label="Search the archive"
        onFocus={e => {
          e.target.style.borderColor = "var(--border-accent)";
          e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
        }}
        onBlur={e => {
          e.target.style.borderColor = "var(--border)";
          e.target.style.boxShadow = "none";
        }}
      />
      {query && (
        <button style={S.clearBtn} onClick={() => onChange("")} aria-label="Clear search"
          onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
          onMouseLeave={e => e.target.style.color = "var(--text-muted)"}>
          ×
        </button>
      )}
    </div>
  );
}
