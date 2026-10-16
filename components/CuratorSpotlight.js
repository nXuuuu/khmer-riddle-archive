"use client";

import { useEffect, useRef } from "react";
import collection from "../collection.config.js";
import CuratorHeritageArtifact from "./CuratorHeritageArtifact.js";

const QUOTE =
  "Khmer riddles (ពាក្យបណ្តៅ) are more than village wordplay — they are the poetic " +
  "philosophy of our ancestors. Passed down orally around evening hearths and temple grounds, " +
  "each riddle trains the eye to observe nature, agriculture, and human nature with wit and wonder.";

/**
 * Splits the quote into word-spans. Each span starts at opacity 0.15
 * and fades to 1 as it enters the viewport via IntersectionObserver.
 * This is the "character/word scroll opacity" effect from Jack's prompt,
 * implemented with zero external packages.
 */
function AnimatedQuote({ text }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("aq-body--visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <p className="vt-quote-body aq-body" ref={containerRef}>
      {words.map((word, i) => (
        <span key={i} className="aq-word" style={{ "--delay": `${i * 30}ms` }}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

export default function CuratorSpotlight() {
  return (
    <section className="vt-quote-section reveal" aria-label="Curator Philosophy Spotlight">
      <div className="vt-quote-card">
        <span className="vt-tag-label">GUARDIANS OF ORAL WISDOM · ទស្សនវិជ្ជាបុរាណ</span>
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
