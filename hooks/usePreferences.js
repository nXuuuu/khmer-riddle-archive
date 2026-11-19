"use client";

import { useEffect, useState } from "react";

// Light/dark theme, the daily-challenge solved count, and the nav bar's
// Khmer/English toggle (all saved in localStorage).
export default function usePreferences() {
  const [theme, setTheme] = useState("light");
  const [solved, setSolved] = useState(0);
  const [navLang, setNavLangState] = useState("km");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const activeTheme = storedTheme || "light";
    setTheme(activeTheme);
    document.documentElement.setAttribute("data-theme", activeTheme);

    const storedSolved = localStorage.getItem("riddles-solved");
    if (storedSolved) setSolved(parseInt(storedSolved, 10));

    const storedNavLang = localStorage.getItem("nav-lang");
    if (storedNavLang) setNavLangState(storedNavLang);

    // The daily page fires "riddles-solved-updated" when the count changes.
    const handleSolvedChange = () => {
      const s = localStorage.getItem("riddles-solved");
      setSolved(s ? parseInt(s, 10) : 0);
    };
    window.addEventListener("riddles-solved-updated", handleSolvedChange);

    // Other tabs/components fire "nav-lang-changed" when the toggle is used.
    const handleNavLangChange = () => {
      setNavLangState(localStorage.getItem("nav-lang") || "km");
    };
    window.addEventListener("nav-lang-changed", handleNavLangChange);

    return () => {
      window.removeEventListener("riddles-solved-updated", handleSolvedChange);
      window.removeEventListener("nav-lang-changed", handleNavLangChange);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const toggleNavLang = () => {
    const next = navLang === "km" ? "en" : "km";
    setNavLangState(next);
    localStorage.setItem("nav-lang", next);
    window.dispatchEvent(new Event("nav-lang-changed"));
  };

  return { theme, toggleTheme, solved, navLang, toggleNavLang };
}
