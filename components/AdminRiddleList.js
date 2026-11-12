// One titled list on the admin page (pending or published riddles).
// `renderActions(item)` returns the buttons for each row.
const S = {
  title: { fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" },
  list: { listStyle: "none", margin: "0 0 32px 0", padding: 0 },
  listItem: {
    borderBottom: "1px solid var(--border)",
    padding: "14px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  empty: { color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 },
};

export default function AdminRiddleList({ title, items, loading = false, emptyText, renderActions }) {
  return (
    <>
      <h2 style={S.title}>{title}</h2>
      {loading ? (
        <p style={S.empty}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={S.empty}>{emptyText}</p>
      ) : (
        <ul style={S.list}>
          {items.map((item) => (
            <li key={item.id} style={S.listItem}>
              <span><strong>{item.question}</strong> – {item.category}</span>
              <div>{renderActions(item)}</div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
