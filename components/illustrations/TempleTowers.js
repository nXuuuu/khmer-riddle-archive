// Three stepped temple towers (ប្រាសាទ) on a platform, base at y = 0.
// Used by FolkloreArt.js, once upright and once flipped as a reflection.
const TOWER = "M0 -170 L12 -130 L24 -126 L28 -84 L40 -80 L44 -36 L56 -32 L58 0 L-58 0 L-56 -32 L-44 -36 L-40 -80 L-28 -84 L-24 -126 L-12 -130 Z";

export default function TempleTowers({ fill }) {
  return (
    <g fill={fill}>
      <path d={TOWER} transform="translate(200 0)" />
      <path d={TOWER} transform="translate(110 0) scale(0.7)" />
      <path d={TOWER} transform="translate(290 0) scale(0.7)" />
      <rect x="60" y="-10" width="280" height="10" />
    </g>
  );
}
