import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard-nav";

const EMPLOYEE_TABS = [{ href: "/employee", label: "My Profile" }];

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav
        roleLabel="Employee"
        role="EMPLOYEE"
        userName={session.user.name}
        userEmail={session.user.email}
        tabs={EMPLOYEE_TABS}
      />
      {children}
    </div>
  );
}
