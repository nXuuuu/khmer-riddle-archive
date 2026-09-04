"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import collection from "../collection.config.js";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const sysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(storedTheme || sysTheme);

    const storedStreak = localStorage.getItem("riddle-streak");
    if (storedStreak) setStreak(parseInt(storedStreak, 10));

    // Listen for custom event when streak changes on /daily
    const handleStreakChange = () => {
      const s = localStorage.getItem("riddle-streak");
      setStreak(s ? parseInt(s, 10) : 0);
    };
    window.addEventListener("streak-updated", handleStreakChange);

    const onScroll = () => {
      const el = document.documentElement;
      const top = el.scrollTop || document.body.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      setProgress(height > 0 ? (top / height) * 100 : 0);
      setScrolled(top > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("streak-updated", handleStreakChange);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <header className={`gr-nav ${scrolled ? "gr-nav-scrolled" : ""}`} role="banner">
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} aria-hidden="true" />
      <div className="gr-nav-inner">
        <Link href="/" className="gr-logo" aria-label="Khmer Riddle Archive Home">
          <span>{collection.name.split(" ")[0]}</span>{collection.name.substring(collection.name.indexOf(" "))}
        </Link>
        <nav aria-label="Main navigation">
          <ul className="gr-nav-links">
            <li><Link href="/" className="gr-nav-link">Home</Link></li>
            <li><Link href="/daily" className="gr-nav-link">Daily Challenge</Link></li>
            <li><Link href="/submit" className="gr-nav-link">Submit Riddle</Link></li>
          </ul>
        </nav>
        <div className="gr-nav-actions">
          {streak > 0 && (
            <Link href="/daily" className="gr-streak-badge">
              🔥 {streak} Day Streak
            </Link>
          )}
          <button
            className="gr-theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
