"use client";

import { useState, useCallback, useEffect } from "react";
import { questions as allQuestions, Question } from "./lib/questions";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const [screen, setScreen] = useState<"start" | "quiz" | "results">("start");
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startQuiz = useCallback(() => {
    if (!name.trim()) return;
    setQuestions(shuffle(allQuestions));
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setStartTime(Date.now());
    setSubmitted(false);
    setScreen("quiz");
  }, [name]);

  const selectAnswer = useCallback(
    (idx: number) => {
      if (answered) return;
      setSelected(idx);
      setAnswered(true);
      if (idx === questions[currentQ].correct) {
        setScore((s) => s + 1);
      }
    },
    [answered, questions, currentQ]
  );

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      const e = Math.round((Date.now() - startTime) / 1000);
      setElapsed(e);
      setScreen("results");
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentQ, questions.length, startTime]);

  // Submit score when results screen appears
  useEffect(() => {
    if (screen === "results" && !submitted && !submitting) {
      setSubmitting(true);
      fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          score,
          total: questions.length,
          timeSeconds: elapsed,
        }),
      })
        .then(() => setSubmitted(true))
        .catch(() => setSubmitted(true)) // don't block on error
        .finally(() => setSubmitting(false));
    }
  }, [screen, submitted, submitting, name, score, questions.length, elapsed]);

  const letters = ["A", "B", "C", "D"];
  const q = questions[currentQ];

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const pct = questions.length > 0 ? score / questions.length : 0;

  let resultMsg = "";
  let resultDetail = "";
  if (pct >= 0.93) {
    resultMsg = "SNAP MVP!";
    resultDetail = `Perfect or near-perfect! You really know your stuff. Completed in ${mins}m ${secs}s.`;
  } else if (pct >= 0.73) {
    resultMsg = "Great Job!";
    resultDetail = `Solid knowledge of SNAP procedures. Review the ones you missed. Time: ${mins}m ${secs}s.`;
  } else if (pct >= 0.53) {
    resultMsg = "Getting There!";
    resultDetail = `Good foundation, but review the handbook before your first shoot. Time: ${mins}m ${secs}s.`;
  } else {
    resultMsg = "Study Up!";
    resultDetail = `Take some time to review the SNAP Staff Handbook. You've got this! Time: ${mins}m ${secs}s.`;
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="max-w-[500px] mx-auto w-full px-4 py-4 flex flex-col flex-1">
        {/* ── START SCREEN ── */}
        {screen === "start" && (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-5 animate-fade-in">
            <h1 className="text-5xl font-black text-[var(--color-snap-red)] tracking-wide">
              SNAP!
            </h1>
            <h2 className="text-3xl font-black text-white">
              2026 Spring Quiz
            </h2>
            <p className="text-[#bbb] text-[15px] max-w-[340px] leading-relaxed">
              Test your knowledge of SNAP photo day procedures, the new Check-In
              App, and more. 15 questions. Let&apos;s see what you&apos;ve got!
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startQuiz()}
              placeholder="Your Name"
              maxLength={30}
              autoComplete="off"
              className="bg-[var(--color-dark-bg2)] border-2 border-[#444] text-white text-lg px-5 py-3.5 rounded-xl w-full max-w-[300px] text-center focus:border-[var(--color-snap-red)] focus:outline-none transition-colors placeholder:text-[#666]"
            />
            <button
              onClick={startQuiz}
              disabled={!name.trim()}
              className="bg-[var(--color-snap-red)] text-white font-bold text-[17px] px-8 py-3.5 rounded-xl uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition-transform"
            >
              LET&apos;S GO
            </button>
          </div>
        )}

        {/* ── QUIZ SCREEN ── */}
        {screen === "quiz" && q && (
          <div className="flex flex-col flex-1 animate-fade-in">
            {/* Header */}
            <div className="text-center py-2">
              <h1 className="text-2xl font-black text-[var(--color-snap-red)]">
                SNAP!
              </h1>
              <div className="text-[13px] text-[#888]">{name}</div>
            </div>

            {/* Progress */}
            <div className="text-right text-xs text-[#888] mb-1">
              {currentQ + 1} / {questions.length}
            </div>
            <div className="bg-[var(--color-dark-bg2)] rounded-xl h-2.5 mb-3 overflow-hidden">
              <div
                className="h-full rounded-xl transition-all duration-400"
                style={{
                  width: `${(currentQ / questions.length) * 100}%`,
                  background: "linear-gradient(90deg, #E63946, #E8A838)",
                }}
              />
            </div>

            {/* Question card */}
            <div className="bg-[var(--color-dark-bg2)] rounded-2xl p-5 flex-1 flex flex-col">
              <div className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-gold)] mb-2">
                {q.category}
              </div>
              <div className="text-lg font-bold leading-snug mb-4">
                {q.q}
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2.5 flex-1">
                {q.options.map((opt, i) => {
                  let cls =
                    "bg-[var(--color-dark-bg)] border-2 border-[#333] rounded-xl px-4 py-3.5 text-[15px] text-[#ddd] cursor-pointer transition-all flex items-center gap-3 w-full text-left font-normal hover:border-[#555] hover:bg-[#252548]";
                  let letterCls =
                    "min-w-[30px] h-[30px] rounded-lg bg-[#333] flex items-center justify-center font-extrabold text-sm text-[#aaa] shrink-0";

                  if (answered) {
                    if (i === q.correct) {
                      cls =
                        "bg-[#0f2a1a] border-2 border-[var(--color-ok-green)] rounded-xl px-4 py-3.5 text-[15px] text-[#ddd] flex items-center gap-3 w-full text-left font-normal animate-pop";
                      letterCls =
                        "min-w-[30px] h-[30px] rounded-lg bg-[var(--color-ok-green)] flex items-center justify-center font-extrabold text-sm text-white shrink-0";
                    } else if (i === selected) {
                      cls =
                        "bg-[#2a0f0f] border-2 border-[var(--color-wrong-red)] rounded-xl px-4 py-3.5 text-[15px] text-[#ddd] flex items-center gap-3 w-full text-left font-normal opacity-70";
                      letterCls =
                        "min-w-[30px] h-[30px] rounded-lg bg-[var(--color-wrong-red)] flex items-center justify-center font-extrabold text-sm text-white shrink-0";
                    } else {
                      cls += " opacity-40 pointer-events-none";
                    }
                  } else if (i === selected) {
                    cls =
                      "bg-[#2a1a2e] border-2 border-[var(--color-snap-red)] rounded-xl px-4 py-3.5 text-[15px] text-[#ddd] flex items-center gap-3 w-full text-left font-normal";
                    letterCls =
                      "min-w-[30px] h-[30px] rounded-lg bg-[var(--color-snap-red)] flex items-center justify-center font-extrabold text-sm text-white shrink-0";
                  }

                  return (
                    <button
                      key={i}
                      className={cls}
                      onClick={() => selectAnswer(i)}
                      disabled={answered}
                    >
                      <span className={letterCls}>{letters[i]}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {answered && (
                <div
                  className={`mt-3 p-3 rounded-xl text-sm leading-relaxed animate-fade-in ${
                    selected === q.correct
                      ? "bg-[#0f2a1a] border border-[var(--color-ok-green)] text-[#86efac]"
                      : "bg-[#2a0f0f] border border-[var(--color-wrong-red)] text-[#fca5a5]"
                  }`}
                >
                  {selected === q.correct ? "Correct! " : "Not quite. "}
                  {q.explanation}
                </div>
              )}
            </div>

            {/* Next button */}
            {answered && (
              <div className="py-3 animate-fade-in">
                <button
                  onClick={nextQuestion}
                  className="bg-[var(--color-snap-red)] text-white font-bold text-[17px] w-full py-3.5 rounded-xl uppercase tracking-wider active:scale-[0.97] transition-transform"
                >
                  {currentQ + 1 >= questions.length ? "SEE RESULTS" : "NEXT"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── RESULTS SCREEN ── */}
        {screen === "results" && (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 animate-fade-in">
            <h1 className="text-4xl font-black text-[var(--color-snap-red)]">
              SNAP!
            </h1>

            {/* Score circle */}
            <div className="w-[150px] h-[150px] rounded-full border-[6px] border-[var(--color-snap-red)] flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-[var(--color-snap-red)]">
                {score}
              </span>
              <span className="text-xs text-[#888] uppercase">
                out of {questions.length}
              </span>
            </div>

            <div className="text-2xl font-extrabold text-[var(--color-gold)]">
              {resultMsg}
            </div>
            <div className="text-sm text-[#aaa] max-w-[320px] leading-relaxed">
              {resultDetail}
            </div>

            {submitting && (
              <div className="text-xs text-[#888]">Submitting score...</div>
            )}
            {submitted && (
              <div className="text-xs text-[var(--color-ok-green)]">
                Score recorded!
              </div>
            )}

            <div className="text-sm text-[#888]">{name}</div>

            <div className="flex flex-col gap-3 w-full max-w-[300px]">
              <a
                href="/leaderboard"
                className="bg-[var(--color-gold)] text-[var(--color-dark-bg)] font-bold text-[15px] px-6 py-3 rounded-xl uppercase tracking-wider text-center block"
              >
                VIEW LEADERBOARD
              </a>
              <button
                onClick={() => {
                  setScreen("start");
                  setName("");
                }}
                className="bg-[var(--color-dark-bg2)] text-[var(--color-gold)] font-bold text-[15px] px-6 py-3 rounded-xl border-2 border-[var(--color-gold)] uppercase tracking-wider"
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
