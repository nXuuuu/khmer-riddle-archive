"use client";

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar.js";
import Icon from "../../components/Icon.js";
import KmEn from "../../components/KmEn.js";

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
          <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, marginBottom: "8px" }}>
            <KmEn km="ផ្ទាំងអ្នកថែរក្សា" en="Curator Dashboard" />
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            <span lang="km">ត្រួតពិនិត្យ កែប្រែ និងផ្សព្វផ្សាយការដាក់ស្នើពាក្យបណ្តៅពីសហគមន៍ទៅបណ្ណសារខ្មែរចម្បង។</span> · Review, edit, and publish community riddle submissions to the main Khmer archive.
          </p>
        </div>

        {pendingList.length === 0 ? (
          <div className="modern-card" style={{ padding: "clamp(24px, 5vw, 40px)", textAlign: "center" }}>
            <span style={{ display: "block", marginBottom: "16px", color: "var(--success)" }}><Icon name="leaf" size={48} /></span>
            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }} lang="km">
              បណ្ណសារទាន់សម័យហើយ
            </h3>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px", color: "var(--text-secondary)" }}>
              Archive is Up to Date
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              <span lang="km">មិនមានការដាក់ស្នើពាក្យបណ្តៅផ្ទាល់ខ្លួនកំពុងរង់ចាំត្រួតពិនិត្យទេពេលនេះ។</span> · No custom riddle submissions are currently pending review.
            </p>
          </div>
        ) : (
          pendingList.map((r) => (
            <div key={r.id} className="modern-card gr-curator-card">
              <div className="gr-curator-meta">
                <span>ID: {r.id}</span>
                <span><span lang="km">ប្រភេទ</span> · Category: {r.category}</span>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <strong style={{ fontSize: "13px", color: "var(--text-secondary)", display: "block" }}>
                  <span lang="km">សំណួរខ្មែរ</span> · KHMER QUESTION:
                </strong>
                <p style={{ fontSize: "18px", fontWeight: 700 }} lang="km">« {r.question} »</p>
                {r.questionHint && (
                  <p style={{ fontStyle: "italic", fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    <span lang="km">តម្រុយ</span> · Hint: "{r.questionHint}"
                  </p>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <strong style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block" }}>
                    <span lang="km">ចម្លើយ (អង់គ្លេស)</span> · ANSWER (ENGLISH)
                  </strong>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent)" }}>{r.answerEn}</span>
                </div>
                <div>
                  <strong style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block" }}>
                    <span lang="km">ចម្លើយ (ខ្មែរ)</span> · ANSWER (KHMER)
                  </strong>
                  <span style={{ fontSize: "16px", fontWeight: 700 }} lang="km">{r.answer}</span>
                </div>
              </div>
              {r.explanation && (
                <div style={{ marginBottom: "16px" }}>
                  <strong style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block" }}>
                    <span lang="km">ការពន្យល់វប្បធម៌</span> · CULTURAL EXPLANATION
                  </strong>
                  <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{r.explanation}</p>
                </div>
              )}
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                <span lang="km">ប្រភព</span> · Source: {r.sourceEn} · <span lang="km">អ្នករួមចំណែក</span> · Contributor: {r.contributor}
              </div>
              <div className="gr-curator-actions" style={{ flexWrap: "wrap", gap: "10px" }}>
                <button className="gr-btn-approve" onClick={() => handleApprove(r.id)}>
                  <span lang="km">អនុម័ត និងផ្សព្វផ្សាយ</span> · Approve & Publish
                </button>
                <button className="gr-btn-reject" onClick={() => handleReject(r.id)}>
                  <span lang="km">បដិសេធការដាក់ស្នើ</span> · Reject Submission
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );
}
