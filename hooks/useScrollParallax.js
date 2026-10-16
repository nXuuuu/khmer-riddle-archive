"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollParallax — subtle scroll-driven parallax using requestAnimationFrame
 * and native scroll event. Debounced and zero-dependency.
 *
 * @param {number} speed - Translation multiplier relative to scroll
 * @returns {import("react").RefObject}
 */
export default function useScrollParallax(speed = 0.08) {
  const ref = useRef(null);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.closest("section")?.getBoundingClientRect();
        if (!rect) return;
        const offset = -rect.top * speed;
        ref.current.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}
