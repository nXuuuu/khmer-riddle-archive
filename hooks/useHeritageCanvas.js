"use client";

import { useEffect } from "react";

const KHMER_GLYPHS = [
  "ក", "ខ", "គ", "ឃ", "ង", "ច", "ឆ", "ជ", "ឈ", "ញ",
  "ដ", "ឋ", "ឌ", "ឍ", "ណ", "ត", "ថ", "ទ", "ធ", "ន",
  "ឩ", "ឳ", "ឱ", "ឰ", "ឫ", "ឬ", "ឭ", "ឮ",
  "ពាក្យ", "បណ្តៅ", "ប្រាជ្ញា", "ដូនតា", "កេរ"
];

/**
 * useHeritageCanvas — Renders gentle floating Ancient Khmer Calligraphy Fragments (អក្សរបុរាណ)
 * confined strictly within the transition clearing gap.
 *
 * @param {import("react").RefObject} canvasRef
 */
export default function useHeritageCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId = null;
    let isVisible = false;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = Math.round(rect.width || window.innerWidth);
      height = canvas.height = Math.round(rect.height || 300);
    };
    resize();

    window.addEventListener("resize", resize, { passive: true });

    // 22 Ancient Khmer Glyphs organically dispersed across this gap
    const glyphCount = 22;
    const glyphs = Array.from({ length: glyphCount }, (_, i) => {
      const relX = 0.05 + ((i * 0.6180339887) % 1) * 0.9;
      const relY = 0.16 + (Math.random() * 0.68);

      return {
        id: i,
        char: KHMER_GLYPHS[i % KHMER_GLYPHS.length],
        relX,
        relY,
        currX: width * relX,
        currY: height * relY,
        size: 20 + Math.random() * 16,
        depth: 0.8 + Math.random() * 0.35,
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.005 + Math.random() * 0.005,
        rotation: (Math.random() - 0.5) * 0.18,
        rotSpeed: (Math.random() - 0.5) * 0.001,
      };
    });

    let time = 0;

    const render = () => {
      if (!isVisible) {
        animId = null;
        return;
      }

      time += 0.010;

      const isLight = document.documentElement.getAttribute("data-theme") === "light";

      // Clear the canvas within this gap
      ctx.clearRect(0, 0, width, height);

      // Render floating Khmer glyphs strictly inside the gap
      glyphs.forEach((g) => {
        g.floatPhase += g.floatSpeed;
        g.rotation += g.rotSpeed;

        const targetX = (g.relX * width) + Math.sin(time * 0.45 + g.floatPhase) * 18;
        const targetY = (g.relY * height) + Math.cos(time * 0.38 + g.floatPhase) * 14;

        g.currX += (targetX - g.currX) * 0.09;
        g.currY += (targetY - g.currY) * 0.09;

        ctx.save();
        ctx.translate(g.currX, g.currY);
        ctx.rotate(g.rotation);
        ctx.font = `${Math.round(g.size * g.depth)}px var(--font-heading), "Kantumruy Pro", "Noto Serif Khmer", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const breath = 0.4 + Math.sin(g.floatPhase) * 0.22;
        ctx.globalAlpha = Math.max(0.18, Math.min(0.72, breath));

        ctx.fillStyle = isLight
          ? (g.id % 3 === 0 ? "#8c6014" : "#143324")
          : (g.id % 3 === 0 ? "#dfb75c" : "#e8e4d8");

        ctx.fillText(g.char, 0, 0);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    // Pause animation when the transition gap is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          resize();
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}
