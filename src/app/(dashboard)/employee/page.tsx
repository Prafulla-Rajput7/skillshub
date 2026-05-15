import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";
import { ResumeUploader } from "@/components/resume-uploader";
import { ProfileDisplay } from "@/components/profile-display";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, FileText } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold">SkillsHub · Employee</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{session.user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Welcome, {session.user.name}</h2>
          <p className="text-slate-600 mt-1">
            {hasResume ? "Your AI-extracted profile" : "Upload your resume to build your profile"}
          </p>
        </div>

        {review && (
          <Card
            className={
              review.status === "APPROVED"
                ? "bg-emerald-50 border-emerald-200"
                : review.status === "REJECTED"
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
            }
          >
            <CardContent className="flex items-center gap-3 py-4">
              {review.status === "APPROVED" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {review.status === "REJECTED" && <XCircle className="w-5 h-5 text-red-600" />}
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
    </main>
  );
}
