import { cn } from "@/lib/utils";

type Proficiency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

interface SkillBadgeProps {
  name: string;
  proficiency: Proficiency;
  yearsExperience: number | null;
  isInferred: boolean;
  inferredFrom: string | null;
}

const CHIP_PALETTE = [
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "bg-pink-50 text-pink-700 border-pink-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-orange-50 text-orange-700 border-orange-200",
  "bg-amber-50 text-amber-800 border-amber-200",
  "bg-lime-50 text-lime-700 border-lime-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-cyan-50 text-cyan-700 border-cyan-200",
  "bg-sky-50 text-sky-700 border-sky-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200"
];

function hashIndex(name: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return Math.abs(h) % modulo;
}

export function SkillBadge({ name, proficiency, yearsExperience, isInferred, inferredFrom }: SkillBadgeProps) {
  const palette = CHIP_PALETTE[hashIndex(name, CHIP_PALETTE.length)];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
        palette,
        isInferred && "border-dashed"
      )}
      title={isInferred ? `Inferred from ${inferredFrom}` : `${proficiency.toLowerCase()}, ${yearsExperience}y`}
    >
      <span>{name}</span>
      <span className="opacity-50">·</span>
      <span className="opacity-75 capitalize">{proficiency.toLowerCase()}</span>
      {yearsExperience !== null && yearsExperience > 0 && (
        <>
          <span className="opacity-50">·</span>
          <span className="opacity-75">{yearsExperience}y</span>
        </>
      )}
      {isInferred && (
        <>
          <span className="opacity-50">·</span>
          <span className="opacity-75 italic">inferred</span>
        </>
      )}
    </div>
  );
}
