import { getDb } from '../../../lib/db.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = getDb();
    
    // Create the riddles table
    await sql`
      CREATE TABLE IF NOT EXISTS custom_riddles (
        id VARCHAR(255) PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        question TEXT NOT NULL,
        questionHint TEXT,
        answer TEXT NOT NULL,
        answerEn TEXT NOT NULL,
        explanation TEXT,
        explanationKm TEXT,
        source VARCHAR(255),
        sourceEn VARCHAR(255),
        contributor VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return new Response(JSON.stringify({ status: "success", message: "Database table created successfully!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: "error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
