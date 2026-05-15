import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-medium">
          <Sparkles className="h-3 w-3" />
          AI-Powered Skills Intelligence
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
          Find the right people.<br />
          <span className="text-slate-500">In plain English.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          SkillsHub turns resumes into structured talent intelligence — and lets HR teams
          search by intent, not keywords.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
