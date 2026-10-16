"use client";

/**
 * CuratorHeritageArtifact — Pure SVG/CSS Heritage Emblem representing
 * the ancient Khmer palm-leaf manuscript tradition (ស្លឹករឹត) and ancestral wisdom.
 * Zero external stock photos; 100% vector-rendered, responsive, and theme-adaptive.
 */
export default function CuratorHeritageArtifact() {
  return (
    <div className="vt-heritage-artifact" role="img" aria-label="Ancient Khmer Celestial Manuscript Emblem">
      <svg
        className="vt-heritage-svg"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="92" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="82" stroke="var(--border-accent)" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="100" cy="100" r="74" stroke="var(--accent)" strokeWidth="0.75" strokeOpacity="0.35" />
        
        {/* Sacred Geometry 8-Pointed Celestial Star */}
        <polygon
          points="100,32 118,82 168,100 118,118 100,168 82,118 32,100 82,82"
          stroke="var(--accent)"
          strokeWidth="1.25"
          fill="rgba(223, 183, 92, 0.05)"
        />
        <polygon
          points="100,46 114,86 154,100 114,114 100,154 86,114 46,100 86,86"
          stroke="var(--border-accent)"
          strokeWidth="0.75"
          fill="rgba(34, 197, 94, 0.04)"
          transform="rotate(22.5 100 100)"
        />

        {/* Outer Constellation Orbit Nodes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x = 100 + Math.cos(rad) * 82;
          const y = 100 + Math.sin(rad) * 82;
          return (
            <circle key={deg} cx={x} cy={y} r="2.5" fill="var(--accent)" opacity="0.85" />
          );
        })}

        {/* Central Lotus Emblem & Heritage Inscription */}
        <circle cx="100" cy="100" r="34" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="28" stroke="var(--border-accent)" strokeWidth="0.5" strokeDasharray="2 2" />
        
        <text
          x="100"
          y="96"
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="14"
          fontWeight="bold"
          fontFamily="var(--font-heading)"
        >
          ពាក្យ
        </text>
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="13"
          fontWeight="bold"
          fontFamily="var(--font-heading)"
        >
          បណ្តៅ
        </text>
      </svg>

      <span className="vt-heritage-caption">PALM LEAF MANUSCRIPT · ស្លឹករឹតបុរាណ</span>
      <span className="vt-heritage-subcaption">« កេរដំណែលដូនតា » · Oral Wisdom Archive</span>
    </div>
  );
}
