// Shown when search or filters match nothing.
export default function EmptyState({ onReset }) {
  return (
    <div className="mu-empty" role="status" aria-live="polite">
      <p lang="km">គ្មានពាក្យបណ្តៅដែលត្រូវនឹងការស្វែងរកនេះទេ</p>
      <p>Nothing in the collection matches.</p>
      <button type="button" className="mu-btn mu-btn-ghost" onClick={onReset} style={{ marginTop: 18 }}>
        <span lang="km">សម្អាតការស្វែងរក</span> · Clear search
      </button>
    </div>
  );
}
