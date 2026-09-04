const S = {
  wrap: {
    padding: "56px 24px", textAlign: "center",
    border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)",
    color: "var(--text-muted)",
  },
  title: { fontSize: 28, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, display: "block" },
  sub: { fontSize: 14, lineHeight: 1.7, marginBottom: 20, color: "var(--text-muted)" },
  km: { display: "block", fontSize: 13, color: "var(--text-muted)", marginTop: 4 },
  reset: {
    display: "inline-block", fontFamily: "var(--mono)", fontSize: 12,
    color: "var(--accent)", border: "1px solid var(--border-accent)",
    backgroundColor: "var(--accent-glow)", borderRadius: "var(--radius-sm)",
    padding: "6px 14px", cursor: "pointer",
  },
};

export default function EmptyState({ onReset }) {
  return (
    <div style={S.wrap} role="status" aria-live="polite">
      <span style={S.title}>No riddles found</span>
      <p style={S.sub}>
        Your search or filter returned no results.
        <span style={S.km} lang="km">«គ្មានប្រស្នាដែលត្រូវនឹងការស្វែងរកនេះទេ»</span>
      </p>
      <button type="button" style={S.reset} onClick={onReset}>← Reset filters</button>
    </div>
  );
}
