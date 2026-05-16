import { prisma } from "@/lib/prisma";
import { ProfileDisplay } from "@/components/profile-display";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TalentProfilePage({ params }: { params: Promise<{ profileId: string }> }) {
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

  if (!profile || profile.reviewQueue?.status !== "APPROVED") notFound();

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <Link href="/hr/talent" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to directory
        </Link>

        <ProfileDisplay
          name={profile.name || profile.user.name}
          email={profile.user.email}
          profile={{
            summary: profile.summary,
            location: profile.location,
            yearsExperience: profile.yearsExperience,
            skills: profile.skills,
            projects: profile.projects
          }}
        />
      </div>
    </>
  );
}
