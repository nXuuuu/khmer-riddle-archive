"use client";

import { useState } from "react";
import Link from "next/link";
import collection from "../collection.config.js";
import Icon from "./Icon.js";
import NavUserLinks from "./NavUserLinks.js";
import NavDesktopAuth from "./NavDesktopAuth.js";
import MobileMenu from "./MobileMenu.js";
import useScrollProgress from "../hooks/useScrollProgress.js";
import usePreferences from "../hooks/usePreferences.js";
import useSession from "../hooks/useSession.js";

// Site header. The logic lives in three hooks (scroll, theme/streak, session);
// this file only lays out the bar. Desktop auth and the mobile menu are their own files.
export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrolled, progress } = useScrollProgress();
  const { theme, toggleTheme, streak } = usePreferences();
  const { user, isReviewer, handleLogout } = useSession();

  return (
    <header className={`gr-nav ${scrolled ? "gr-nav-scrolled" : ""}`} role="banner">
      <div className="scroll-progress-container" aria-hidden="true">
        <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="gr-nav-inner">
        <div className="gr-nav-left">
          <nav aria-label="Main navigation">
            <ul className="gr-nav-links">
              <li><Link href="/" className="gr-nav-link">Home</Link></li>
              <li><Link href="/daily" className="gr-nav-link">Daily Challenge</Link></li>
              <li><Link href="/contribute" className="gr-nav-link">Submit Riddle</Link></li>
            </ul>
          </nav>
        </div>

        <Link href="/" className="gr-logo-center" aria-label="Khmer Riddle Archive Home">
          <span className="gr-logo-title">{collection.name}</span>
          <span className="gr-logo-tagline">Living Folklore Archive</span>
        </Link>

        <div className="gr-nav-actions">
          <NavUserLinks user={user} isReviewer={isReviewer} streak={streak} />

          <NavDesktopAuth user={user} onLogout={handleLogout} />

          <button
            className="gr-theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
          </button>

          <button
            className="gr-nav-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <Icon name={mobileOpen ? "cross" : "menu"} size={18} />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <MobileMenu
          user={user}
          isReviewer={isReviewer}
          streak={streak}
          onClose={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </header>
  );
}
