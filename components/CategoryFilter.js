import { CATEGORY_LABELS } from "../collection.config.js";

// Category tabs: Khmer name first, English below.
export default function CategoryFilter({ categories, selected, onSelect }) {
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
          </button>
        );
      })}
    </nav>
  );
}
