"use client";

import { useState, useEffect } from "react";
import { RATINGS } from "@/lib/rating";
import { cn } from "@/lib/utils";

interface ProjectRatingProps {
  projectId: string;
  initialSum: number;
  initialCount: number;
}

function pluralVotes(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "голос";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "голоси";
  return "голосів";
}

export function ProjectRating({
  projectId,
  initialSum,
  initialCount,
}: ProjectRatingProps) {
  const [sum, setSum] = useState(initialSum);
  const [count, setCount] = useState(initialCount);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [hovering, setHovering] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`voted:${projectId}`);
    if (stored) setUserVote(Number(stored));
  }, [projectId]);

  async function vote(value: number) {
    if (userVote !== null || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (res.ok) {
        const data = await res.json();
        setSum(data.sum);
        setCount(data.count);
        setUserVote(value);
        localStorage.setItem(`voted:${projectId}`, String(value));
      }
    } finally {
      setLoading(false);
    }
  }

  const average = count > 0 ? sum / count : null;
  const displayValue = hovering ?? (average !== null ? Math.max(1, Math.min(5, Math.round(average))) : null);
  const displayRating = displayValue ? RATINGS[displayValue - 1] : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        {displayRating ? (
          <>
            <span className="text-5xl" aria-hidden>
              {displayRating.emoji}
            </span>
            <div>
              <p className="text-xl font-bold text-foreground">
                {displayRating.label}
              </p>
              {average !== null ? (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {average.toFixed(1)} / 5 &middot; {count}{" "}
                  {pluralVotes(count)}
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            Ще немає оцінок. Будьте першим!
          </p>
        )}
      </div>

      {userVote !== null ? (
        <p className="text-sm text-green-700 font-medium">
          ✓ Ви вже оцінили цей проєкт ({userVote} з 5)
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Оцініть цей проєкт:</p>
          <div className="flex gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                type="button"
                disabled={loading}
                onClick={() => vote(r.value)}
                onMouseEnter={() => setHovering(r.value)}
                onMouseLeave={() => setHovering(null)}
                title={r.label}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all",
                  "border-border hover:border-brand-navy hover:bg-surface",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-xs text-muted-foreground">{r.value}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
