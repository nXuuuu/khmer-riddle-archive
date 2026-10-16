"use client";

import { useRef } from "react";
import useHeritageCanvas from "../hooks/useHeritageCanvas.js";

/**
 * CosmicTransitionZone — A serene breathing clearing between content sections
 * featuring gentle floating Ancient Khmer Calligraphy Fragments (អក្សរបុរាណ).
 * Confined strictly within the transition gap so glyphs never drift under other elements.
 */
export default function CosmicTransitionZone() {
  const canvasRef = useRef(null);
  useHeritageCanvas(canvasRef);

  return (
    <div className="vt-cosmic-transition-zone" aria-hidden="true">
      <canvas ref={canvasRef} className="vt-transition-canvas" />
    </div>
  );
}
