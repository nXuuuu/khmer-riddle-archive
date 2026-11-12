// Small line icons drawn as inline SVG (no icon library needed).
// Usage: <Icon name="flame" size={16} />. Colour follows the surrounding text.
const PATHS = {
  flame: "M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.6 2.5-4.6.2 1.7 1 2.6 2 3 0-3 0-5.7.5-8.4Z",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z",
  cross: "M6 6l12 12M18 6 6 18",
  leaf: "M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 7-7",
  check: "M5 12.5 10 17 19 7",
};

export default function Icon({ name, size = 18, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "-0.15em", flexShrink: 0, ...style }}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
