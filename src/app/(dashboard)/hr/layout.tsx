import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardNav } from "@/components/dashboard-nav";

export const dynamic = "force-dynamic";

const HR_TABS = [
  { href: "/hr", label: "Dashboard" },
  { href: "/hr/review-queue", label: "Review Queue" },
  { href: "/hr/talent", label: "Talent Directory" }
];

export default async function HRLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const pendingCount = await prisma.reviewQueue.count({ where: { status: "PENDING" } });

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav
        roleLabel="HR"
        role="HR"
        userName={session.user.name}
        userEmail={session.user.email}
        tabs={HR_TABS}
        notificationCount={pendingCount}
        notificationHref="/hr/review-queue"
        notificationAriaLabel={`${pendingCount} pending reviews`}
      />
      {children}
    </div>
  );
}
