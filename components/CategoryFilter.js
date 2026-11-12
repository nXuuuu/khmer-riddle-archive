// Category tabs, each with its number of entries.
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
            {cat}
            <sup>{countFor(cat)}</sup>
          </button>
        );
      })}
    </nav>
  );
}
