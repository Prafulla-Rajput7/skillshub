import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Wand2, Search, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-[#6B1FD1] opacity-20 blur-3xl animate-blob" />
        <div className="absolute top-[20%] right-[-15%] w-[36rem] h-[36rem] rounded-full bg-pink-400 opacity-20 blur-3xl animate-blob-delay-2" />
        <div className="absolute bottom-[-15%] left-[20%] w-[32rem] h-[32rem] rounded-full bg-amber-300 opacity-20 blur-3xl animate-blob-delay-4" />
      </div>

      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#6B1FD1] to-pink-500 flex items-center justify-center shadow-md shadow-[#6B1FD1]/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">SkillsHub</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">
            Login
          </Link>
          <Button asChild className="shadow-md shadow-[#6B1FD1]/30">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#6B1FD1]/20 text-[#6B1FD1] text-xs font-semibold shadow-sm">
          <Sparkles className="h-3 w-3" />
          AI-Powered Skills Intelligence
        </div>
        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.05]">
          Hire by <span className="bg-gradient-to-r from-[#6B1FD1] to-pink-500 bg-clip-text text-transparent">intent</span>.
          <br />
          Not keywords.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          SkillsHub reads every resume, <span className="text-slate-900 font-medium">infers what&apos;s adjacent</span>,
          and ranks candidates with plain-English reasoning. The right people, finally findable.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg" className="text-base px-6 shadow-lg shadow-[#6B1FD1]/30">
            <Link href="/signup">
              Get Started <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base px-6">
            <Link href="/login">I have an account</Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Free to try</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> No credit card</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#6B1FD1]" /> Built on Llama 3.3</span>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<FileText className="w-5 h-5" />}
            iconBg="bg-violet-100 text-[#6B1FD1]"
            title="Resumes, decoded"
            description="Drop a PDF. We extract every skill, project, and proficiency level into structured data — automatically."
          />
          <FeatureCard
            icon={<Wand2 className="w-5 h-5" />}
            iconBg="bg-pink-100 text-pink-600"
            title="Skills that aren&apos;t on the page"
            description="Has Next.js? They know React. Spring Boot? They know Java. Our inference engine connects the dots."
          />
          <FeatureCard
            icon={<Search className="w-5 h-5" />}
            iconBg="bg-amber-100 text-amber-700"
            title="Search like you talk"
            description={'Type "senior React engineer who built real-time apps." Get ranked matches with reasoning — in seconds.'}
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, iconBg, title, description }: { icon: React.ReactNode; iconBg: string; title: string; description: string }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-5 hover:border-[#6B1FD1]/30 hover:shadow-lg hover:shadow-[#6B1FD1]/10 transition-all">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
