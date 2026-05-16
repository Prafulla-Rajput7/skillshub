import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { AvatarInitials } from "@/components/avatar-initials";

interface ActivityItem {
  id: string;
  name: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  timestamp: Date;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-500">
        <Clock className="w-8 h-8 mx-auto opacity-30 mb-2" />
        No activity yet.
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 py-3">
          <AvatarInitials name={item.name} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="text-slate-500">
                {item.status === "APPROVED" && " was approved"}
                {item.status === "REJECTED" && " was rejected"}
                {item.status === "PENDING" && " submitted profile"}
              </span>
            </div>
            <div className="text-xs text-slate-400">{timeAgo(item.timestamp)}</div>
          </div>
          {item.status === "APPROVED" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
          {item.status === "REJECTED" && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
          {item.status === "PENDING" && <Clock className="w-4 h-4 text-amber-500 shrink-0" />}
        </li>
      ))}
    </ul>
  );
}
