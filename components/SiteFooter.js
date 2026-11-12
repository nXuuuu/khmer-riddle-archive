import collection from "../collection.config.js";

// Dark closing band with the Khmer title set very large.
export default function SiteFooter() {
  return (
    <footer className="mu-footer">
      <div className="mu-footer-inner">
        <p className="mu-footer-big reveal" lang="km">ពាក្យបណ្តៅ</p>
        <div className="mu-footer-row">
          <span>{collection.name} — preserving the oral wit of the Khmer people, one riddle at a time.</span>
          <a href="/login" className="vt-footer-admin-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Admin Portal · ចូលគ្រប់គ្រង
          </a>
        </div>
      </div>
    </footer>
  );
}
