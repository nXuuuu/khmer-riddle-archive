// Bilingual text with Khmer as the main line and English as a smaller line below.
// Used inside headings, buttons and labels so Khmer always leads the hierarchy.
export default function KmEn({ km, en, inline = false }) {
  return (
    <>
      <span className={inline ? "km-main km-inline" : "km-main"} lang="km">{km}</span>
      {en && <span className={inline ? "en-sub en-inline" : "en-sub"}>{en}</span>}
    </>
  );
}
