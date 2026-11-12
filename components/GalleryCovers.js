import { CATEGORY_LABELS } from "../collection.config.js";
import RiddleVisual from "./RiddleVisual.js";

// The five categories shown as museum "galleries", each with a cover image.
// Clicking one filters the collection to that category.
export default function GalleryCovers({ categories, riddles, onOpen }) {
  const galleries = categories.filter((c) => c !== "All");

  return (
    <section className="mu-section" aria-label="Galleries">
      <div className="gr-container">
        <header className="gr-section-header reveal">
          <span className="gr-section-label">Galleries · វិចិត្រសាល</span>
          <h2 className="gr-section-title">Five rooms, <em>one oral tradition</em></h2>
        </header>

        <div className="mu-galleries">
          {galleries.map((cat, i) => {
            const count = riddles.filter((r) => r.category === cat).length;
            // Use a real photo from this category as the cover if one exists.
            const cover = riddles.find((r) => r.category === cat && r.image_url);
            return (
              <button
                key={cat}
                type="button"
                className={`mu-gallery reveal delay-${i + 1}`}
                onClick={() => onOpen(cat)}
              >
                <div className="mu-frame">
                  <RiddleVisual item={cover} category={cat} showTag={false} />
                </div>
                <span className="mu-gallery-name">{cat}</span>
                <span className="mu-gallery-km" lang="km">{CATEGORY_LABELS[cat]}</span>
                <span className="mu-gallery-count">
                  {count} {count === 1 ? "object" : "objects"} <span className="mu-arrow">→</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
