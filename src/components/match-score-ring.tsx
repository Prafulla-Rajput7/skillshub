interface MatchScoreRingProps {
  score: number;
}

// Static class lookup — required for Tailwind's JIT to generate these classes.
// Do NOT compute these strings at runtime via .replace() etc. — Tailwind's
// scanner only picks up literal strings in source code.
const TIER_STYLES = {
  high: { text: "text-emerald-600", stroke: "stroke-emerald-600" },
  mid: { text: "text-blue-600", stroke: "stroke-blue-600" },
  low: { text: "text-amber-600", stroke: "stroke-amber-600" },
  weak: { text: "text-slate-500", stroke: "stroke-slate-500" }
} as const;

export function MatchScoreRing({ score }: MatchScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const tier =
    clamped >= 85 ? "high" : clamped >= 65 ? "mid" : clamped >= 45 ? "low" : "weak";
  const { text, stroke } = TIER_STYLES[tier];

  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={radius} strokeWidth="4" fill="none" className="stroke-slate-100" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${stroke} transition-all`}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center font-bold text-sm ${text}`}>
        {clamped}
      </div>
    </div>
  );
}
