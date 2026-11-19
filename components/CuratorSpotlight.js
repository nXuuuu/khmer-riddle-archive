import collection from "../collection.config.js";
import PalmLeafManuscript from "./PalmLeafManuscript.js";
import AnimatedQuote from "./AnimatedQuote.js";

// Khmer wording below was written by Claude and is flagged for a
// native-speaker check (see README section 5).
const QUOTE_KM =
  "ពាក្យបណ្តៅខ្មែរមិនមែនគ្រាន់តែជាល្បែងពាក្យនៅតាមភូមិនោះទេ — ពួកវាគឺជាទស្សនវិជ្ជាកំណាព្យរបស់ដូនតាយើង។ " +
  "បានបន្តតៗគ្នាដោយផ្ទាល់មាត់ជុំវិញភ្លើងពេលល្ងាច និងនៅទីធ្លាវត្ត ពាក្យបណ្តៅនីមួយៗបង្រៀនភ្នែកឲ្យសង្កេតមើលធម្មជាតិ " +
  "កសិកម្ម និងលក្ខណៈមនុស្ស ដោយប្រាជ្ញា និងការភ្ញាក់ផ្អើល។";

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

        <p className="vt-quote-body" lang="km" style={{ marginBottom: "12px" }}>{QUOTE_KM}</p>
        <AnimatedQuote text={QUOTE} />

        <div>
          <h3 className="vt-quote-author">{collection.curator}</h3>
          <p className="vt-quote-title">
            <span lang="km">អ្នកថែរក្សា បណ្ណសាររស់ខ្មែរ</span> · Curator, Khmer Living Archive · {collection.source}
          </p>
        </div>
      </div>

      <PalmLeafManuscript />
    </section>
  );
}
