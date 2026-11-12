import SearchBar from "./SearchBar.js";
import CategoryFilter from "./CategoryFilter.js";
import KmEn from "./KmEn.js";
import { toKhmerDigits } from "../utils/khmerDigits.js";

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
          <span lang="km">បង្ហាញ {toKhmerDigits(visibleCount)} ក្នុងចំណោម {toKhmerDigits(riddles.length)}</span>
          {" · "}Showing {visibleCount} of {riddles.length}
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
              {v === "gallery" ? <KmEn km="រូបភាព" en="Gallery" inline /> : <KmEn km="បញ្ជី" en="Index" inline />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
