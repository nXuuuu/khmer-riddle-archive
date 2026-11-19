import Link from "next/link";
import NAV_LABELS from "../utils/navLabels.js";

// Desktop nav, right side: the signed-in user's pill with Log Out,
// or Log In / Sign Up links when nobody is signed in.
export default function NavDesktopAuth({ user, onLogout, navLang = "km" }) {
  return (
    <div className="gr-desktop-auth">
      {user ? (
        <div className="gr-user-pill">
          <span className="gr-user-avatar">
            {(user.email || "U")[0].toUpperCase()}
          </span>
          <span className="gr-user-name" title={user.email}>
            {user.email.split("@")[0]}
          </span>
          <button onClick={onLogout} className="gr-logout-btn" title={NAV_LABELS.logOut[navLang]}>
            {NAV_LABELS.logOut[navLang]}
          </button>
        </div>
      ) : (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Link href="/login" className="gr-nav-link" style={{ fontSize: "13px" }}>
            {NAV_LABELS.logIn[navLang]}
          </Link>
          <Link
            href="/signup"
            className="gr-btn-primary"
            style={{ padding: "6px 14px", fontSize: "12px", minHeight: "32px", borderRadius: "99px", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            {NAV_LABELS.signUp[navLang]}
          </Link>
        </div>
      )}
    </div>
  );
}
