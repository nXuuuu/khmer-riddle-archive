import SearchBar from "./SearchBar.js";
import CategoryFilter from "./CategoryFilter.js";

// Search + category tabs + Gallery/Index switch + result count.
export default function CollectionToolbar({
  query, onQuery, categories, selected, onSelect, riddles, visibleCount, view, onView,
}) {
  return (
    <div className="mu-toolbar">
      <SearchBar query={query} onChange={onQuery} />
      <CategoryFilter categories={categories} selected={selected} onSelect={onSelect} riddles={riddles} />
      <div className="mu-toolbar-row">
        <span className="mu-count" aria-live="polite">
          Showing {visibleCount} of {riddles.length} objects
        </span>
        <div className="mu-view-toggle" role="group" aria-label="Choose a view">
          {["gallery", "index"].map((v) => (
            <button
              key={v}
              type="button"
              className={view === v ? "active" : ""}
              aria-pressed={view === v}
              onClick={() => onView(v)}
            >
              {v === "gallery" ? "Gallery" : "Index"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
