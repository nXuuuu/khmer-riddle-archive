import NatureArt from "./illustrations/NatureArt.js";
import PlantArt from "./illustrations/PlantArt.js";
import ToolsArt from "./illustrations/ToolsArt.js";
import BodyArt from "./illustrations/BodyArt.js";
import FolkloreArt from "./illustrations/FolkloreArt.js";

// Category → illustration. Used only when an entry has no uploaded photo.
const ART = {
  "Nature & Animals": NatureArt,
  "Plants & Fruits": PlantArt,
  "Tools & Farming": ToolsArt,
  "Body & Daily Life": BodyArt,
  "Wisdom & Folklore": FolkloreArt,
};

// Turns an id like "seed-3" or a UUID into a small stable number (0–3),
// so riddles in the same category get different colours and mirror images.
function variantFor(id = "") {
  let sum = 0;
  for (const ch of String(id)) sum += ch.charCodeAt(0);
  return sum % 4;
}

// Shows the entry's photo from Supabase if it has one, otherwise the category illustration.
export default function RiddleVisual({ item, category, showTag = true }) {
  const cat = item?.category || category;

  if (item?.image_url) {
    return (
      <div className="mu-visual">
        <img src={item.image_url} alt="Riddle visual clue" loading="lazy" />
      </div>
    );
  }

  const Art = ART[cat] || FolkloreArt;
  const v = variantFor(item?.id || cat);
  return (
    <div className="mu-visual">
      {/* v 0–1: normal, v 2–3: mirrored. Each art file picks its colours from v. */}
      <div style={{ height: "100%", transform: v >= 2 ? "scaleX(-1)" : "none" }}>
        <Art variant={v} />
      </div>
      {showTag && <span className="mu-visual-tag">Illustration</span>}
    </div>
  );
}
