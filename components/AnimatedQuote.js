"use client";

import { useEffect, useRef } from "react";

/**
 * Splits the quote into word-spans. Each span starts at opacity 0.15
 * and fades to 1 as it enters the viewport via IntersectionObserver.
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
