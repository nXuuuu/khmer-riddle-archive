"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import collection from "../collection.config.js";
import { INITIAL_RIDDLES } from "../data/riddles.js";

export default function HeroSection({ totalEntries, totalCategories }) {
  const [riddle, setRiddle] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [hint, setHint] = useState(false);

  const loadNewRiddle = () => {
    if (INITIAL_RIDDLES.length === 0) return;
    const randomRiddle = INITIAL_RIDDLES[Math.floor(Math.random() * INITIAL_RIDDLES.length)];
    const otherAnswers = INITIAL_RIDDLES
      .filter(r => r.id !== randomRiddle.id)
      .map(r => r.answerEn);
    const distractors = [...new Set(otherAnswers)].sort(() => 0.5 - Math.random()).slice(0, 3);
    const opts = [randomRiddle.answerEn, ...distractors].sort(() => 0.5 - Math.random());

    setRiddle(randomRiddle);
    setOptions(opts);
    setSelected(null);
    setHint(false);
  };

  useEffect(() => {
    loadNewRiddle();
  }, []);

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
  };

  return (
    <section className="gr-hero-sec" aria-label="Archive hero">
      <div className="float-q" style={{ top: "15%", left: "5%", animation: "float-qmark-1 12s infinite ease-in-out" }}>?</div>
      <div className="float-q" style={{ bottom: "10%", right: "8%", animation: "float-qmark-2 15s infinite ease-in-out" }}>?</div>

      <div className="gr-hero-inner">
        <div className="gr-hero-content">
          <div className="gr-hero-counter">
            <span className="gr-hero-dot" />
            {totalEntries} riddles & counting
          </div>
          <h1 className="gr-hero-title">
            KumPi <span>Khmer</span> riddle collection.
          </h1>
          <p className="gr-hero-sub">
            {collection.description}
            <span className="gr-hero-khmer-sub" lang="km">
              ថែរក្សាចំណោទប្រាជ្ញាខ្មែរ ដោយ {collection.curator}
            </span>
          </p>
          <div className="gr-hero-actions">
            <Link href="#archive" className="gr-btn-primary">Start Solving</Link>
            <Link href="/daily" className="gr-btn-secondary">Daily Challenge</Link>
          </div>
        </div>

        {riddle && (
          <div className="modern-card gr-quiz-card">
            <span className="gr-quiz-label">Try a Quiz Riddle</span>
            <div className="gr-quiz-question" lang="km">
              « {riddle.question} »
            </div>
            <div className="gr-quiz-options">
              {options.map((opt) => {
                const isSelected = selected === opt;
                const isCorrect = opt === riddle.answerEn;
                const className = `gr-quiz-opt ${selected
                  ? isCorrect
                    ? "correct"
                    : isSelected
                      ? "incorrect"
                      : ""
                  : ""
                  }`;
                return (
                  <button
                    key={opt}
                    disabled={!!selected}
                    onClick={() => handleSelect(opt)}
                    className={className}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <div className="gr-quiz-footer">
              <span
                className="gr-quiz-hint"
                onClick={() => setHint(true)}
              >
                {hint ? riddle.questionHint || "No hint available" : "Need a hint?"}
              </span>
              {selected && (
                <button className="gr-quiz-next" onClick={loadNewRiddle}>
                  Next riddle <span className="gr-arrow">→</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
