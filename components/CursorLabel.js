"use client";

import { useEffect, useRef, useState } from "react";

// A round "Reveal" / "Close" label that follows the mouse over collection images.
// Desktop only (hidden on touch screens in globals.css).
export default function CursorLabel() {
  const ref = useRef(null);
  const [label, setLabel] = useState(null);

  useEffect(() => {
    const onMove = (e) => {
      // Move with the "translate" property so the CSS scale animation stays separate.
      if (ref.current) ref.current.style.translate = `${e.clientX}px ${e.clientY}px`;

      const frame = e.target.closest?.(".mu-object .mu-frame");
      if (!frame) return setLabel(null);
      const isOpen = frame.closest(".mu-object").classList.contains("open");
      setLabel(isOpen ? { km: "បិទ", en: "Close" } : { km: "មើលចម្លើយ", en: "Reveal" });
    };
    // After a click the card opens/closes, so re-check the label once React has updated it.
    const onClick = (e) => setTimeout(() => onMove(e), 60);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div ref={ref} className={`mu-cursor${label ? " on" : ""}`} aria-hidden="true">
      {label && (
        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.3 }}>
          <span lang="km">{label.km}</span>
          <span style={{ fontSize: "10px", opacity: 0.8 }}>{label.en}</span>
        </span>
      )}
    </div>
  );
}
