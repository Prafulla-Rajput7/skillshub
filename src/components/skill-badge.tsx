import { cn } from "@/lib/utils";

type Proficiency = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

interface SkillBadgeProps {
  name: string;
  proficiency: Proficiency;
  yearsExperience: number | null;
  isInferred: boolean;
  inferredFrom: string | null;
}

const proficiencyStyle: Record<Proficiency, string> = {
  BEGINNER: "bg-slate-100 text-slate-700 border-slate-200",
  INTERMEDIATE: "bg-blue-50 text-blue-700 border-blue-200",
  ADVANCED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPERT: "bg-amber-50 text-amber-800 border-amber-200"
};

export function SkillBadge({
  name,
  proficiency,
  yearsExperience,
  isInferred,
  inferredFrom
}: SkillBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
        proficiencyStyle[proficiency],
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
