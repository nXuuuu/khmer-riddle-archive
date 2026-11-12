import TempleTowers from "./TempleTowers.js";

// "Wisdom & Folklore": temple towers (ប្រាសាទ) at night, reflected in a pond, with lotus.
const PALETTES = [
  { sky: "#262a4f", pond: "#1c1f3d", stone: "#141632", glow: "#f1d38c" },
  { sky: "#3b2346", pond: "#2a1932", stone: "#1b0f20", glow: "#f3c6a5" },
];

export default function FolkloreArt({ variant = 0 }) {
  const p = PALETTES[variant % PALETTES.length];
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="500" fill={p.sky} />
      <circle cx="200" cy="170" r="70" fill={p.glow} opacity="0.9" />
      {[[50, 60], [120, 110], [330, 70], [360, 150], [70, 200]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1.8" fill={p.glow} />
      ))}
      <g transform="translate(0 320)"><TempleTowers fill={p.stone} /></g>
      <rect y="320" width="400" height="180" fill={p.pond} />
      <g transform="translate(0 320) scale(1 -0.6)" opacity="0.35"><TempleTowers fill={p.stone} /></g>
      <ellipse cx="200" cy="405" rx="40" ry="4" fill={p.glow} opacity="0.25" />
      {/* lotus */}
      <g transform="translate(300 440)">
        {[-50, -25, 0, 25, 50].map((a) => (
          <ellipse key={a} cx="0" cy="-22" rx="11" ry="26" fill="#e48aa6" transform={`rotate(${a})`} />
        ))}
        <ellipse cx="0" cy="2" rx="38" ry="7" fill="#3f7d5a" />
      </g>
    </svg>
  );
}
