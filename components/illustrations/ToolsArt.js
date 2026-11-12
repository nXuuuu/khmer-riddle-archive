// "Tools & Farming": an ox-cart wheel with ripe rice stalks in front.
const PALETTES = [
  { bg: "#e0b453", ground: "#8a5a2b", wood: "#3b2416" },
  { bg: "#b7c4a4", ground: "#6d5a3a", wood: "#2e2418" },
];

const SPOKES = Array.from({ length: 12 }, (_, i) => i * 30);
const STALKS = [
  { x: 90, lean: -30 }, { x: 130, lean: -10 }, { x: 175, lean: 20 },
  { x: 230, lean: -20 }, { x: 280, lean: 15 }, { x: 320, lean: 35 },
];

export default function ToolsArt({ variant = 0 }) {
  const p = PALETTES[variant % PALETTES.length];
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="500" fill={p.bg} />
      <rect y="400" width="400" height="100" fill={p.ground} />
      {/* wheel */}
      <g transform="translate(200 260)">
        {SPOKES.map((a) => (
          <rect key={a} x="-5" y="-118" width="10" height="118" fill={p.wood} transform={`rotate(${a})`} />
        ))}
        <circle r="122" fill="none" stroke={p.wood} strokeWidth="20" />
        <circle r="132" fill="none" stroke={p.wood} strokeWidth="3" strokeOpacity="0.5" />
        <circle r="26" fill={p.wood} />
        <circle r="9" fill={p.bg} />
      </g>
      {/* rice stalks with drooping grain heads */}
      {STALKS.map(({ x, lean }) => (
        <g key={x}>
          <path d={`M${x} 470 Q${x + lean / 3} 400 ${x + lean} 350`} stroke="#5f6b2e" strokeWidth="4" fill="none" />
          {[0, 1, 2, 3, 4].map((g) => (
            <ellipse
              key={g}
              cx={x + lean + (lean > 0 ? g * 5 : -g * 5)}
              cy={350 + g * 9}
              rx="5"
              ry="9"
              fill="#c9962e"
              transform={`rotate(${lean} ${x + lean} ${350 + g * 9})`}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
