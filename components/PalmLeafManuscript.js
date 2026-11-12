// A still illustration of a Khmer palm-leaf manuscript (ស្លឹករឹត): a bundle of
// leaves between wooden covers, tied with a red cord, one leaf open on top.
// Replaces the old spinning emblem; drawn in SVG like the gallery illustrations.
const LEAVES = [0, 1, 2, 3, 4].map((i) => ({
  y: 232 + i * 22,
  x: 38 + (i % 2) * 6,
  fill: i % 2 ? "#d2ae6e" : "#dcbc80",
}));

export default function PalmLeafManuscript() {
  return (
    <figure className="mu-manuscript">
      <div className="mu-frame">
        <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Palm-leaf manuscript illustration" style={{ display: "block", width: "100%", height: "100%" }}>
          <rect width="400" height="500" fill="#2b211a" />
          <ellipse cx="200" cy="420" rx="170" ry="18" fill="#000" opacity="0.3" />
          {/* bottom wooden cover */}
          <rect x="30" y="345" width="340" height="30" rx="8" fill="#5a3a22" />
          {/* stacked leaves */}
          {LEAVES.map((l) => (
            <rect key={l.y} x={l.x} y={l.y} width="324" height="24" rx="10" fill={l.fill} stroke="#b08a4a" strokeWidth="1" />
          ))}
          {/* top wooden cover */}
          <rect x="34" y="212" width="332" height="24" rx="8" fill="#6b4529" />
          {/* red cord through the binding holes, ending in a tassel */}
          <path d="M120 212 V376 Q118 400 96 420" stroke="#a32c1c" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M96 420 l-10 34 M96 420 l0 36 M96 420 l10 34" stroke="#a32c1c" strokeWidth="3" strokeLinecap="round" />
          <circle cx="280" cy="224" r="5" fill="#2b211a" />
          {/* one leaf lifted and open, with incised Khmer script */}
          <g transform="rotate(-4 200 140)">
            <rect x="26" y="96" width="348" height="88" rx="16" fill="#e4c78e" stroke="#b08a4a" />
            <circle cx="120" cy="140" r="6" fill="#2b211a" />
            <circle cx="280" cy="140" r="6" fill="#2b211a" />
            <text x="200" y="134" textAnchor="middle" fontSize="26" fill="#3d2a17" style={{ fontFamily: "var(--font-khmer-display)" }}>
              ពាក្យបណ្តៅ
            </text>
            <text x="200" y="166" textAnchor="middle" fontSize="15" fill="#5a4026" style={{ fontFamily: "var(--font-khmer)" }}>
              កេរដំណែលដូនតា
            </text>
          </g>
        </svg>
        <span className="mu-visual-tag">Illustration</span>
      </div>
      <figcaption>
        <span lang="km">ស្លឹករឹតបុរាណ</span> · Palm-leaf manuscript
      </figcaption>
    </figure>
  );
}
