"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard.js";
import { createClient } from "../utils/supabase/client.js";
import Icon from "./Icon.js";
import KmEn from "./KmEn.js";

export default function ReviewQueue({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);
  const [errorMsg, setErrorMsg] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const handleReview = async (id, decision) => {
    setErrorMsg("");
    setProcessingId(id);

    try {
      const supabase = createClient();
      if (!supabase) {
        setErrorMsg("Failed to connect to database. Please try again.");
        setProcessingId(null);
        return;
      }

      const { data, error } = await supabase.rpc("review_entry", {
        entry_id: id,
        decision,
      });

      if (error || data !== true) {
        setErrorMsg("Failed to update entry status. Please try again or refresh.");
        setProcessingId(null);
        return;
      }

      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setErrorMsg("An unexpected error occurred while reviewing.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, marginBottom: "8px" }}>
          <KmEn km="កន្លែងត្រួតពិនិត្យ" en="Review Queue" />
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Pending entries submitted by contributors, sorted oldest first.
        </p>
      </div>

      {errorMsg && (
        <div className="gr-alert-error" style={{ marginBottom: "20px" }}>
          {errorMsg}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="modern-card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <p style={{ marginBottom: "12px", color: "var(--success)" }}><Icon name="check" size={40} /></p>
          <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>No pending entries in the queue</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            The queue is clear. All submissions have been reviewed.
          </p>
          <p lang="km" style={{ color: "var(--accent)", fontSize: "14px", marginTop: "6px" }}>
            គ្មានពាក្យបណ្ដៅដែលរង់ចាំការត្រួតពិនិត្យទេ។
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {entries.map((entry) => (
            <ReviewCard
              key={entry.id}
              entry={entry}
              onReview={handleReview}
              disabled={processingId === entry.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
