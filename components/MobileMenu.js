import Link from "next/link";
import Icon from "./Icon.js";
import KmEn from "./KmEn.js";

const ROW = { display: "flex", gap: "10px", marginTop: "6px", paddingTop: "12px", borderTop: "1px solid var(--border)" };

// The dropdown menu shown on small screens. Every link closes the menu.
export default function MobileMenu({ user, isReviewer, streak, onClose, onLogout }) {
  return (
    <div className="gr-mobile-menu">
      <Link href="/" className="gr-nav-link" onClick={onClose}><KmEn km="ទំព័រដើម" en="Home" /></Link>
      <Link href="/daily" className="gr-nav-link" onClick={onClose}><KmEn km="ប្រចាំថ្ងៃ" en="Daily Challenge" /></Link>
      <Link href="/contribute" className="gr-nav-link" onClick={onClose}><KmEn km="ដាក់ស្នើ" en="Submit Riddle" /></Link>
      {user && (
        <Link href="/my-entries" className="gr-nav-link" onClick={onClose}><KmEn km="របស់ខ្ញុំ" en="My Entries" /></Link>
      )}
      {isReviewer && (
        <Link href="/review" className="gr-nav-link" onClick={onClose}><KmEn km="ត្រួតពិនិត្យ" en="Review Queue" /></Link>
      )}
      {streak > 0 && (
        <Link href="/daily" className="gr-streak-badge" onClick={onClose}>
          <Icon name="flame" size={14} /> <span lang="km">{streak} ថ្ងៃជាប់គ្នា</span> · {streak} Day Streak
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
            <span lang="km">ចាកចេញ</span> · Log Out
          </button>
        </div>
      ) : (
        <div style={ROW}>
          <Link href="/login" className="gr-btn-secondary" style={{ flex: 1, padding: "10px" }} onClick={onClose}>
            <span lang="km">ចូលគណនី</span> · Log In
          </Link>
          <Link href="/signup" className="gr-btn-primary" style={{ flex: 1, padding: "10px" }} onClick={onClose}>
            <span lang="km">ចុះឈ្មោះ</span> · Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
