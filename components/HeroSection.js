"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import collection from "../collection.config.js";
import useTypewriter from "../hooks/useTypewriter.js";
import HeroQuizCard from "./HeroQuizCard.js";

export default function HeroSection({ totalEntries, totalCategories, riddles = [] }) {
  const [riddle, setRiddle] = useState(() => (riddles.length > 0 ? riddles[0] : null));
  const [options, setOptions] = useState(() => {
    if (!riddles || riddles.length === 0) return [];
    const r = riddles[0];
    const distractors = riddles.slice(1, 4);
    return [r, ...distractors].sort(() => 0.5 - Math.random());
  });

  const typeText = riddle ? `ចំណោទ: « ${riddle.question} »` : "Loading a riddle from the archive…";
  const { displayed, done } = useTypewriter(typeText, 38, 400);

  const loadNewRiddle = useCallback(() => {
    if (!riddles || riddles.length === 0) return;
    const r = riddles[Math.floor(Math.random() * riddles.length)];
    const distractors = riddles.filter((x) => x.id !== r.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    setRiddle(r);
    setOptions([r, ...distractors].sort(() => 0.5 - Math.random()));
  }, [riddles]);

  useEffect(() => {
    if (!riddle && riddles.length > 0) loadNewRiddle();
  }, [riddles, riddle, loadNewRiddle]);

  return (
    <section className="gr-hero-sec" aria-label="Archive hero">
      <div className="gr-hero-inner">
        <div className="gr-hero-content">
          <div className="gr-hero-counter">
            <span className="gr-hero-dot" />
            LIVING FOLKLORE ARCHIVE · {totalEntries} PRESERVED
          </div>

          <h1 className="gr-hero-title">
            The oral wisdom of <span>Cambodia</span> is a living treasure.
          </h1>

          <p className="gr-hero-typewriter" lang="km" aria-live="polite">
            {displayed}
            {!done && <span className="gr-cursor" aria-hidden="true" />}
          </p>

          <p className="gr-hero-sub">
            {collection.description}
            <span className="gr-hero-khmer-sub" lang="km">
              ថែរក្សាចំណោទប្រាជ្ញាខ្មែរ ដោយ {collection.curator}
            </span>
          </p>

          <div className="gr-hero-pills">
            <Link href="#archive" className="gr-pill gr-pill-primary">
              Explore Archive
            </Link>
            <Link href="/daily" className="gr-pill gr-pill-secondary">
              Daily Challenge →
            </Link>
          </div>
        </div>

        <HeroQuizCard
          riddle={riddle}
          options={options}
          onNext={loadNewRiddle}
        />
      </div>
    </section>
  );
}
