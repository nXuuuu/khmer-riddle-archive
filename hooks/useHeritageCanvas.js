"use client";

import { useEffect } from "react";

const KHMER_GLYPHS = [
  "ក", "ខ", "គ", "ឃ", "ង", "ច", "ឆ", "ជ", "ឈ", "ញ",
  "ដ", "ឋ", "ឌ", "ឍ", "ណ", "ត", "ថ", "ទ", "ធ", "ន",
  "ឩ", "ឳ", "ឱ", "ឰ", "ឫ", "ឬ", "ឭ", "ឮ",
  "ពាក្យ", "បណ្តៅ", "ប្រាជ្ញា", "ដូនតា", "កេរ"
];

/**
 * useHeritageCanvas — Floating Ancient Khmer Calligraphy Fragments (អក្សរបុរាណ).
 *
 * Visual choreography:
 * - When content occupies the screen: glyphs drift gracefully in the surrounding
 *   corners and outer side gutters (framing the page, never drifting under text or cards).
 * - When a blank transition gap appears in the center: glyphs smoothly converge and
 *   merge into the middle blank clearing.
 * - When scrolling away: glyphs smoothly part and return to drifting in the corners.
 *
 * @param {import("react").RefObject} canvasRef
 */
export default function useHeritageCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId = null;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

    // 40 Ancient Khmer Glyphs
    const glyphCount = 40;
    const glyphs = Array.from({ length: glyphCount }, (_, i) => {
      const zone = i % 4;
      let relCornerX;
      let relCornerY;

      if (zone === 0) {
        // Left Gutter (strictly in the outer margin outside content)
        relCornerX = 0.02 + Math.random() * 0.06;
        relCornerY = 0.12 + (i / glyphCount) * 0.76;
      } else if (zone === 1) {
        // Right Gutter (strictly in the outer margin outside content)
        relCornerX = 0.92 + Math.random() * 0.06;
        relCornerY = 0.12 + (i / glyphCount) * 0.76;
      } else if (zone === 2) {
        // Top Corners
        relCornerX = (i % 2 === 0 ? 0.03 : 0.89) + Math.random() * 0.07;
        relCornerY = 0.04 + Math.random() * 0.09;
      } else {
        // Bottom Corners
        relCornerX = (i % 2 === 0 ? 0.03 : 0.89) + Math.random() * 0.07;
        relCornerY = 0.86 + Math.random() * 0.09;
      }

      // Merged Gap relative coordinates (golden ratio dispersion across the clearing)
      const gapRelX = 0.12 + ((i * 0.6180339887) % 1) * 0.76;
      const gapRelY = 0.18 + ((i / glyphCount) * 0.64);

      return {
        id: i,
        char: KHMER_GLYPHS[i % KHMER_GLYPHS.length],
        relCornerX,
        relCornerY,
        gapRelX,
        gapRelY,
        currX: width * relCornerX,
        currY: height * relCornerY,
        size: 20 + Math.random() * 16,
        depth: 0.8 + Math.random() * 0.35,
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.005 + Math.random() * 0.005,
        rotation: (Math.random() - 0.5) * 0.18,
        rotSpeed: (Math.random() - 0.5) * 0.001,
      };
    });

    let time = 0;
    let mergeFactor = 0; // 0 = drifting in corners, 1 = merged into middle blank gap

    const render = () => {
      time += 0.010;

      // Detect any active blank transition gap in the viewport
      const zones = document.querySelectorAll(".vt-cosmic-transition-zone");
      let activeZone = null;
      let maxVisibleHeight = 0;

      for (const z of zones) {
        const rect = z.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(height, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > 50 && visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          activeZone = rect;
        }
      }

      // Target merge factor based on visibility of the blank gap in the center
      const targetMerge = activeZone
        ? Math.min(1.0, maxVisibleHeight / Math.min(activeZone.height, height * 0.55))
        : 0.0;

      // Smooth interpolation between corner drift and center merge
      mergeFactor += (targetMerge - mergeFactor) * 0.08;

      const isLight = document.documentElement.getAttribute("data-theme") === "light";

      // Clear canvas cleanly
      ctx.clearRect(0, 0, width, height);

      const effectiveGapTop = activeZone ? activeZone.top : height / 2 - 150;
      const effectiveGapH = activeZone ? activeZone.height : 300;

      // Render Ancient Khmer Calligraphy Fragments
      glyphs.forEach((g) => {
        g.floatPhase += g.floatSpeed;
        g.rotation += g.rotSpeed;

        // Position A: Surrounding Corner & Gutter drift (when no blank gap)
        const cx = (g.relCornerX * width) + Math.sin(time * 0.45 + g.floatPhase) * 14;
        const cy = (g.relCornerY * height) + Math.cos(time * 0.38 + g.floatPhase) * 12;

        // Position B: Merged inside the Middle Blank Gap (anchored to gap bounds)
        const mx = (g.gapRelX * width) + Math.sin(time * 0.45 + g.floatPhase) * 18;
        const my = effectiveGapTop + (g.gapRelY * effectiveGapH) + Math.cos(time * 0.38 + g.floatPhase) * 14;

        // Smooth blend between surrounding corners and merged center
        const targetX = cx * (1 - mergeFactor) + mx * mergeFactor;
        const targetY = cy * (1 - mergeFactor) + my * mergeFactor;

        // Spring gliding interpolation
        g.currX += (targetX - g.currX) * 0.09;
        g.currY += (targetY - g.currY) * 0.09;

        ctx.save();
        ctx.translate(g.currX, g.currY);
        ctx.rotate(g.rotation);
        ctx.font = `${Math.round(g.size * g.depth)}px var(--font-heading), "Kantumruy Pro", "Noto Serif Khmer", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Dynamic luminance: subtle watermark in corners, prominent bloom in blank gap
        const breath = 0.38 + Math.sin(g.floatPhase) * 0.2;
        const alpha = breath * (0.65 + mergeFactor * 0.35);
        ctx.globalAlpha = Math.max(0.18, Math.min(0.78, alpha));

        ctx.fillStyle = isLight
          ? (g.id % 3 === 0 ? "#8c6014" : "#143324")
          : (g.id % 3 === 0 ? "#dfb75c" : "#e8e4d8");

        ctx.fillText(g.char, 0, 0);
        ctx.restore();
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasRef]);
}
