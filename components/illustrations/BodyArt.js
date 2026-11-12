"use client";

import { useId } from "react";

// "Body & Daily Life": a clay water pot (ក្អម) on a krama-check cloth.
const PALETTES = [
  { bg: "#2f4858", check: "#3f6274", line: "#c4473a" },
  { bg: "#5a2e3a", check: "#6e3b48", line: "#e0b453" },
];

export default function BodyArt({ variant = 0 }) {
  const p = PALETTES[variant % PALETTES.length];
  const id = useId().replace(/:/g, ""); // unique pattern id per illustration on the page

  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={`krama-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill={p.bg} />
          <rect width="20" height="20" fill={p.check} />
          <rect x="20" y="20" width="20" height="20" fill={p.check} />
          <line x1="0" y1="1" x2="40" y2="1" stroke={p.line} strokeWidth="2" opacity="0.6" />
          <line x1="1" y1="0" x2="1" y2="40" stroke={p.line} strokeWidth="2" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="400" height="500" fill={`url(#krama-${id})`} />
      {/* table / shadow */}
      <ellipse cx="200" cy="440" rx="130" ry="18" fill="#000" opacity="0.25" />
      {/* pot body */}
      <path d="M150 240 C80 290 95 430 200 438 C305 430 320 290 250 240 Z" fill="#b5562f" />
      <path d="M150 240 C110 280 112 380 150 420" stroke="#d27a4c" strokeWidth="10" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M118 330 Q200 350 282 330" stroke="#8c3e1f" strokeWidth="5" fill="none" />
      <path d="M112 352 Q200 372 288 352" stroke="#8c3e1f" strokeWidth="3" fill="none" />
      {/* neck and rim */}
      <rect x="166" y="198" width="68" height="48" fill="#9c4527" />
      <ellipse cx="200" cy="198" rx="50" ry="13" fill="#c96a3f" />
      <ellipse cx="200" cy="198" rx="34" ry="7" fill="#3a1b10" />
      {/* a few water drops */}
      <path d="M300 170 q10 18 0 26 q-10 -8 0 -26 Z" fill="#9fd3e6" />
      <path d="M95 140 q8 14 0 20 q-8 -6 0 -20 Z" fill="#9fd3e6" opacity="0.8" />
    </svg>
  );
}
