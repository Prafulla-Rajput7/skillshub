import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "amber" | "emerald" | "blue" | "violet" | "slate";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  href?: string;
  accent?: Accent;
}

const accentStyles: Record<Accent, { iconWrap: string; iconColor: string }> = {
  amber: { iconWrap: "bg-amber-50", iconColor: "text-amber-600" },
  emerald: { iconWrap: "bg-emerald-50", iconColor: "text-emerald-600" },
  blue: { iconWrap: "bg-blue-50", iconColor: "text-blue-600" },
  violet: { iconWrap: "bg-violet-50", iconColor: "text-violet-600" },
  slate: { iconWrap: "bg-slate-100", iconColor: "text-slate-600" }
};

export function StatCard({ icon, label, value, description, href, accent = "slate" }: StatCardProps) {
  const a = accentStyles[accent];

  const inner = (
    <div className="bg-white border rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all h-full flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn("w-9 h-9 rounded-md flex items-center justify-center", a.iconWrap)}>
            <span className={cn(a.iconColor, "[&_svg]:w-4 [&_svg]:h-4")}>{icon}</span>
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        </div>
        <div className="text-3xl font-bold text-slate-900 leading-none">{value}</div>
        {description && <div className="text-xs text-slate-500 mt-1.5">{description}</div>}
      </div>
      {href && <ChevronRight className="w-4 h-4 text-slate-400 mt-1 shrink-0" />}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}
