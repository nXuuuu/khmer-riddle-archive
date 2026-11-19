import Link from "next/link";
import Icon from "./Icon.js";
import NAV_LABELS from "../utils/navLabels.js";

const ROW = { display: "flex", gap: "10px", marginTop: "6px", paddingTop: "12px", borderTop: "1px solid var(--border)" };

// The dropdown menu shown on small screens. Every link closes the menu.
export default function MobileMenu({ user, isReviewer, solved, navLang = "km", toggleNavLang, onClose, onLogout }) {
  return (
    <div className="gr-mobile-menu">
      <Link href="/" className="gr-nav-link" onClick={onClose}>{NAV_LABELS.home[navLang]}</Link>
      <Link href="/daily" className="gr-nav-link" onClick={onClose}>{NAV_LABELS.daily[navLang]}</Link>
      <Link href="/contribute" className="gr-nav-link" onClick={onClose}>{NAV_LABELS.submit[navLang]}</Link>
      {user && (
        <Link href="/my-entries" className="gr-nav-link" onClick={onClose}>{NAV_LABELS.myEntries[navLang]}</Link>
      )}
      {isReviewer && (
        <Link href="/review" className="gr-nav-link" onClick={onClose}>{NAV_LABELS.reviewQueue[navLang]}</Link>
      )}
      {solved > 0 && (
        <Link href="/daily" className="gr-streak-badge" onClick={onClose}>
          <Icon name="flame" size={14} /> {solved} {navLang === "km" ? "ដោះស្រាយ" : "Riddles Solved"}
        </Link>
      )}
      {toggleNavLang && (
        <button type="button" className="gr-nav-link" onClick={toggleNavLang} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer" }}>
          {navLang === "km" ? "English" : "ខ្មែរ"}
        </button>
      )}
      {user ? (
        <div style={{ ...ROW, flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
            {NAV_LABELS.signedInAs[navLang]} <strong>{user.email}</strong>
          </span>
          <button
            onClick={() => { onClose(); onLogout(); }}
            className="gr-btn-secondary"
            style={{ width: "100%", padding: "10px", textAlign: "center" }}
          >
            {NAV_LABELS.logOut[navLang]}
          </button>
        </div>
      ) : (
        <div style={ROW}>
          <Link href="/login" className="gr-btn-secondary" style={{ flex: 1, padding: "10px" }} onClick={onClose}>
            {NAV_LABELS.logIn[navLang]}
          </Link>
          <Link href="/signup" className="gr-btn-primary" style={{ flex: 1, padding: "10px" }} onClick={onClose}>
            {NAV_LABELS.signUp[navLang]}
          </Link>
        </div>
      )}
    </div>
  );
}
