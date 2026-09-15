"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import collection from "../collection.config.js";
import { SunIcon, MoonIcon } from "./ThemeIcons.js";
import { createClient } from "../utils/supabase/client.js";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [streak, setStreak] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const sysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(storedTheme || sysTheme);

    const storedStreak = localStorage.getItem("riddle-streak");
    if (storedStreak) setStreak(parseInt(storedStreak, 10));

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

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("streak-updated", handleStreakChange);
      subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
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

          <div className="gr-desktop-auth" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            {user ? (
              <>
                <span
                  style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  title={user.email}
                >
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="gr-btn-secondary"
                  style={{ padding: "6px 12px", fontSize: "12px", minHeight: "32px", cursor: "pointer" }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="gr-nav-link" style={{ fontSize: "13px" }}>
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="gr-btn-primary"
                  style={{ padding: "6px 12px", fontSize: "12px", minHeight: "32px", textDecoration: "none" }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="gr-theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="gr-nav-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="gr-mobile-menu">
          <Link href="/" className="gr-nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/daily" className="gr-nav-link" onClick={() => setMobileOpen(false)}>Daily Challenge</Link>
          <Link href="/submit" className="gr-nav-link" onClick={() => setMobileOpen(false)}>Submit Riddle</Link>
          {streak > 0 && (
            <Link href="/daily" className="gr-streak-badge" onClick={() => setMobileOpen(false)}>
              🔥 {streak} Day Streak
            </Link>
          )}
          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Signed in as: <strong>{user.email}</strong>
              </span>
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="gr-btn-secondary"
                style={{ width: "100%", padding: "10px", textAlign: "center" }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px", marginTop: "6px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
              <Link
                href="/login"
                className="gr-btn-secondary"
                style={{ flex: 1, textAlign: "center", padding: "10px", textDecoration: "none" }}
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="gr-btn-primary"
                style={{ flex: 1, textAlign: "center", padding: "10px", textDecoration: "none" }}
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
