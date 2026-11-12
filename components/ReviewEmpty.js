import Icon from "./Icon.js";

// Shown on the review page when there is nothing left to review.
export default function ReviewEmpty() {
  return (
    <div className="modern-card" style={{ padding: "48px 24px", textAlign: "center" }}>
      <p style={{ marginBottom: "12px", color: "var(--success)" }}><Icon name="check" size={40} /></p>
      <p lang="km" style={{ marginBottom: "4px", fontSize: "18px", fontWeight: 600 }}>
        គ្មានពាក្យបណ្ដៅដែលរង់ចាំការត្រួតពិនិត្យទេ។
      </p>
      <h3 style={{ marginBottom: "8px", fontSize: "16px", color: "var(--text-secondary)" }}>
        No pending entries in the queue
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
        The queue is clear. All submissions have been reviewed.
      </p>
    </div>
  );
}
