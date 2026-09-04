import { promises as fs } from "fs";
import path from "path";

export async function DELETE(request, { params }) {
  const idx = parseInt(params.index, 10);
  const pendingPath = path.join(process.cwd(), "data", "pendingRiddles.json");
  try {
    const file = await fs.readFile(pendingPath, "utf8");
    const pending = JSON.parse(file);
    if (Number.isNaN(idx) || idx < 0 || idx >= pending.length) {
      return new Response(JSON.stringify({ error: "Invalid index" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    pending.splice(idx, 1);
    await fs.writeFile(pendingPath, JSON.stringify(pending, null, 2));
    return new Response(JSON.stringify({ status: "deleted" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    // file may not exist – treat as empty list
    return new Response(JSON.stringify({ error: "Deletion failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
