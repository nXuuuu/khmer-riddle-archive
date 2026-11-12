// "Nature & Animals": a paddy frog on a lily pad under the moon.
const PALETTES = [
  { sky: "#1d3a2f", water: "#15291f", moon: "#f2d58a" },
  { sky: "#28344a", water: "#1b2434", moon: "#f4e3b5" },
];

export default function NatureArt({ variant = 0 }) {
  const p = PALETTES[variant % PALETTES.length];
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="500" fill={p.sky} />
      <circle cx="300" cy="110" r="46" fill={p.moon} />
      {[[60, 70], [140, 40], [220, 90], [90, 160], [350, 210]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2" fill={p.moon} opacity="0.7" />
      ))}
      <rect y="330" width="400" height="170" fill={p.water} />
      <ellipse cx="300" cy="420" rx="60" ry="6" fill="none" stroke={p.moon} strokeOpacity="0.25" />
      <ellipse cx="90" cy="460" rx="50" ry="5" fill="none" stroke={p.moon} strokeOpacity="0.2" />
      {/* reeds */}
      {[40, 58, 345, 362].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="340" x2={x + (i % 2 ? 6 : -4)} y2={200 + i * 18} stroke="#4f7a4a" strokeWidth="4" />
          <ellipse cx={x + (i % 2 ? 6 : -4)} cy={200 + i * 18} rx="6" ry="18" fill="#7a5a32" />
        </g>
      ))}
      {/* lily pad with its notch */}
      <path d="M80 382 a120 34 0 1 0 240 0 a120 34 0 1 0 -240 0 Z M200 382 L250 352 L262 362 Z" fill="#3f7d5a" fillRule="evenodd" />
      {/* frog */}
      <ellipse cx="148" cy="352" rx="40" ry="20" fill="#6b9c58" />
      <ellipse cx="252" cy="352" rx="40" ry="20" fill="#6b9c58" />
      <ellipse cx="200" cy="328" rx="62" ry="46" fill="#8cc06f" />
      <ellipse cx="200" cy="344" rx="36" ry="26" fill="#d7e8b0" />
      <circle cx="172" cy="284" r="17" fill="#8cc06f" />
      <circle cx="228" cy="284" r="17" fill="#8cc06f" />
      <circle cx="174" cy="282" r="8" fill="#1d1d1b" />
      <circle cx="226" cy="282" r="8" fill="#1d1d1b" />
      <path d="M176 312 Q200 326 224 312" stroke="#2f4a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
