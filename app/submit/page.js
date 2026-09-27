"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "../../components/NavBar.js";
import { CATEGORIES } from "../../collection.config.js";
import { createClient } from "../../utils/supabase/client.js";

export default function SubmitRiddle() {
  const [formData, setFormData] = useState({
    category: CATEGORIES[1] || "",
    question: "",
    hint: "",
    answer_kh: "",
    answer_en: "",
    explanation: "",
    source: "",
  });
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!formData.question || !formData.answer_kh || !formData.answer_en) {
      setErrorMsg("Please fill in the riddle question and answer fields.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setErrorMsg("Database connection not configured.");
      return;
    }

    // Try to get user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setErrorMsg("You must be logged in to submit a riddle (RLS enforced).");
      return;
    }

    const newRiddle = {
      ...formData,
      owner: user.id,
      source: formData.source || "Submitted Online",
    };

    const { error } = await supabase.from("entries").insert([newRiddle]);

    if (error) {
      console.error(error);
      setErrorMsg(`Submission failed: ${error.message}`);
      return;
    }
    
    setSuccess(true);
    setFormData({
      category: CATEGORIES[1] || "",
      question: "",
      hint: "",
      answer_kh: "",
      answer_en: "",
      explanation: "",
      source: "",
    });
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <NavBar />
      <main className="gr-submit-container">
        {success ? (
          <div className="modern-card gr-daily-success">
            <div className="gr-daily-success-icon">📥</div>
            <h2 style={{ marginBottom: "12px", fontSize: "28px" }}>Riddle Submitted!</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
              Your riddle has been securely saved to the database.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="gr-btn-primary" onClick={() => setSuccess(false)}>
                Submit Another
              </button>
              <Link href="/" className="gr-btn-secondary">View Archive</Link>
            </div>
          </div>
        ) : (
          <form className="modern-card gr-form-card" onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "8px", fontSize: "26px", fontWeight: 800 }}>Submit a Khmer Riddle</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "14px" }}>
              Share a riddle from your family, elders, or books to help preserve Khmer oral history.
            </p>

            {errorMsg && (
              <div style={{ padding: "12px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", border: "1px solid #ef9a9a" }}>
                {errorMsg}
              </div>
            )}

            <div className="gr-form-group">
              <label className="gr-form-label">Category</label>
              <select 
                className="gr-form-select"
                value={formData.category} 
                onChange={(e) => updateField("category", e.target.value)}
              >
                {CATEGORIES.filter(c => c !== "All").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="gr-form-group">
              <label className="gr-form-label">Riddle Question (Khmer)*</label>
              <input 
                type="text" required className="gr-form-input" placeholder="e.g. ពេលនៅក្មេងស្លៀកសំពត់ខៀវ..."
                value={formData.question} onChange={(e) => updateField("question", e.target.value)}
              />
            </div>

            <div className="gr-form-group">
              <label className="gr-form-label">English Hint/Translation</label>
              <input 
                type="text" className="gr-form-input" placeholder="e.g. Dressed in blue when young..."
                value={formData.hint} onChange={(e) => updateField("hint", e.target.value)}
              />
            </div>

            <div className="gr-form-group">
              <label className="gr-form-label">Answer (Khmer)*</label>
              <input 
                type="text" required className="gr-form-input" placeholder="e.g. ផ្លែម្ទេស"
                value={formData.answer_kh} onChange={(e) => updateField("answer_kh", e.target.value)}
              />
            </div>

            <div className="gr-form-group">
              <label className="gr-form-label">Answer (English)*</label>
              <input 
                type="text" required className="gr-form-input" placeholder="e.g. Chili Pepper"
                value={formData.answer_en} onChange={(e) => updateField("answer_en", e.target.value)}
              />
            </div>

            <div className="gr-form-group">
              <label className="gr-form-label">Explanation (English)</label>
              <textarea 
                className="gr-form-textarea" placeholder="Explain the metaphor or cultural context of the riddle..."
                value={formData.explanation} onChange={(e) => updateField("explanation", e.target.value)}
              />
            </div>

            <div className="gr-form-group">
              <label className="gr-form-label">Source (English)</label>
              <input 
                type="text" required className="gr-form-input" placeholder="e.g. Grandmother Sokum, Takeo Province"
                value={formData.source} onChange={(e) => updateField("source", e.target.value)}
              />
            </div>

            <button type="submit" className="gr-submit-btn" style={{ marginTop: "12px" }}>
              Publish to Database
            </button>
          </form>
        )}
      </main>
    </>
  );
}
