"use client";

import { useState } from "react";

export default function HeroQuizCard({ riddle, options = [], onNext }) {
  const [selected, setSelected] = useState(null);
  const [hint, setHint] = useState(false);

  if (!riddle) return null;

  const handleSelect = (id) => {
    if (!selected) setSelected(id);
  };

  const handleNext = () => {
    setSelected(null);
    setHint(false);
    onNext();
  };

  return (
    <div className="modern-card gr-quiz-card">
      <span className="gr-quiz-label">FEATURED RIDDLE · ចំណោទប្រាជ្ញា</span>
      <div className="gr-quiz-question" lang="km">
        « {riddle.question} »
      </div>
      <div className="gr-quiz-options">
        {options.map((opt, idx) => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.id === riddle.id;
          const cls = `gr-quiz-opt${
            selected ? (isCorrect ? " correct" : isSelected ? " incorrect" : "") : ""
          }`;
          const letter = ["A", "B", "C", "D"][idx] || `${idx + 1}`;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={!!selected}
              onClick={() => handleSelect(opt.id)}
              className={cls}
            >
              <span className="gr-quiz-opt-letter">{letter}</span>
              <span lang="km">{opt.answer_kh}</span>
              <span style={{ fontSize: "0.85em", opacity: 0.85, marginLeft: 6 }}>
                ({opt.answer_en})
              </span>
            </button>
          );
        })}
      </div>
      <div className="gr-quiz-footer">
        <span className="gr-quiz-hint" onClick={() => setHint(true)}>
          {hint ? `💡 ${riddle.hint || "No hint available"}` : "💡 Need a hint? · ត្រូវការតម្រុយ?"}
        </span>
        {selected && (
          <button type="button" className="gr-quiz-next" onClick={handleNext}>
            Next riddle · បន្ទាប់ <span className="gr-arrow">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
