import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Users, Inbox, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HRDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const [pendingCount, approvedCount] = await Promise.all([
    prisma.reviewQueue.count({ where: { status: "PENDING" } }),
    prisma.reviewQueue.count({ where: { status: "APPROVED" } })
  ]);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold">SkillsHub · HR</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{session.user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Welcome, {session.user.name}</h2>
          <p className="text-slate-600 mt-1">Search, review profiles, manage the talent directory.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/hr/review-queue">
            <Card className="hover:border-slate-400 transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold">Review Queue</h3>
                  </div>
                  <p className="text-3xl font-bold mt-2">{pendingCount}</p>
                  <p className="text-sm text-slate-500 mt-1">profiles pending review</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold">Approved Profiles</h3>
                </div>
                <p className="text-3xl font-bold mt-2">{approvedCount}</p>
                <p className="text-sm text-slate-500 mt-1">in the talent directory</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Natural language search shipping in Chunk 3.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
