import { CATEGORY_LABELS } from "../data/riddles.js";

const S = {
  wrap: { display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0 20px" },
  pill: (active) => ({
    padding: "6px 16px", borderRadius: 20, fontSize: 13,
    fontFamily: "var(--mono)", cursor: "pointer",
    border: active ? "1px solid var(--border-accent)" : "1px solid var(--border)",
    backgroundColor: active ? "var(--accent-glow)" : "var(--bg-base)",
    color: active ? "var(--accent)" : "var(--text-secondary)",
    transition: "all var(--transition-fast)",
    display: "flex", alignItems: "center", gap: 6, lineHeight: 1.5,
  }),
  dot: { width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0 },
  km: { fontSize: 10, color: "var(--text-muted)", marginLeft: 2 },
};

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <nav style={S.wrap} aria-label="Filter by category">
      {categories.map(cat => {
        const active = selected === cat;
        return (
          <button key={cat} type="button" onClick={() => onSelect(cat)}
            style={S.pill(active)} aria-pressed={active}
            onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = "var(--border-hover)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "var(--border)"; }}>
            {active && <span style={S.dot} aria-hidden="true" />}
            {cat}
            {CATEGORY_LABELS[cat] && cat !== "All" && (
              <span style={S.km} lang="km">{CATEGORY_LABELS[cat]}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
