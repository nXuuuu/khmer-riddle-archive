import Link from "next/link";
import collection from "../collection.config.js";
import RiddleVisual from "./RiddleVisual.js";
import CountUp from "./CountUp.js";

// Exhibition-poster hero: giant Khmer title on the left,
// one framed "featured object" from the collection on the right.
export default function HeroSection({ riddles = [], totalCategories, loaded }) {
  // Wait for the real data before choosing, so the featured object and the
  // counts don't visibly swap from the seed riddles to the Supabase ones.
  // Prefer an entry that has a real photo; otherwise the newest entry.
  const featured = loaded ? riddles.find((r) => r.image_url) || riddles[0] : null;

  return (
    <section className="mu-hero" aria-label="Introduction">
      <div className="mu-hero-text">
        <span className="mu-label">A living collection · {collection.name}</span>
        <h1 className="mu-hero-khmer" lang="km">ពាក្យបណ្តៅ</h1>
        <p className="mu-hero-title">
          Riddles of the Khmer people, <em>collected and kept</em> for the next generation.
        </p>

        <div className="mu-hero-meta">
          <div>
            <strong><CountUp value={loaded ? riddles.length : 0} /></strong>
            <span className="mu-label">Objects</span>
          </div>
          <div>
            <strong><CountUp value={loaded ? totalCategories : 0} delay={850} /></strong>
            <span className="mu-label">Galleries</span>
          </div>
          <div>
            <strong lang="km" style={{ fontFamily: "var(--font-khmer-display)", fontSize: 24 }}>ខ្មែរ</strong>
            <span className="mu-label">Khmer &amp; English</span>
          </div>
        </div>

        <div className="mu-hero-actions">
          <Link href="#collection" className="mu-btn">
            Enter the collection <span className="mu-arrow">→</span>
          </Link>
          <Link href="/daily" className="mu-btn mu-btn-ghost">Daily riddle</Link>
        </div>
      </div>

      {/* The frame is always there (keeps the layout still); the object fades in once loaded. */}
      <figure className="mu-hero-object">
        <div className="mu-frame">
          {featured && <RiddleVisual item={featured} />}
        </div>
        <figcaption style={{ visibility: featured ? "visible" : "hidden" }}>
          <span className="mu-label">Featured object</span>
          <span>{featured?.category}</span>
          <span lang="km">« {featured?.question} »</span>
        </figcaption>
      </figure>
    </section>
  );
}
