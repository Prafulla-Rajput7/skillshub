import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SearchBar } from "@/components/search-bar";
import { StatCard } from "@/components/stat-card";
import { ActivityFeed } from "@/components/activity-feed";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, Users, Sparkles, Zap, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

const EXAMPLE_QUERIES = [
  "senior React engineer who built real-time apps",
  "Python ML expert with PyTorch experience",
  "Java backend with Kafka and microservices",
  "designer fluent in Figma and design systems"
];

export default async function HRDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const [pendingCount, approvedCount, totalSkills, recent] = await Promise.all([
    prisma.reviewQueue.count({ where: { status: "PENDING" } }),
    prisma.reviewQueue.count({ where: { status: "APPROVED" } }),
    prisma.skill.count(),
    prisma.reviewQueue.findMany({
      where: { reviewedAt: { not: null } },
      include: { profile: { include: { user: { select: { name: true } } } } },
      orderBy: { reviewedAt: "desc" },
      take: 5
    })
  ]);

  const activityItems = recent
    .filter((r) => r.reviewedAt)
    .map((r) => ({
      id: r.id,
      name: r.profile.name || r.profile.user.name,
      status: r.status,
      timestamp: r.reviewedAt!
    }));

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, {session.user.name}</h2>
          <p className="text-slate-600 mt-1">Find the right people — in plain English.</p>
        </div>

        <Card className="shadow-md relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6B1FD1] via-pink-500 via-amber-400 to-[#6B1FD1] animate-shimmer-slide" />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold">Search talent semantically</h3>
            </div>
            <SearchBar size="large" />
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs text-slate-500 self-center">Try:</span>
              {EXAMPLE_QUERIES.map((q) => (
                <a
                  key={q}
                  href={`/hr/search?q=${encodeURIComponent(q)}`}
                  className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
                >
                  {q}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Inbox />}
            label="Pending"
            value={pendingCount}
            description="awaiting review"
            href="/hr/review-queue"
            accent="amber"
          />
          <StatCard
            icon={<Users />}
            label="Approved"
            value={approvedCount}
            description="in directory"
            href="/hr/talent"
            accent="emerald"
          />
          <StatCard
            icon={<Zap />}
            label="Skills tracked"
            value={totalSkills}
            description="across all profiles"
            accent="blue"
          />
          <StatCard
            icon={<Sparkles />}
            label="AI extractions"
            value={approvedCount + pendingCount}
            description="resumes processed"
            accent="violet"
          />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-slate-500" />
              <h3 className="font-semibold">Recent activity</h3>
            </div>
            <ActivityFeed items={activityItems} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
