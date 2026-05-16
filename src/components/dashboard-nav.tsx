"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { NotificationBell } from "@/components/notification-bell";
import { cn } from "@/lib/utils";

interface NavTab {
  href: string;
  label: string;
}

interface DashboardNavProps {
  roleLabel: "HR" | "Employee";
  role: "HR" | "EMPLOYEE";
  userName: string;
  userEmail: string;
  tabs: NavTab[];
  notificationCount?: number;
  notificationHref?: string;
  notificationAriaLabel?: string;
}

export function DashboardNav({
  roleLabel,
  role,
  userName,
  userEmail,
  tabs,
  notificationCount,
  notificationHref,
  notificationAriaLabel
}: DashboardNavProps) {
  const pathname = usePathname();
  const homeHref = tabs[0]?.href || "/";

  function isActive(href: string) {
    if (pathname === href) return true;
    if (href !== homeHref && pathname.startsWith(href + "/")) return true;
    return false;
  }

  return (
    <header className="border-b bg-white/95 sticky top-0 z-20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-stretch">
        <Link href={homeHref} className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#6B1FD1] to-pink-500 flex items-center justify-center shadow-sm shadow-[#6B1FD1]/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">SkillsHub</span>
        </Link>

        <nav className="flex items-stretch ml-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center px-4 text-sm font-medium border-b-2 -mb-px transition-colors",
                isActive(tab.href)
                  ? "text-[#6B1FD1] border-[#6B1FD1]"
                  : "text-slate-500 hover:text-slate-900 border-transparent"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 pl-6 shrink-0">
          {notificationHref && (
            <NotificationBell
              count={notificationCount || 0}
              href={notificationHref}
              ariaLabel={notificationAriaLabel || "Notifications"}
            />
          )}
          <UserMenu name={userName} email={userEmail} role={role} />
        </div>
      </div>
    </header>
  );
}
