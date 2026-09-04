"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "../../components/NavBar.js";
import { CATEGORIES } from "../../data/riddles.js";

export default function SubmitRiddle() {
  const [formData, setFormData] = useState({
    category: CATEGORIES[1] || "",
    question: "",
    questionHint: "",
    answer: "",
    answerEn: "",
    explanation: "",
    source: "",
    sourceEn: "",
    contributor: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer || !formData.answerEn) {
      alert("Please fill in the riddle question and answer fields.");
      return;
    }

    const newRiddle = {
      id: `custom-${Date.now()}`,
      ...formData,
      status: "pending",
      source: formData.source || "Submitted Online",
      sourceEn: formData.sourceEn || "Submitted Online",
      contributor: formData.contributor || "Anonymous Contributor",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const existing = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    localStorage.setItem("custom-riddles", JSON.stringify([newRiddle, ...existing]));
    
    setSuccess(true);
    setFormData({
      category: CATEGORIES[1] || "",
      question: "",
      questionHint: "",
      answer: "",
      answerEn: "",
      explanation: "",
      source: "",
      sourceEn: "",
      contributor: "",
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
              Your riddle has been queued for curator review. Once approved, it will be published to the public archive.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
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
                value={formData.questionHint} onChange={(e) => updateField("questionHint", e.target.value)}
              />
            </div>

            <div className="gr-form-group">
              <label className="gr-form-label">Answer (Khmer)*</label>
              <input 
                type="text" required className="gr-form-input" placeholder="e.g. ផ្លែម្ទេស"
                value={formData.answer} onChange={(e) => updateField("answer", e.target.value)}
              />
            </div>

            <div className="gr-form-group">
              <label className="gr-form-label">Answer (English)*</label>
              <input 
                type="text" required className="gr-form-input" placeholder="e.g. Chili Pepper"
                value={formData.answerEn} onChange={(e) => updateField("answerEn", e.target.value)}
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
                type="text" className="gr-form-input" placeholder="e.g. Grandmother Sokum, Takeo Province"
                value={formData.sourceEn} onChange={(e) => updateField("sourceEn", e.target.value)}
              />
            </div>

            <div className="gr-form-group">
              <label className="gr-form-label">Your Name (Contributor)</label>
              <input 
                type="text" className="gr-form-input" placeholder="e.g. Sokunthanou Chhoy"
                value={formData.contributor} onChange={(e) => updateField("contributor", e.target.value)}
              />
            </div>

            <button type="submit" className="gr-submit-btn" style={{ marginTop: "12px" }}>
              Publish to Local Archive
            </button>
          </form>
        )}
      </main>
    </>
  );
}
