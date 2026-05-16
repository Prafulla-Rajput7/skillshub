import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rankProfiles } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "HR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const query = String(body?.query || "").trim();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }
    if (query.length > 500) {
      return NextResponse.json({ error: "Query too long (max 500 chars)" }, { status: 400 });
    }

    // Fetch all approved profiles with skills and projects
    const approved = await prisma.profile.findMany({
      where: { reviewQueue: { status: "APPROVED" } },
      include: {
        user: { select: { name: true, email: true } },
        skills: { orderBy: [{ isInferred: "asc" }, { name: "asc" }] },
        projects: { orderBy: { createdAt: "desc" } }
      },
      take: 50
    });

    if (approved.length === 0) {
      return NextResponse.json({ query, results: [] });
    }

    const compactProfiles = approved.map((p) => ({
      id: p.id,
      name: p.name || p.user.name,
      summary: p.summary,
      location: p.location,
      yearsExperience: p.yearsExperience,
      skills: p.skills.map((s) => ({
        name: s.name,
        proficiency: s.proficiency,
        yearsExperience: s.yearsExperience,
        isInferred: s.isInferred
      })),
      projects: p.projects.map((pr) => ({
        title: pr.title,
        description: pr.description,
        technologies: pr.technologies
      }))
    }));

    const ranked = await rankProfiles(query, compactProfiles);

    // Attach full profile data to each result for the UI
    const profileMap = new Map(approved.map((p) => [p.id, p]));
    const enriched = ranked.results
      .map((r) => {
        const profile = profileMap.get(r.profileId);
        if (!profile) return null;
        return {
          matchScore: r.matchScore,
          reasoning: r.reasoning,
          profile: {
            id: profile.id,
            name: profile.name || profile.user.name,
            email: profile.user.email,
            summary: profile.summary,
            location: profile.location,
            yearsExperience: profile.yearsExperience,
            skills: profile.skills,
            topSkills: profile.skills.filter((s) => !s.isInferred).slice(0, 6)
          }
        };
      })
      .filter((r) => r !== null);

    return NextResponse.json({ query, results: enriched });
  } catch (err) {
    console.error("Search error:", err);
    const msg = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
