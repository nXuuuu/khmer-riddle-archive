"use client";

import { useEffect, useState } from "react";

const S = {
  container: { marginTop: 40, padding: "0 24px" },
  title: { fontSize: 20, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" },
  listItem: { borderBottom: "1px solid var(--border)", padding: "12px 0" },
  btn: {
    marginLeft: 8,
    padding: "6px 12px",
    backgroundColor: "var(--accent-glow)",
    border: "1px solid var(--border-accent)",
    borderRadius: "var(--radius-sm)",
    color: "var(--accent)",
    fontFamily: "var(--mono)",
    cursor: "pointer",
    transition: "background-color var(--transition-fast)"
  },
  empty: { color: "var(--text-muted)" }
};

export default function AdminPanel() {
  const [pending, setPending] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    setPending(allCustom.filter(r => r.status === "pending"));
    setPublished(allCustom.filter(r => r.status === "published"));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("riddleSubmitted", fetchData);
    window.addEventListener("storage", fetchData);
    return () => {
      window.removeEventListener("riddleSubmitted", fetchData);
      window.removeEventListener("storage", fetchData);
    };
  }, []);

  const handleApprove = (id) => {
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const updated = allCustom.map(r => r.id === id ? { ...r, status: "published" } : r);
    localStorage.setItem("custom-riddles", JSON.stringify(updated));
    fetchData();
    window.dispatchEvent(new Event("riddlesUpdated"));
  };

  const handleRemove = (id) => {
    if (!window.confirm("Are you sure you want to remove this published riddle?")) return;
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const updated = allCustom.filter(r => r.id !== id);
    localStorage.setItem("custom-riddles", JSON.stringify(updated));
    fetchData();
    window.dispatchEvent(new Event("riddlesUpdated"));
  };

  const handleReject = (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this submission?")) return;
    const allCustom = JSON.parse(localStorage.getItem("custom-riddles") || "[]");
    const updated = allCustom.filter(r => r.id !== id);
    localStorage.setItem("custom-riddles", JSON.stringify(updated));
    fetchData();
  };

  return (
    <section style={S.container} aria-label="Admin curation panel">
      <h2 style={S.title}>Pending submissions</h2>
      {loading ? (
        <p style={S.empty}>Loading…</p>
      ) : pending.length === 0 ? (
        <p style={S.empty} style={{marginBottom: 32}}>No pending riddles.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: "0 0 32px 0", padding: 0 }}>
          {pending.map((item) => (
            <li key={item.id} style={S.listItem}>
              <strong>{item.question}</strong> – {item.category}
              <div>
                <button style={S.btn} onClick={() => handleApprove(item.id)}>Approve</button>
                <button style={{...S.btn, color: "var(--text-secondary)", borderColor: "var(--border)"}} onClick={() => handleReject(item.id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 style={S.title}>Published custom riddles</h2>
      {published.length === 0 ? (
        <p style={S.empty}>No custom riddles published yet.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {published.map((item) => (
            <li key={item.id} style={S.listItem}>
              <strong>{item.question}</strong> – {item.category}
              <button style={{...S.btn, color: "#ef4444", borderColor: "#ef444440", backgroundColor: "transparent"}} onClick={() => handleRemove(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
