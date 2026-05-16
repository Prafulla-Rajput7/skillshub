import { prisma } from "@/lib/prisma";
import { SearchBar } from "@/components/search-bar";
import { AvatarInitials } from "@/components/avatar-initials";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TalentDirectory() {
  const approved = await prisma.profile.findMany({
    where: { reviewQueue: { status: "APPROVED" } },
    include: {
      user: { select: { name: true, email: true } },
      skills: { where: { isInferred: false }, take: 5, orderBy: { name: "asc" } },
      _count: { select: { skills: true, projects: true } }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <Link href="/hr" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Link>

        <div>
          <h2 className="text-3xl font-bold">Talent Directory</h2>
          <p className="text-slate-600 mt-1">{approved.length} approved profile{approved.length !== 1 ? "s" : ""}</p>
        </div>

        <SearchBar size="large" />

        {approved.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No approved profiles yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.map((p) => (
              <Link key={p.id} href={`/hr/talent/${p.id}`}>
                <Card className="hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer h-full">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <AvatarInitials name={p.name || p.user.name} size="md" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate">{p.name || p.user.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{p.user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      {p.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {p.location}
                        </span>
                      )}
                      {p.yearsExperience !== null && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {p.yearsExperience}+ yrs
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.skills.map((s) => (
                        <Badge key={s.id} variant="secondary" className="text-xs">
                          {s.name}
                        </Badge>
                      ))}
                      {p._count.skills > p.skills.length && (
                        <Badge variant="outline" className="text-xs">
                          +{p._count.skills - p.skills.length} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
