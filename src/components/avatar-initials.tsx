import { cn } from "@/lib/utils";

interface AvatarInitialsProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  xs: "w-7 h-7 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl"
};

// 8 hand-picked gradients — deterministic by name hash
const GRADIENTS = [
  "from-amber-400 to-rose-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-pink-400 to-rose-500",
  "from-[#6B1FD1] to-purple-400",
  "from-cyan-400 to-blue-500",
  "from-fuchsia-400 to-pink-500"
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AvatarInitials({ name, size = "md", className }: AvatarInitialsProps) {
  const gradient = GRADIENTS[hash(name) % GRADIENTS.length];
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br text-white font-semibold flex items-center justify-center shrink-0 shadow-sm",
        gradient,
        sizeStyles[size],
        className
      )}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
