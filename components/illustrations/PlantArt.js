import SugarPalm from "./SugarPalm.js";

// "Plants & Fruits": sugar palms (ដើមត្នោត) against a setting sun over rice fields.
const PALETTES = [
  { sky: "#c8553d", sun: "#f4a259", field: "#5b8e55" },
  { sky: "#d9a441", sun: "#f6d58e", field: "#4f7f4a" },
];

export default function PlantArt({ variant = 0 }) {
  const p = PALETTES[variant % PALETTES.length];
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="500" fill={p.sky} />
      <circle cx="200" cy="300" r="110" fill={p.sun} />
      <rect y="380" width="400" height="120" fill={p.field} />
      {[400, 425, 455, 490].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#000" strokeOpacity="0.12" strokeWidth="2" />
      ))}
      <SugarPalm x={185} top={170} />
      <SugarPalm x={315} top={250} scale={0.6} />
      <SugarPalm x={70} top={270} scale={0.5} />
    </svg>
  );
}
