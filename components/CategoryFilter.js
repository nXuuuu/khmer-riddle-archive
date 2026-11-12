import { CATEGORY_LABELS } from "../collection.config.js";

// Category tabs (Khmer name first, English below), each with its number of entries.
export default function CategoryFilter({ categories, selected, onSelect, riddles = [] }) {
  const countFor = (cat) =>
    cat === "All" ? riddles.length : riddles.filter((r) => r.category === cat).length;

  return (
    <nav className="gr-filter-scroll" aria-label="Filter by category">
      {categories.map((cat) => {
        const active = selected === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`mu-tab${active ? " active" : ""}`}
            aria-pressed={active}
          >
            <span className="mu-tab-text">
              <span lang="km">{CATEGORY_LABELS[cat]}</span>
              <span className="mu-tab-en">{cat}</span>
            </span>
            <sup>{countFor(cat)}</sup>
          </button>
        );
      })}
    </nav>
  );
}
