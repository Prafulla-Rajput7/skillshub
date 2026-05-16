"use client";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  count: number;
  href: string;
  ariaLabel: string;
}

export function NotificationBell({ count, href, ariaLabel }: NotificationBellProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-slate-900 outline-none"
    >
      <Bell className="w-4.5 h-4.5 text-slate-600" />
      {count > 0 && (
        <span
          className={cn(
            "absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white",
            "bg-rose-500 ring-2 ring-white"
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
