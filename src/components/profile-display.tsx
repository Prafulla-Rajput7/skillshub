import { SkillBadge } from "@/components/skill-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  yearsExperience: number | null;
  isInferred: boolean;
  inferredFrom: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

interface ProfileDisplayProps {
  name: string;
  email: string;
  profile: {
    summary: string | null;
    location: string | null;
    yearsExperience: number | null;
    skills: Skill[];
    projects: Project[];
  };
}

export function ProfileDisplay({ name, email, profile }: ProfileDisplayProps) {
  const explicitSkills = profile.skills.filter((s) => !s.isInferred);
  const inferredSkills = profile.skills.filter((s) => s.isInferred);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{name}</CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-1">
            <span>{email}</span>
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {profile.location}
              </span>
            )}
            {profile.yearsExperience !== null && profile.yearsExperience > 0 && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> {profile.yearsExperience}+ years
              </span>
            )}
          </div>
        </CardHeader>
        {profile.summary && (
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{profile.summary}</p>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {explicitSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {explicitSkills.map((s) => (
                <SkillBadge key={s.id} {...s} />
              ))}
            </div>
          )}
          {inferredSkills.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                  Inferred skills ({inferredSkills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {inferredSkills.map((s) => (
                    <SkillBadge key={s.id} {...s} />
                  ))}
                </div>
              </div>
            </>
          )}
          {profile.skills.length === 0 && (
            <p className="text-sm text-slate-500">No skills extracted</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {profile.projects.map((p) => (
            <div key={p.id} className="border-l-2 border-slate-200 pl-4">
              <h4 className="font-medium">{p.title}</h4>
              <p className="text-sm text-slate-600 mt-1">{p.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.technologies.map((t, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          {profile.projects.length === 0 && (
            <p className="text-sm text-slate-500">No projects extracted</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
