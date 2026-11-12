import Link from "next/link";
import Icon from "./Icon.js";

// Desktop links that depend on who is signed in: My Entries, the reviewer's
// Review badge, and the daily streak badge.
export default function NavUserLinks({ user, isReviewer, streak }) {
  return (
    <>
      <div className="gr-nav-right-links">
        {user && (
          <Link href="/my-entries" className="gr-nav-link">My Entries</Link>
        )}
        {isReviewer && (
          <Link href="/review" className="gr-nav-review-badge">
            <span className="gr-review-dot" /> Review Queue
          </Link>
        )}
      </div>

      {streak > 0 && (
        <Link href="/daily" className="gr-streak-badge"><Icon name="flame" size={14} /> {streak}</Link>
      )}
    </>
  );
}
