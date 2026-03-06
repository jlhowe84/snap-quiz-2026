import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export interface ScoreEntry {
  name: string;
  score: number;
  total: number;
  timeSeconds: number;
  timestamp: number;
}

const SCORES_KEY = "snap-quiz-scores-2026";

// GET: Fetch all scores (for leaderboard)
export async function GET() {
  try {
    const scores: ScoreEntry[] = (await kv.get<ScoreEntry[]>(SCORES_KEY)) || [];
    // Sort by score desc, then by time asc (faster = better)
    scores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSeconds - b.timeSeconds;
    });
    return NextResponse.json({ scores });
  } catch {
    // If KV is not set up, return empty
    return NextResponse.json({ scores: [], error: "KV not configured" });
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

    const scores: ScoreEntry[] =
      (await kv.get<ScoreEntry[]>(SCORES_KEY)) || [];
    scores.push(entry);
    await kv.set(SCORES_KEY, scores);

    return NextResponse.json({ success: true, entry });
  } catch {
    return NextResponse.json(
      { error: "Failed to save score. Is Vercel KV configured?" },
      { status: 500 }
    );
  }
}

// DELETE: Clear all scores (admin use)
export async function DELETE() {
  try {
    await kv.set(SCORES_KEY, []);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to clear" }, { status: 500 });
  }
}
