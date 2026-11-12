"use client";

import { useEffect, useState } from "react";

// Light/dark theme (saved in localStorage) and the daily-challenge streak.
export default function usePreferences() {
  const [theme, setTheme] = useState("light");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const activeTheme = storedTheme || "light";
    setTheme(activeTheme);
    document.documentElement.setAttribute("data-theme", activeTheme);

    const storedStreak = localStorage.getItem("riddle-streak");
    if (storedStreak) setStreak(parseInt(storedStreak, 10));

    // The daily page fires "streak-updated" when the streak changes.
    const handleStreakChange = () => {
      const s = localStorage.getItem("riddle-streak");
      setStreak(s ? parseInt(s, 10) : 0);
    };
    window.addEventListener("streak-updated", handleStreakChange);
    return () => window.removeEventListener("streak-updated", handleStreakChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return { theme, toggleTheme, streak };
}
