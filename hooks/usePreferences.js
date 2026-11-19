"use client";

import { useEffect, useState } from "react";

// Light/dark theme (saved in localStorage) and the daily-challenge solved count.
export default function usePreferences() {
  const [theme, setTheme] = useState("light");
  const [solved, setSolved] = useState(0);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const activeTheme = storedTheme || "light";
    setTheme(activeTheme);
    document.documentElement.setAttribute("data-theme", activeTheme);

    const storedSolved = localStorage.getItem("riddles-solved");
    if (storedSolved) setSolved(parseInt(storedSolved, 10));

    // The daily page fires "riddles-solved-updated" when the count changes.
    const handleSolvedChange = () => {
      const s = localStorage.getItem("riddles-solved");
      setSolved(s ? parseInt(s, 10) : 0);
    };
    window.addEventListener("riddles-solved-updated", handleSolvedChange);
    return () => window.removeEventListener("riddles-solved-updated", handleSolvedChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return { theme, toggleTheme, solved };
}
