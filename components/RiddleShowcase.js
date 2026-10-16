"use client";

import { useRef, useState } from "react";
import useScrollParallax from "../hooks/useScrollParallax.js";
import ShowcaseCard from "./ShowcaseCard.js";

export default function RiddleShowcase({ riddles = [] }) {
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [revealedIds, setRevealedIds] = useState({});
  const headerRef = useScrollParallax(0.06);

  const featured = riddles.slice(0, 6);
  if (featured.length === 0) return null;

  const scroll = (direction) => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.firstElementChild?.offsetWidth || 340;
    trackRef.current.scrollBy({ left: direction * (cardWidth + 20), behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.firstElementChild?.offsetWidth || 340;
    const idx = Math.round(trackRef.current.scrollLeft / (cardWidth + 20)) + 1;
    setCurrentIndex(Math.min(Math.max(idx, 1), featured.length));
  };

  const toggleReveal = (id) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="vt-carousel-container reveal" aria-label="Featured Riddles Showcase">
      <div className="vt-carousel-header" ref={headerRef}>
        <div>
          <span className="vt-tag-label">IMMERSIVE SHOWCASE · សម្រាំងប្រស្នា</span>
          <h2 className="vt-display-title">Living Heritage Highlights</h2>
        </div>
        <div className="vt-carousel-controls">
          <button
            type="button"
            className="vt-circle-btn"
            onClick={() => scroll(-1)}
            disabled={currentIndex <= 1}
            aria-label="Previous riddle"
          >←</button>
          <span className="vt-carousel-counter">{currentIndex} / {featured.length}</span>
          <button
            type="button"
            className="vt-circle-btn"
            onClick={() => scroll(1)}
            disabled={currentIndex >= featured.length}
            aria-label="Next riddle"
          >→</button>
        </div>
      </div>

      <div className="vt-carousel-track" ref={trackRef} onScroll={handleScroll}>
        {featured.map((item, i) => (
          <ShowcaseCard
            key={item.id}
            item={item}
            index={i}
            isRevealed={!!revealedIds[item.id]}
            onToggle={toggleReveal}
          />
        ))}
      </div>
    </section>
  );
}
