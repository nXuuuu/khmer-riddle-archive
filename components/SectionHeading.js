// Shared section header: small English label on the left,
// big Khmer title with a smaller English line under it on the right.
export default function SectionHeading({ label, km, en }) {
  return (
    <header className="gr-section-header reveal">
      <span className="gr-section-label">{label}</span>
      <div>
        <h2 className="mu-title-km" lang="km">{km}</h2>
        <p className="mu-title-en">{en}</p>
      </div>
    </header>
  );
}
