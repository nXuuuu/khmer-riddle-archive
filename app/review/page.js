import Link from "next/link";
import NavBar from "../../components/NavBar.js";
import ReviewQueue from "../../components/ReviewQueue.js";
import { createClient } from "../../utils/supabase/server.js";
import KmEn from "../../components/KmEn.js";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: isReviewer } = await supabase.rpc("is_reviewer");

  if (!isReviewer) {
    return (
      <>
        <NavBar />
        <main className="gr-submit-container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <div className="modern-card" style={{ padding: "48px 24px", maxWidth: "560px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "12px", fontSize: "24px", fontWeight: 800 }}>
              <KmEn km="គ្មានការអនុញ្ញាត" en="Access Denied" />
            </h2>
            <p style={{ color: "var(--text-secondary)", margin: "16px 0 24px", lineHeight: 1.6 }}>
              This page is for reviewers only. You do not have permission to view or review pending entries.
            </p>
            <Link href="/" className="gr-btn-primary">
              Back to Archive
            </Link>
          </div>
        </main>
      </>
    );
  }

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <>
      <NavBar />
      <main className="gr-submit-container" style={{ maxWidth: "860px", padding: "40px 20px 80px" }}>
        <ReviewQueue initialEntries={entries || []} />
      </main>
    </>
  );
}
