import collection from "../collection.config.js";

// Short essay-style introduction, like the wall text at a museum entrance.
export default function IntroEssay() {
  return (
    <section className="mu-section" aria-label="About the collection">
      <div className="gr-container mu-essay">
        <span className="mu-label reveal">Introduction · សេចក្តីផ្តើម</span>
        <div className="mu-essay-body reveal delay-1">
          <p>
            For generations, Khmer riddles were told in the evening: around the fire, under the stilt
            house, on temple grounds. A good riddle teaches you to look closely at the world.
          </p>
          <p>{collection.description}</p>
          <p className="mu-essay-sign">
            Curated by <strong>{collection.curator}</strong>. Sources: {collection.source}.
          </p>
        </div>
      </div>
    </section>
  );
}
