import Link from "next/link";
import Icon from "./Icon.js";
import NAV_LABELS from "../utils/navLabels.js";

// Desktop links that depend on who is signed in: My Entries, the reviewer's
// Review badge, and the riddles-solved badge.
export default function NavUserLinks({ user, isReviewer, solved, navLang = "km" }) {
  return (
    <>
      <div className="gr-nav-right-links">
        {user && (
          <Link href="/my-entries" className="gr-nav-link">{NAV_LABELS.myEntries[navLang]}</Link>
        )}
        {isReviewer && (
          <Link href="/review" className="gr-nav-review-badge">
            <span className="gr-review-dot" /> {NAV_LABELS.reviewQueue[navLang]}
          </Link>
        )}
      </div>

      {solved > 0 && (
        <Link href="/daily" className="gr-streak-badge"><Icon name="flame" size={14} /> {solved}</Link>
      )}
    </>
  );
}
