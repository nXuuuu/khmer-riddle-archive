// One sugar palm (ដើមត្នោត), drawn with its base at (x, top + 230).
// Used by PlantArt.js; `scale` makes smaller palms in the distance.
const LEAF_ANGLES = [-170, -150, -130, -110, -90, -70, -50, -30, -10];

export default function SugarPalm({ x, top, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${top}) scale(${scale})`}>
      <path d="M-7 0 Q-4 120 -9 230 L9 230 Q6 120 7 0 Z" fill="#3b2a20" />
      {LEAF_ANGLES.map((a) => (
        <ellipse key={a} cx="46" cy="0" rx="50" ry="8" fill="#2d4a2b" transform={`rotate(${a})`} />
      ))}
      <circle cx="-8" cy="12" r="7" fill="#3b2a20" />
      <circle cx="6" cy="14" r="7" fill="#3b2a20" />
      <circle cx="-1" cy="22" r="7" fill="#3b2a20" />
    </g>
  );
}
