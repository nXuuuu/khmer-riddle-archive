"use client";

import AdminRiddleList from "./AdminRiddleList.js";
import useCustomRiddles from "../hooks/useCustomRiddles.js";

const btn = {
  marginLeft: 6,
  padding: "8px 14px",
  minHeight: 44,
  backgroundColor: "var(--accent-glow)",
  border: "1px solid var(--border-accent)",
  borderRadius: "var(--radius-sm)",
  color: "var(--accent)",
  fontSize: 13,
  cursor: "pointer",
};

// Admin curation panel: approve/reject pending riddles and remove published ones.
// Data handling is in useCustomRiddles; each list is an AdminRiddleList.
export default function AdminPanel() {
  const { pending, published, loading, handleApprove, handleRemove, handleReject } = useCustomRiddles();

  return (
    <section style={{ marginTop: "var(--space-md)", width: "100%" }} aria-label="Admin curation panel">
      <AdminRiddleList
        title="Pending submissions"
        items={pending}
        loading={loading}
        emptyText="No pending riddles."
        renderActions={(item) => (
          <>
            <button style={btn} onClick={() => handleApprove(item.id)}>Approve</button>
            <button style={{ ...btn, color: "var(--text-secondary)", borderColor: "var(--border)" }} onClick={() => handleReject(item.id)}>
              Reject
            </button>
          </>
        )}
      />
      <AdminRiddleList
        title="Published custom riddles"
        items={published}
        emptyText="No custom riddles published yet."
        renderActions={(item) => (
          <button style={{ ...btn, color: "var(--danger)", borderColor: "var(--danger)", backgroundColor: "transparent" }} onClick={() => handleRemove(item.id)}>
            Remove
          </button>
        )}
      />
    </section>
  );
}
