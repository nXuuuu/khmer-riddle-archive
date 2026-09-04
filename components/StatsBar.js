const S = {
  wrap: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0 18px", borderBottom: "1px solid var(--border)",
    marginBottom: 24, flexWrap: "wrap", gap: 8,
  },
  left: { fontFamily: "var(--mono)", fontSize: 13, color: "var(--text-muted)" },
  count: { color: "var(--accent)", fontWeight: 700 },
  right: { fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-muted)" },
};

export default function StatsBar({ total, visibleCount }) {
  const isFiltered = visibleCount !== total;
  return (
    <div style={S.wrap} aria-live="polite" aria-atomic="true">
      <span style={S.left}>
        {isFiltered ? (
          <><span style={S.count}>{visibleCount}</span> of {total} entries matching</>
        ) : (
          <><span style={S.count}>{total}</span> entries in archive</>
        )}
      </span>
      <span style={S.right}>KHMER RIDDLE ARCHIVE · ICT 340</span>
    </div>
  );
}
