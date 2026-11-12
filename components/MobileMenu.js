import Link from "next/link";
import Icon from "./Icon.js";

const ROW = { display: "flex", gap: "10px", marginTop: "6px", paddingTop: "12px", borderTop: "1px solid var(--border)" };

// The dropdown menu shown on small screens. Every link closes the menu.
export default function MobileMenu({ user, isReviewer, streak, onClose, onLogout }) {
  return (
    <div className="gr-mobile-menu">
      <Link href="/" className="gr-nav-link" onClick={onClose}>Home</Link>
      <Link href="/daily" className="gr-nav-link" onClick={onClose}>Daily Challenge</Link>
      <Link href="/contribute" className="gr-nav-link" onClick={onClose}>Submit Riddle</Link>
      {user && (
        <Link href="/my-entries" className="gr-nav-link" onClick={onClose}>My Entries</Link>
      )}
      {isReviewer && (
        <Link href="/review" className="gr-nav-link" onClick={onClose}>Review Queue</Link>
      )}
      {streak > 0 && (
        <Link href="/daily" className="gr-streak-badge" onClick={onClose}>
          <Icon name="flame" size={14} /> {streak} Day Streak
        </Link>
      )}
      {user ? (
        <div style={{ ...ROW, flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
            Signed in as: <strong>{user.email}</strong>
          </span>
          <button
            onClick={() => { onClose(); onLogout(); }}
            className="gr-btn-secondary"
            style={{ width: "100%", padding: "10px", textAlign: "center" }}
          >
            Log Out
          </button>
        </div>
      ) : (
        <div style={ROW}>
          <Link href="/login" className="gr-btn-secondary" style={{ flex: 1, padding: "10px" }} onClick={onClose}>
            Log In
          </Link>
          <Link href="/signup" className="gr-btn-primary" style={{ flex: 1, padding: "10px" }} onClick={onClose}>
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
