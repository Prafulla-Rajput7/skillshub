import { CheckCircle2, Circle, UploadCloud, Sparkles, ClipboardCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Stage = "UPLOAD" | "EXTRACT" | "REVIEW" | "ACTIVE";

interface ProfileJourneyProps {
  currentStage: Stage;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}

const STAGES: { id: Stage; label: string; icon: React.ReactNode }[] = [
  { id: "UPLOAD", label: "Resume uploaded", icon: <UploadCloud className="w-4 h-4" /> },
  { id: "EXTRACT", label: "AI extracted", icon: <Sparkles className="w-4 h-4" /> },
  { id: "REVIEW", label: "HR reviewed", icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: "ACTIVE", label: "Live in directory", icon: <Users className="w-4 h-4" /> }
];

export function ProfileJourney({ currentStage, status }: ProfileJourneyProps) {
  const currentIdx = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="bg-white border rounded-lg p-5">
      <h3 className="text-sm font-semibold mb-4">Profile Journey</h3>
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 -z-0" />
        <div
          className="absolute top-4 left-4 h-0.5 bg-emerald-500 -z-0 transition-all"
          style={{
            width: `calc(${(currentIdx / (STAGES.length - 1)) * 100}% - ${currentIdx === STAGES.length - 1 ? "0px" : "1rem"})`
          }}
        />

        {STAGES.map((stage, idx) => {
          const completed = idx < currentIdx || (idx === currentIdx && status === "APPROVED");
          const active = idx === currentIdx && status !== "APPROVED";
          const rejected = idx === currentIdx && status === "REJECTED";

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm",
                  completed
                    ? "bg-emerald-500"
                    : rejected
                    ? "bg-rose-500"
                    : active
                    ? "bg-amber-500 animate-pulse"
                    : "bg-slate-200 text-slate-400"
                )}
              >
                {completed ? <CheckCircle2 className="w-4 h-4" /> : stage.icon}
              </div>
              <div
                className={cn(
                  "text-[11px] font-medium text-center px-1",
                  completed || active ? "text-slate-900" : "text-slate-400"
                )}
              >
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
