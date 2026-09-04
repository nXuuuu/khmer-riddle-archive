"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar.js";

export default function CuratorDashboard() {
  const [pendingList, setPendingList] = useState([]);

  const loadPending = () => {
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const pending = allCustom.filter((r) => r.status === "pending");
    setPendingList(pending);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = (id) => {
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const updated = allCustom.map((r) => 
      r.id === id ? { ...r, status: "published" } : r
    );
    localStorage.setItem("custom-riddles", JSON.stringify(updated));
    loadPending();
  };

  const handleReject = (id) => {
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const updated = allCustom.filter((r) => r.id !== id);
    localStorage.setItem("custom-riddles", JSON.stringify(updated));
    loadPending();
  };

  return (
    <>
      <NavBar />
      <main className="gr-curator-container">
        <div className="gr-curator-header">
          <h2 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "8px" }}>
            Curator Curation Dashboard
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Review, edit, and publish community riddle submissions to the main Khmer archive.
          </p>
        </div>

        {pendingList.length === 0 ? (
          <div className="modern-card" style={{ padding: "40px", textAlign: "center" }}>
            <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🌿</span>
            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
              Archive is Up to Date
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              No custom riddle submissions are currently pending review.
            </p>
          </div>
        ) : (
          pendingList.map((r) => (
            <div key={r.id} className="modern-card gr-curator-card">
              <div className="gr-curator-meta">
                <span>ID: {r.id}</span>
                <span>Category: {r.category}</span>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <strong style={{ fontSize: "13px", color: "var(--text-muted)", display: "block" }}>
                  KHMER QUESTION:
                </strong>
                <p style={{ fontSize: "18px", fontWeight: 700 }} lang="km">« {r.question} »</p>
                {r.questionHint && (
                  <p style={{ fontStyle: "italic", fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Hint: "{r.questionHint}"
                  </p>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <strong style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                    ANSWER (ENGLISH)
                  </strong>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent)" }}>{r.answerEn}</span>
                </div>
                <div>
                  <strong style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                    ANSWER (KHMER)
                  </strong>
                  <span style={{ fontSize: "16px", fontWeight: 700 }} lang="km">{r.answer}</span>
                </div>
              </div>
              {r.explanation && (
                <div style={{ marginBottom: "16px" }}>
                  <strong style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                    CULTURAL EXPLANATION
                  </strong>
                  <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{r.explanation}</p>
                </div>
              )}
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Source: {r.sourceEn} · Contributor: {r.contributor}
              </div>
              <div className="gr-curator-actions">
                <button className="gr-btn-approve" onClick={() => handleApprove(r.id)}>
                  Approve & Publish
                </button>
                <button className="gr-btn-reject" onClick={() => handleReject(r.id)}>
                  Reject Submission
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );
}
