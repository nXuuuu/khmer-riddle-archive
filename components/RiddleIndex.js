"use client";

import { useState, useRef, useEffect } from "react";
import IndexRow from "./IndexRow.js";
import RiddleVisual from "./RiddleVisual.js";

// Typographic list of every riddle. On desktop, hovering a row shows
// that riddle's image floating next to the cursor.
export default function RiddleIndex({ riddles, numberOf, currentUser }) {
  const [hovered, setHovered] = useState(null);
  const previewRef = useRef(null);

  // Move the preview with the mouse. Writing the style directly
  // (instead of using state) avoids re-rendering on every mouse move.
  useEffect(() => {
    const onMove = (e) => {
      if (previewRef.current) {
        previewRef.current.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 140}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <ol className="mu-index">
        {riddles.map((item, i) => (
          <IndexRow
            key={item.id}
            item={item}
            number={numberOf(item)}
            currentUser={currentUser}
            onHover={setHovered}
            position={i}
          />
        ))}
      </ol>

      <div className="mu-preview" ref={previewRef} style={{ opacity: hovered ? 1 : 0 }} aria-hidden="true">
        {hovered && <RiddleVisual item={hovered} showTag={false} />}
      </div>
    </>
  );
}
