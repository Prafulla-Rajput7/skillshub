import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResumeUploader } from "@/components/resume-uploader";
import { ProfileDisplay } from "@/components/profile-display";
import { ProfileJourney } from "@/components/profile-journey";
import { StatCard } from "@/components/stat-card";
import { AvatarInitials } from "@/components/avatar-initials";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, FileText, Sparkles, Briefcase, FolderGit2, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmployeeDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      skills: { orderBy: [{ isInferred: "asc" }, { name: "asc" }] },
      projects: { orderBy: { createdAt: "desc" } },
      reviewQueue: true
    }
  });

  const hasResume = !!profile?.resumeFileName;
  const review = profile?.reviewQueue;

  const stage = !hasResume
    ? "UPLOAD"
    : !review
    ? "EXTRACT"
    : review.status === "APPROVED"
    ? "ACTIVE"
    : "REVIEW";

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center gap-4">
          <AvatarInitials name={session.user.name} size="lg" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome, {session.user.name}</h2>
            <p className="text-slate-600 mt-1">
              {hasResume ? "Your AI-extracted profile" : "Upload your resume to build your profile"}
            </p>
          </div>
        </div>

        {review && (
          <Card
            className={
              review.status === "APPROVED"
                ? "bg-emerald-50 border-emerald-200"
                : review.status === "REJECTED"
                ? "bg-rose-50 border-rose-200"
                : "bg-amber-50 border-amber-200"
            }
          >
            <CardContent className="flex items-center gap-3 py-4">
              {review.status === "APPROVED" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {review.status === "REJECTED" && <XCircle className="w-5 h-5 text-rose-600" />}
              {review.status === "PENDING" && <Clock className="w-5 h-5 text-amber-600" />}
              <div className="text-sm">
                <p className="font-medium">
                  {review.status === "APPROVED" && "Profile approved — you're visible in the talent directory"}
                  {review.status === "REJECTED" && "Profile needs revision — please re-upload"}
                  {review.status === "PENDING" && "Profile pending HR review"}
                </p>
                {review.notes && <p className="text-slate-600 mt-1">Note: {review.notes}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {hasResume && <ProfileJourney currentStage={stage as "UPLOAD" | "EXTRACT" | "REVIEW" | "ACTIVE"} status={review?.status} />}

        {hasResume && profile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Sparkles />}
              label="Skills"
              value={profile.skills.length}
              description={`${profile.skills.filter((s) => s.isInferred).length} inferred`}
              accent="violet"
            />
            <StatCard
              icon={<FolderGit2 />}
              label="Projects"
              value={profile.projects.length}
              description="extracted"
              accent="blue"
            />
            <StatCard
              icon={<Briefcase />}
              label="Experience"
              value={profile.yearsExperience !== null ? `${profile.yearsExperience}+` : "—"}
              description="years"
              accent="emerald"
            />
            <StatCard
              icon={<Activity />}
              label="Status"
              value={review?.status === "APPROVED" ? "Live" : review?.status === "REJECTED" ? "Revise" : "Pending"}
              description="in directory"
              accent={review?.status === "APPROVED" ? "emerald" : review?.status === "REJECTED" ? "amber" : "amber"}
            />
          </div>
        )}

        {!hasResume ? (
          <ResumeUploader />
        ) : (
          <>
            <div className="flex items-center justify-between bg-white border rounded-md px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileText className="w-4 h-4" />
                <span>{profile?.resumeFileName}</span>
              </div>
              <ResumeUploader variant="compact" />
            </div>
            <ProfileDisplay
              name={profile.name || session.user.name}
              email={session.user.email}
              profile={{
                summary: profile.summary,
                location: profile.location,
                yearsExperience: profile.yearsExperience,
                skills: profile.skills,
                projects: profile.projects
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
