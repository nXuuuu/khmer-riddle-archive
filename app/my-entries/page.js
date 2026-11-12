"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "../../components/NavBar.js";
import { createClient } from "../../utils/supabase/client.js";
import KmEn from "../../components/KmEn.js";

const STATUS_LABELS = {
  published: { en: "Published", km: "បានផ្សព្វផ្សាយ", color: "#10b981" },
  pending:   { en: "Pending Review", km: "រង់ចាំការត្រួតពិនិត្យ", color: "#f59e0b" },
  returned:  { en: "Returned", km: "បានត្រឡប់មក", color: "#ef4444" },
};

export default function MyEntries() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) return setLoading(false);

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("entries")
          .select("id, question, category, status, created_at")
          .eq("owner", user.id)
          .order("created_at", { ascending: false });
        setEntries(data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "60px" }}>Loading...</div>;

  if (!user) {
    return (
      <>
        <NavBar />
        <main className="gr-submit-container" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2><KmEn km="សម្រាប់សមាជិកប៉ុណ្ណោះ" en="Members Only" /></h2>
          <p style={{ color: "var(--text-secondary)", margin: "20px 0" }}>
            You must be logged in to view your entries.
          </p>
          <Link href="/login" className="gr-btn-primary">Log In</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="gr-submit-container">
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, marginBottom: "8px" }}>
            <KmEn km="ពាក្យបណ្តៅរបស់ខ្ញុំ" en="My Entries" />
          </h1>
          <p lang="km" style={{ color: "var(--accent)", fontSize: "14px" }}>ពាក្យបណ្ដៅរបស់ខ្ញុំ</p>
        </div>

        {entries.length === 0 ? (
          <div className="modern-card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
              You haven&apos;t submitted any riddles yet.
            </p>
            <Link href="/contribute" className="gr-btn-primary">Submit a Riddle</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {entries.map((entry) => {
              const label = STATUS_LABELS[entry.status] || STATUS_LABELS.pending;
              return (
                <div key={entry.id} className="modern-card" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p lang="km" style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.question}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
                      {entry.category} · {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: label.color, background: `${label.color}22`, padding: "4px 10px", borderRadius: "99px", whiteSpace: "nowrap" }}>
                      {label.en}
                      <span lang="km" style={{ marginLeft: "6px", fontWeight: 400 }}>· {label.km}</span>
                    </span>
                    <Link href={`/edit/${entry.id}`} className="gr-btn-secondary" style={{ fontSize: "12px", padding: "5px 12px", textDecoration: "none" }}>
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: "32px" }}>
          <Link href="/contribute" className="gr-btn-primary">Submit Another Riddle</Link>
        </div>
      </main>
    </>
  );
}
