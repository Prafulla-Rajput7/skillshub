import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/pdf";
import { extractProfileFromResume } from "@/lib/gemini";
import { Proficiency } from "@prisma/client";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Only employees can upload resumes" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractTextFromPDF(buffer);

    if (resumeText.length < 100) {
      return NextResponse.json(
        { error: "Could not extract enough text from PDF. Make sure it's not a scanned image." },
        { status: 400 }
      );
    }

    const extracted = await extractProfileFromResume(resumeText);

    let profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });
    if (!profile) {
      profile = await prisma.profile.create({ data: { userId: session.user.id } });
    }

    // Wipe existing data for re-upload
    await prisma.skill.deleteMany({ where: { profileId: profile.id } });
    await prisma.project.deleteMany({ where: { profileId: profile.id } });

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        summary: extracted.summary,
        location: extracted.location || null,
        availability: "Available",
        yearsExperience: Math.round(extracted.yearsExperience),
        resumeText,
        resumeFileName: file.name,
        skills: {
          create: extracted.skills.map((s) => ({
            name: s.name,
            proficiency: s.proficiency as Proficiency,
            yearsExperience: Math.round(s.yearsExperience),
            isInferred: s.isInferred,
            inferredFrom: s.inferredFrom
          }))
        },
        projects: {
          create: extracted.projects.map((p) => ({
            title: p.title,
            description: p.description,
            technologies: p.technologies
          }))
        }
      }
    });

    await prisma.reviewQueue.upsert({
      where: { profileId: profile.id },
      create: { profileId: profile.id, status: "PENDING" },
      update: {
        status: "PENDING",
        submittedAt: new Date(),
        reviewedAt: null,
        reviewedBy: null,
        notes: null
      }
    });

    return NextResponse.json({
      success: true,
      profileId: profile.id,
      skillsCount: extracted.skills.length,
      projectsCount: extracted.projects.length
    });
  } catch (err) {
    console.error("Resume upload error:", err);
    const message = err instanceof Error ? err.message : "Failed to process resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
