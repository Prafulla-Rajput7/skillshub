import { rankProfiles } from "@/lib/llm";
import { prisma } from "@/lib/prisma";
import { SearchBar } from "@/components/search-bar";
import { MatchScoreRing } from "@/components/match-score-ring";
import { AvatarInitials } from "@/components/avatar-initials";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, Sparkles, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  let results: Awaited<ReturnType<typeof runSearch>> = { results: [], totalApproved: 0 };
  let totalApproved = 0;

  if (query) {
    const data = await runSearch(query);
    results = data;
    totalApproved = data.totalApproved;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <Link href="/hr" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <SearchBar defaultValue={query} size="large" />

        {!query && (
          <Card>
            <CardContent className="p-12 text-center text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Start by typing a query above.</p>
              <p className="text-xs mt-2">Try "senior React engineer", "Python ML expert", or "designer with prototyping experience"</p>
            </CardContent>
          </Card>
        )}

        {query && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                {results.results.length} match{results.results.length !== 1 ? "es" : ""} for <strong>"{query}"</strong> across {totalApproved} approved profile{totalApproved !== 1 ? "s" : ""}
              </span>
            </div>

            {results.results.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-slate-500">
                  <p>No strong matches found. Try a different query or broader terms.</p>
                </CardContent>
              </Card>
            ) : (
              results.results.map((r) => (
                <Link key={r.profile.id} href={`/hr/talent/${r.profile.id}`}>
                  <Card className="hover:border-slate-400 transition-colors cursor-pointer">
                    <CardContent className="p-5 flex gap-5 items-start">
                      <MatchScoreRing score={r.matchScore} />
                      <AvatarInitials name={r.profile.name} size="md" className="mt-0.5" />
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h3 className="font-semibold text-lg">{r.profile.name}</h3>
                          <span className="text-sm text-slate-500">{r.profile.email}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          {r.profile.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {r.profile.location}
                            </span>
                          )}
                          {r.profile.yearsExperience !== null && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" /> {r.profile.yearsExperience}+ years
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{r.reasoning}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {r.profile.topSkills.map((s) => (
                            <Badge key={s.id} variant="secondary" className="text-xs">
                              {s.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

async function runSearch(query: string) {
  const approved = await prisma.profile.findMany({
    where: { reviewQueue: { status: "APPROVED" } },
    include: {
      user: { select: { name: true, email: true } },
      skills: { orderBy: [{ isInferred: "asc" }, { name: "asc" }] },
      projects: { orderBy: { createdAt: "desc" } }
    },
    take: 50
  });

  if (approved.length === 0) return { results: [], totalApproved: 0 };

  const compact = approved.map((p) => ({
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

  const ranked = await rankProfiles(query, compact);
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
          topSkills: profile.skills.filter((s) => !s.isInferred).slice(0, 6)
        }
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return { results: enriched, totalApproved: approved.length };
}
