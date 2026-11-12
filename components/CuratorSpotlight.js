import collection from "../collection.config.js";
import CuratorHeritageArtifact from "./CuratorHeritageArtifact.js";
import AnimatedQuote from "./AnimatedQuote.js";

const QUOTE =
  "Khmer riddles (ពាក្យបណ្តៅ) are more than village wordplay — they are the poetic " +
  "philosophy of our ancestors. Passed down orally around evening hearths and temple grounds, " +
  "each riddle trains the eye to observe nature, agriculture, and human nature with wit and wonder.";

export default function CuratorSpotlight() {
  return (
    <section className="vt-quote-section reveal" aria-label="Curator Philosophy Spotlight">
      <div className="vt-quote-card">
        <span className="vt-tag-label"><span lang="km">ទស្សនវិជ្ជាបុរាណ</span> · Guardians of oral wisdom</span>
        <div className="vt-quote-mark" aria-hidden="true">"</div>

        <AnimatedQuote text={QUOTE} />

        <div>
          <h3 className="vt-quote-author">{collection.curator}</h3>
          <p className="vt-quote-title">
            Curator, Khmer Living Archive · {collection.source}
          </p>
        </div>
      </div>

      <div className="vt-quote-visual-wrap">
        <CuratorHeritageArtifact />
      </div>
    </section>
  );
}
