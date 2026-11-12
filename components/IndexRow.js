"use client";

import { useState } from "react";
import RiddleVisual from "./RiddleVisual.js";
import RiddleOwnerActions from "./RiddleOwnerActions.js";

// One line of the Index view. Click to expand the answer underneath.
export default function IndexRow({ item, number, currentUser, onHover, position = 0 }) {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const isOwner = currentUser && currentUser.id === item.owner;
  if (deleted) return null;

  return (
    <li
      className={`mu-row${open ? " open" : ""}`}
      style={{ "--i": Math.min(position, 12) }} // stagger delay for the first rows
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
    >
      <button type="button" className="mu-row-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="mu-row-thumb" aria-hidden="true">
          <RiddleVisual item={item} showTag={false} />
        </span>
        <span className="mu-row-no">{String(number).padStart(2, "0")}</span>
        <span className="mu-row-q" lang="km">{item.question}</span>
        <span className="mu-row-cat">{item.category}</span>
        <span className="mu-row-plus" aria-hidden="true">+</span>
      </button>

      {open && (
        <div className="mu-row-detail">
          <div>
            <p className="mu-answer-en">{item.answer_en}</p>
            <p className="mu-answer-km" lang="km">{item.answer_kh}</p>
            {item.explanation && <p className="mu-answer-text">{item.explanation}</p>}
            <p className="mu-answer-source">{item.source}</p>
            {isOwner && <RiddleOwnerActions item={item} onDeleted={() => setDeleted(true)} />}
          </div>
        </div>
      )}
    </li>
  );
}
