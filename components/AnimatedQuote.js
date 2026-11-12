"use client";

import { useEffect, useRef } from "react";

/**
 * Splits the quote into word-spans. Each span starts at opacity 0.15
 * and fades to 1 each time it enters the viewport (IntersectionObserver).
 * This is the "character/word scroll opacity" effect from Jack's prompt,
 * implemented with zero external packages.
 */
export default function AnimatedQuote({ text }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Fade the words in when a quarter of the quote is visible; reset only
        // once it has fully left the screen, so it replays on every pass.
        if (entry.intersectionRatio >= 0.25) el.classList.add("aq-body--visible");
        else if (!entry.isIntersecting) el.classList.remove("aq-body--visible");
      },
      { threshold: [0, 0.25] }
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
