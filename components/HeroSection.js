import Link from "next/link";
import collection, { CATEGORY_LABELS } from "../collection.config.js";
import RiddleVisual from "./RiddleVisual.js";
import CountUp from "./CountUp.js";
import KmEn from "./KmEn.js";

// Exhibition-poster hero: Khmer title and tagline first, English below,
// one framed "featured object" from the collection on the right.
export default function HeroSection({ riddles = [], totalCategories, loaded }) {
  // Wait for the real data before choosing, so the featured object and the
  // counts don't visibly swap from the seed riddles to the Supabase ones.
  // Prefer an entry that has a real photo; otherwise the newest entry.
  const featured = loaded ? riddles.find((r) => r.image_url) || riddles[0] : null;

  return (
    <section className="mu-hero" aria-label="Introduction">
      <div className="mu-hero-text">
        <span className="mu-label">
          <span lang="km">{collection.nameKm}</span> · {collection.name}
        </span>
        <h1 className="mu-hero-khmer" lang="km">ពាក្យបណ្តៅ</h1>
        <p className="mu-hero-km-tag" lang="km">
          ពាក្យបណ្តៅរបស់ជនជាតិខ្មែរ ដែលបានប្រមូល និងថែរក្សាទុកសម្រាប់មនុស្សជំនាន់ក្រោយ។
        </p>
        <p className="mu-hero-title">
          Riddles of the Khmer people, <em>collected and kept</em> for the next generation.
        </p>

        <div className="mu-hero-actions">
          <Link href="#collection" className="mu-btn">
            <KmEn km="ចូលទស្សនា" en="Enter the collection" inline /> <span className="mu-arrow">→</span>
          </Link>
          <Link href="/daily" className="mu-btn mu-btn-ghost">
            <KmEn km="ពាក្យបណ្តៅប្រចាំថ្ងៃ" en="Daily riddle" inline />
          </Link>
        </div>

        <div className="mu-hero-meta">
          <div>
            <strong><CountUp value={loaded ? riddles.length : 0} /></strong>
            <KmEn km="ពាក្យបណ្តៅ" en="Riddles" />
          </div>
          <div>
            <strong><CountUp value={loaded ? totalCategories : 0} delay={850} /></strong>
            <KmEn km="វិចិត្រសាល" en="Galleries" />
          </div>
          <div>
            <strong lang="km" style={{ fontFamily: "var(--font-khmer-display)" }}>ខ្មែរ</strong>
            <KmEn km="ខ្មែរ និង អង់គ្លេស" en="Khmer & English" />
          </div>
        </div>
      </div>

      {/* The frame is always there (keeps the layout still); the object fades in once loaded. */}
      <figure className="mu-hero-object">
        <div className="mu-frame">
          {featured && <RiddleVisual item={featured} />}
        </div>
        <figcaption style={{ visibility: featured ? "visible" : "hidden" }}>
          <span className="mu-label"><span lang="km">វត្ថុពិសេស</span> · Featured</span>
          <span lang="km">{CATEGORY_LABELS[featured?.category]}</span>
          <span lang="km" className="mu-hero-object-q">« {featured?.question} »</span>
        </figcaption>
      </figure>
    </section>
  );
}
