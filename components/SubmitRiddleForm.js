// SubmitRiddleForm.js – client component
"use client";

import { useState } from "react";

const S = {
  form: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 560, margin: "0 auto" },
  label: { fontSize: 13, color: "var(--text-secondary)" },
  input: {
    padding: "8px 10px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontFamily: "inherit",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-card)",
    transition: "border-color var(--transition-fast)",
  },
  textarea: {
    resize: "vertical",
    minHeight: 80,
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "var(--accent-glow)",
    border: "1px solid var(--border-accent)",
    borderRadius: "var(--radius-sm)",
    color: "var(--accent)",
    fontFamily: "var(--mono)",
    cursor: "pointer",
    transition: "background-color var(--transition-fast)",
  },
  success: { marginTop: 8, color: "var(--accent)" },
};

export default function SubmitRiddleForm() {
  const [state, setState] = useState({
    question: "",
    questionHint: "",
    answer: "",
    answerEn: "",
    category: "All",
    explanation: "",
    explanationKm: "",
    source: "",
    sourceEn: "",
    contributor: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      window.dispatchEvent(new Event("riddleSubmitted"));
    } catch (err) {
      setError(err.message);
    }
  };

  if (submitted) {
    return (
      <p style={S.success}>Your riddle is waiting for local curation. Thank you!</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={S.form}>
      <label style={S.label}>Khmer question (verse)</label>
      <textarea name="question" value={state.question} onChange={handleChange} style={{ ...S.input, ...S.textarea }} required />

      <label style={S.label}>English hint (optional)</label>
      <input name="questionHint" value={state.questionHint} onChange={handleChange} style={S.input} />

      <label style={S.label}>Khmer answer</label>
      <input name="answer" value={state.answer} onChange={handleChange} style={S.input} required />

      <label style={S.label}>English answer</label>
      <input name="answerEn" value={state.answerEn} onChange={handleChange} style={S.input} required />

      <label style={S.label}>Category (choose from the list)</label>
      <select name="category" value={state.category} onChange={handleChange} style={S.input} required>
        <option value="All">All</option>
        <option value="Nature & Animals">Nature & Animals</option>
        <option value="Plants & Fruits">Plants & Fruits</option>
        <option value="Tools & Farming">Tools & Farming</option>
        <option value="Body & Daily Life">Body & Daily Life</option>
        <option value="Wisdom & Folklore">Wisdom & Folklore</option>
      </select>

      <label style={S.label}>English explanation</label>
      <textarea name="explanation" value={state.explanation} onChange={handleChange} style={{ ...S.input, ...S.textarea }} required />

      <label style={S.label}>Khmer explanation (optional)</label>
      <textarea name="explanationKm" value={state.explanationKm} onChange={handleChange} style={{ ...S.input, ...S.textarea }} />

      <label style={S.label}>Source (Khmer)</label>
      <input name="source" value={state.source} onChange={handleChange} style={S.input} required />

      <label style={S.label}>Source (English)</label>
      <input name="sourceEn" value={state.sourceEn} onChange={handleChange} style={S.input} required />

      <label style={S.label}>Your name (contributor)</label>
      <input name="contributor" value={state.contributor} onChange={handleChange} style={S.input} required />

      <button type="submit" style={S.button}>Submit Riddle</button>
      {error && <p style={{ color: "var(--accent)", marginTop: 4 }}>{error}</p>}
    </form>
  );
}
