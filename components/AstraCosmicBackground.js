"use client";

import { useRef } from "react";
import useHeritageCanvas from "../hooks/useHeritageCanvas.js";

/**
 * AstraCosmicBackground — Full-screen responsive canvas rendering floating Ancient Khmer Glyphs.
 * When content is present, glyphs drift gracefully in the surrounding corners and outer gutters.
 * When a blank transition gap appears, glyphs smoothly converge and merge into the center gap.
 */
export default function AstraCosmicBackground() {
  const canvasRef = useRef(null);
  useHeritageCanvas(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="vt-astra-cosmic-bg"
      aria-hidden="true"
    />
  );
}
