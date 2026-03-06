import { createClient } from "redis";
import { NextRequest, NextResponse } from "next/server";

export interface ScoreEntry {
  name: string;
  score: number;
  total: number;
  timeSeconds: number;
  timestamp: number;
}

const SCORES_KEY = "snap-quiz-scores-2026";

async function withRedis<T>(fn: (client: ReturnType<typeof createClient>) => Promise<T>): Promise<T> {
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.disconnect();
  }
}

// GET: Fetch all scores (for leaderboard)
export async function GET() {
  try {
    const scores = await withRedis(async (client) => {
      const data = await client.get(SCORES_KEY);
      return data ? (JSON.parse(data) as ScoreEntry[]) : [];
    });
    // Sort by score desc, then by time asc (faster = better)
    scores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSeconds - b.timeSeconds;
    });
    return NextResponse.json({ scores });
  } catch (err) {
    console.error("GET /api/scores error:", err);
    return NextResponse.json({ scores: [], error: "Redis not configured" });
  }
}

// POST: Submit a score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, score, total, timeSeconds } = body;

    if (!name || score === undefined || !total || !timeSeconds) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const entry: ScoreEntry = {
      name: String(name).slice(0, 30),
      score: Number(score),
      total: Number(total),
      timeSeconds: Number(timeSeconds),
      timestamp: Date.now(),
    };

    await withRedis(async (client) => {
      const data = await client.get(SCORES_KEY);
      const scores: ScoreEntry[] = data ? JSON.parse(data) : [];
      scores.push(entry);
      await client.set(SCORES_KEY, JSON.stringify(scores));
    });

    return NextResponse.json({ success: true, entry });
  } catch (err) {
    console.error("POST /api/scores error:", err);
    return NextResponse.json(
      { error: "Failed to save score. Is REDIS_URL configured?" },
      { status: 500 }
    );
  }
}

// DELETE: Clear all scores (admin use)
export async function DELETE() {
  try {
    await withRedis(async (client) => {
      await client.set(SCORES_KEY, JSON.stringify([]));
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/scores error:", err);
    return NextResponse.json({ error: "Failed to clear" }, { status: 500 });
  }
}
