import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReviewQueuePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const queue = await prisma.reviewQueue.findMany({
    where: { status: "PENDING" },
    include: {
      profile: {
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { skills: true, projects: true } }
        }
      }
    },
    orderBy: { submittedAt: "asc" }
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold">SkillsHub · HR</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{session.user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        <Link href="/hr" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <div>
          <h2 className="text-3xl font-bold">Review Queue</h2>
          <p className="text-slate-600 mt-1">
            {queue.length} profile{queue.length !== 1 ? "s" : ""} pending
          </p>
        </div>

        {queue.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No profiles to review right now.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {queue.map((item) => (
              <Link key={item.id} href={`/hr/review-queue/${item.profileId}`}>
                <Card className="hover:border-slate-400 transition-colors cursor-pointer">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{item.profile.name || item.profile.user.name}</h3>
                      <p className="text-sm text-slate-600">{item.profile.user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{item.profile._count.skills} skills</Badge>
                        <Badge variant="secondary">{item.profile._count.projects} projects</Badge>
                        {item.profile.yearsExperience !== null && (
                          <Badge variant="secondary">{item.profile.yearsExperience}y experience</Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
