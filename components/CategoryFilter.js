import { CATEGORY_LABELS } from "../collection.config.js";

const S = {
  wrap: { margin: "16px 0 20px" },
  pill: (active) => ({
    padding: "8px 18px", borderRadius: 99, fontSize: 13,
    minHeight: 38,
    fontFamily: "var(--mono)", cursor: "pointer",
    border: active ? "1px solid var(--border-accent)" : "1px solid var(--border)",
    backgroundColor: active ? "var(--bg-sand)" : "var(--bg-card)",
    color: active ? "var(--text-primary)" : "var(--text-secondary)",
    fontWeight: active ? 700 : 500,
    boxShadow: active ? "0 4px 14px var(--accent-glow)" : "0 2px 8px rgba(0,0,0,0.08)",
    transition: "all var(--transition-fast)",
    display: "inline-flex", alignItems: "center", gap: 6, lineHeight: 1.5,
    flexShrink: 0,
  }),
  dot: { width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0 },
  km: { fontSize: 10, color: "var(--text-secondary)", marginLeft: 2 },
};

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <nav className="gr-filter-scroll" style={S.wrap} aria-label="Filter by category">
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
