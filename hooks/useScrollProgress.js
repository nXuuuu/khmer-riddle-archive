"use client";

import { useEffect, useState } from "react";

// How far down the page the user has scrolled (0–100), and whether they have
// scrolled past the top. Drives the nav's progress line and bottom border.
export default function useScrollProgress() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const top = el.scrollTop || document.body.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      setProgress(height > 0 ? (top / height) * 100 : 0);
      setScrolled(top > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { scrolled, progress };
}
