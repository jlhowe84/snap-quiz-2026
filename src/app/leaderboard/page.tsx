"use client";

import { useState, useEffect, useCallback } from "react";

interface ScoreEntry {
  name: string;
  score: number;
  total: number;
  timeSeconds: number;
  timestamp: number;
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(() => {
    fetch("/api/scores")
      .then((r) => r.json())
      .then((data) => {
        setScores(data.scores || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchScores();
    // Auto-refresh every 5 seconds for live updates
    const interval = setInterval(fetchScores, 5000);
    return () => clearInterval(interval);
  }, [fetchScores]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const getMedal = (rank: number) => {
    if (rank === 0) return "\u{1F947}";
    if (rank === 1) return "\u{1F948}";
    if (rank === 2) return "\u{1F949}";
    return "";
  };

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="max-w-[800px] mx-auto w-full px-4 py-6 flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-[var(--color-snap-red)] tracking-wide mb-1">
            SNAP!
          </h1>
          <h2 className="text-3xl font-black text-white mb-1">
            QUIZ LEADERBOARD
          </h2>
          <p className="text-sm text-[#888]">
            2026 Spring Meeting &bull; Live results
          </p>
          <div className="mt-2 text-xs text-[#555]">
            Auto-refreshes every 5 seconds
          </div>
        </div>

        {loading ? (
          <div className="text-center text-[#888] text-lg py-20">
            Loading scores...
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">&#x1F3AF;</div>
            <div className="text-xl text-[#888]">No scores yet!</div>
            <div className="text-sm text-[#555] mt-2">
              Waiting for quiz submissions...
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table header */}
            <div className="grid grid-cols-[50px_1fr_80px_80px] gap-2 px-4 text-xs font-bold uppercase tracking-wider text-[#888]">
              <div>Rank</div>
              <div>Name</div>
              <div className="text-center">Score</div>
              <div className="text-center">Time</div>
            </div>

            {scores.map((entry, i) => {
              const isTop3 = i < 3;
              const pct = entry.total > 0 ? entry.score / entry.total : 0;
              let barColor = "#E63946";
              if (pct >= 0.93) barColor = "#22c55e";
              else if (pct >= 0.73) barColor = "#E8A838";

              return (
                <div
                  key={`${entry.name}-${entry.timestamp}`}
                  className={`grid grid-cols-[50px_1fr_80px_80px] gap-2 items-center px-4 py-3 rounded-xl transition-all ${
                    isTop3
                      ? "bg-[var(--color-dark-bg2)] border border-[var(--color-snap-red)]/30"
                      : "bg-[var(--color-dark-bg2)]/60"
                  }`}
                >
                  {/* Rank */}
                  <div className="text-center">
                    {getMedal(i) ? (
                      <span className="text-2xl">{getMedal(i)}</span>
                    ) : (
                      <span className="text-lg font-bold text-[#888]">
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Name + score bar */}
                  <div>
                    <div
                      className={`font-bold text-base ${
                        isTop3 ? "text-white" : "text-[#ccc]"
                      }`}
                    >
                      {entry.name}
                    </div>
                    <div className="mt-1 bg-[#333] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct * 100}%`,
                          background: barColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <span
                      className="text-xl font-black"
                      style={{ color: barColor }}
                    >
                      {entry.score}
                    </span>
                    <span className="text-xs text-[#888]">
                      /{entry.total}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="text-center text-sm text-[#888] font-mono">
                    {formatTime(entry.timeSeconds)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-[#555]">
          {scores.length} score{scores.length !== 1 ? "s" : ""} submitted
        </div>
      </div>
    </div>
  );
}
