"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../utils/supabase/client.js";

export default function RiddleCard({ item, currentUser }) {
  const [revealed, setRevealed] = useState(false);
  const [deleted, setDeleted] = useState(false);

  // Use a short version of the UUID for display
  const displayId = item.id.length > 15 ? item.id.slice(0, 8) : item.id;
  const isOwner = currentUser && currentUser.id === item.owner;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this riddle?")) return;
    
    const supabase = createClient();
    if (!supabase) return;

    // Delete through supabase-js and .select() to verify
    const { data, error } = await supabase
      .from("entries")
      .delete()
      .eq("id", item.id)
      .select();

    if (error) {
      console.error(error);
      alert("An error occurred during deletion.");
      return;
    }

    if (!data || data.length === 0) {
      console.error("Deletion refused by RLS. Zero rows returned.");
      alert("That change wasn't saved.");
      return;
    }

    // Success
    setDeleted(true);
    // Optional cleanup: if image_url exists, parse path and remove from storage
    if (item.image_url) {
      try {
        const urlObj = new URL(item.image_url);
        const pathSegments = urlObj.pathname.split('/');
        const userFolder = pathSegments[pathSegments.length - 2];
        const fileName = pathSegments[pathSegments.length - 1];
        await supabase.storage.from("photos").remove([`${userFolder}/${fileName}`]);
      } catch (e) {
        console.error("Cleanup photo error:", e);
      }
    }
  };

  if (deleted) return null;

  return (
    <article className="modern-card" style={{ padding: "clamp(18px, 3vw, 24px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <span className="gr-card-badge">{item.category}</span>
        <span className="gr-card-id">#{displayId}</span>
      </div>

      {item.image_url && (
        <div style={{ marginBottom: "16px", borderRadius: "8px", overflow: "hidden", backgroundColor: "var(--bg-elevated)", display: "flex", justifyContent: "center" }}>
          <img src={item.image_url} alt="Riddle visual clue" style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }} />
        </div>
      )}

      {item.hint && (
        <p className="gr-card-hint">"{item.hint}"</p>
      )}

      <div className="gr-card-question">
        <p className="gr-card-q-text" lang="km">« {item.question} »</p>
      </div>

      <div className="gr-card-source">
        <span>{item.source}</span>
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <button
          type="button"
          onClick={() => setRevealed(r => !r)}
          className={`gr-card-reveal-btn ${revealed ? "active" : ""}`}
          style={{ flex: 1 }}
        >
          {revealed ? "Hide Answer" : "Reveal Answer"}
        </button>
        
        {isOwner && (
          <>
            <Link href={`/edit/${item.id}`} className="gr-card-reveal-btn" style={{ flex: "0 0 auto", textDecoration: "none", backgroundColor: "var(--bg-elevated)" }}>
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="gr-card-reveal-btn"
              style={{ flex: "0 0 auto", backgroundColor: "#ffebee", color: "#c62828", border: "1px solid #ffcdd2" }}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {revealed && (
        <div className="gr-card-ans-box">
          <span className="gr-card-ans-title">ANSWER</span>
          <p className="gr-card-ans-en">{item.answer_en}</p>
          <p className="gr-card-ans-km" lang="km">{item.answer_kh}</p>
          {item.explanation && <p className="gr-card-explanation">{item.explanation}</p>}
        </div>
      )}
    </article>
  );
}
