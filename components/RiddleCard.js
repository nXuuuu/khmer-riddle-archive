"use client";

import { useState } from "react";
import RiddleVisual from "./RiddleVisual.js";
import RiddleOwnerActions from "./RiddleOwnerActions.js";

// One object in the Gallery view: image first, Khmer riddle as the caption.
// Clicking the image (or "Reveal") slides the answer up over it.
export default function RiddleCard({ item, number, currentUser }) {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const isOwner = currentUser && currentUser.id === item.owner;
  const toggle = () => setOpen((o) => !o);
  // Let keyboard users open the image "button" with Enter or Space.
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  if (deleted) return null;

  return (
    <article className={`mu-object${open ? " open" : ""}`}>
      <div
        className="mu-frame"
        onClick={toggle}
        onKeyDown={onKey}
        role="button"
        tabIndex={0}
        aria-label={open ? "Hide answer" : "Reveal answer"}
      >
        <RiddleVisual item={item} />
        <div className="mu-answer" aria-hidden={!open}>
          <span className="mu-label">Answer · ចម្លើយ</span>
          <p className="mu-answer-en">{item.answer_en}</p>
          <p className="mu-answer-km" lang="km">{item.answer_kh}</p>
          {item.explanation && <p className="mu-answer-text">{item.explanation}</p>}
          <p className="mu-answer-source">{item.source}</p>
        </div>
      </div>

      <div className="mu-caption">
        <div className="mu-caption-top">
          <span className="mu-label">No. {String(number).padStart(2, "0")}</span>
          <span className="mu-label">{item.category}</span>
        </div>
        <p className="mu-caption-q" lang="km">« {item.question} »</p>
        {item.hint && <p className="mu-caption-hint">{item.hint}</p>}
        <button type="button" className="mu-reveal-link" onClick={toggle}>
          {open ? "Hide the answer" : "Reveal the answer"}
        </button>
        {isOwner && <RiddleOwnerActions item={item} onDeleted={() => setDeleted(true)} />}
      </div>
    </article>
  );
}
