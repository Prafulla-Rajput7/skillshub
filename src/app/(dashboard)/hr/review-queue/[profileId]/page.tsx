import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";
import { ProfileDisplay } from "@/components/profile-display";
import { ReviewActions } from "@/components/review-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReviewProfilePage({
  params
}: {
  params: Promise<{ profileId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const { profileId } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      user: { select: { name: true, email: true } },
      skills: { orderBy: [{ isInferred: "asc" }, { name: "asc" }] },
      projects: { orderBy: { createdAt: "desc" } },
      reviewQueue: true
    }
  });

  if (!profile) notFound();

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
        <Link
          href="/hr/review-queue"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to queue
        </Link>

        <ProfileDisplay
          name={profile.user.name}
          email={profile.user.email}
          profile={{
            summary: profile.summary,
            location: profile.location,
            yearsExperience: profile.yearsExperience,
            skills: profile.skills,
            projects: profile.projects
          }}
        />

        {profile.reviewQueue?.status === "PENDING" && <ReviewActions profileId={profile.id} />}
      </div>
    </main>
  );
}
