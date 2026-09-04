import { promises as fs } from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    const pendingPath = path.join(process.cwd(), "data", "pendingRiddles.json");
    let pending = [];
    try {
      const file = await fs.readFile(pendingPath, "utf8");
      pending = JSON.parse(file);
    } catch (e) {
      // file may not exist yet
    }
    const entry = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    pending.push(entry);
    await fs.writeFile(pendingPath, JSON.stringify(pending, null, 2));
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Submission failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// GET returns the list of pending riddles
export async function GET() {
  const pendingPath = path.join(process.cwd(), "data", "pendingRiddles.json");
  try {
    const file = await fs.readFile(pendingPath, "utf8");
    const pending = JSON.parse(file);
    return new Response(JSON.stringify(pending), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    // If file missing or empty, return empty array
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
