import collection from "../collection.config.js";
import RiddleVisual from "./RiddleVisual.js";

// Essay-style introduction, like the wall text at a museum entrance.
// Khmer text leads; the English translation follows in smaller type.
export default function IntroEssay() {
  return (
    <section className="mu-section" aria-label="About the collection">
      <div className="gr-container mu-essay">
        <div className="mu-essay-side reveal">
          <span className="mu-label"><span lang="km">សេចក្តីផ្តើម</span> · Introduction</span>
          <figure className="mu-essay-figure">
            <div className="mu-frame">
              <RiddleVisual category="Wisdom & Folklore" />
            </div>
            <figcaption lang="km">ប្រាសាទ និងផ្កាឈូក នៅពេលរាត្រី</figcaption>
          </figure>
        </div>

        <div className="mu-essay-body reveal delay-1">
          <p className="mu-essay-km" lang="km">
            អស់ជាច្រើនជំនាន់មកហើយ ពាក្យបណ្តៅខ្មែរត្រូវបានគេនិយាយនៅពេលល្ងាច ជុំវិញភ្លើង
            ក្រោមផ្ទះឈើ និងនៅទីធ្លាវត្ត។ ពាក្យបណ្តៅល្អ បង្រៀនយើងឲ្យសង្កេតមើលពិភពលោកដោយយកចិត្តទុកដាក់។
          </p>
          <p className="mu-essay-en">
            For generations, Khmer riddles were told in the evening: around the fire, under the stilt
            house, on temple grounds. A good riddle teaches you to look closely at the world.
          </p>
          <p className="mu-essay-en">{collection.description}</p>
          <p className="mu-essay-sign">
            <span lang="km">រៀបចំដោយ</span> · Curated by <strong>{collection.curator}</strong>.
            Sources: {collection.source}.
          </p>
        </div>
      </div>
    </section>
  );
}
