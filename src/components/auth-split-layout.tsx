import Link from "next/link";
import { Sparkles, Zap, Wand2, MessageSquare } from "lucide-react";

const FLOATING_CHIPS = [
  { name: "React", className: "top-[14%] left-[8%] animate-chip", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { name: "Python", className: "top-[8%] right-[12%] animate-chip-delay-2", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { name: "Figma", className: "top-[42%] left-[4%] animate-chip-delay-1", color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" },
  { name: "Kubernetes", className: "top-[60%] right-[6%] animate-chip-delay-3", color: "bg-sky-100 text-sky-700 border-sky-200" },
  { name: "TypeScript", className: "bottom-[18%] left-[12%] animate-chip-delay-2", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { name: "Spring Boot", className: "bottom-[8%] right-[16%] animate-chip animate-chip-delay-1", color: "bg-amber-100 text-amber-800 border-amber-200" }
];


export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex">
      <aside className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#4c0f8c] via-[#6B1FD1] to-[#a855f7] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[40rem] h-[40rem] rounded-full bg-pink-400 opacity-30 blur-3xl animate-blob" />
          <div className="absolute bottom-[-25%] right-[-15%] w-[36rem] h-[36rem] rounded-full bg-amber-300 opacity-25 blur-3xl animate-blob-delay-2" />
          <div className="absolute top-[40%] left-[30%] w-[24rem] h-[24rem] rounded-full bg-fuchsia-500 opacity-25 blur-3xl animate-blob-delay-4" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />

        {FLOATING_CHIPS.map((c) => (
          <div
            key={c.name}
            className={`absolute ${c.className} px-3 py-1.5 rounded-md text-xs font-medium border ${c.color} shadow-lg`}
            style={{ ["--rot" as string]: `${(c.name.length % 7) - 3}deg` }}
          >
            {c.name}
          </div>
        ))}

        <div className="relative z-10 flex flex-col p-10 w-full h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 w-fit shrink-0">
            <div className="w-9 h-9 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">SkillsHub</span>
          </Link>

          {/* Copy */}
          <div className="mt-8 space-y-4 max-w-xs shrink-0">
            <h2 className="text-2xl font-bold leading-tight tracking-tight">
              The right people,
              <br />
              <span className="text-pink-200">finally findable.</span>
            </h2>
            <ul className="space-y-2 text-sm text-white/85">
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3 h-3" />
                </div>
                <span>AI extracts skills, projects, and proficiency from any PDF.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Wand2 className="w-3 h-3" />
                </div>
                <span>Inference connects the dots — Next.js means React, Spring means Java.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-3 h-3" />
                </div>
                <span>Search like you talk. Get ranked matches with reasoning.</span>
              </li>
            </ul>
          </div>

          {/* Product preview card — in normal flow, below the copy */}
          <div className="mt-6 flex-1 flex items-start justify-center min-h-0">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl shadow-black/40 p-4 text-slate-900 ring-1 ring-white/30 w-[19rem]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  RS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">Rahul Sharma</div>
                  <div className="text-xs text-slate-500">Senior Full-Stack · Bangalore · 6+ yrs</div>
                </div>
                <div className="relative w-10 h-10 shrink-0">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" strokeWidth="4" fill="none" className="stroke-slate-100" />
                    <circle cx="28" cy="28" r="24" strokeWidth="4" fill="none" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * 0.06} strokeLinecap="round" className="stroke-emerald-500" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-600">94</div>
                </div>
              </div>
              <div className="mt-2.5 pt-2.5 border-t border-slate-100">
                <div className="flex flex-wrap gap-1">
                  {([
                    { name: "React", color: "bg-pink-50 text-pink-700 border-pink-200" },
                    { name: "Next.js", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                    { name: "TypeScript", color: "bg-sky-50 text-sky-700 border-sky-200" },
                    { name: "Socket.IO", color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                  ] as const).map((s) => (
                    <span key={s.name} className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${s.color}`}>{s.name}</span>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                  <Sparkles className="w-2.5 h-2.5 text-[#6B1FD1]" />
                  <span><span className="text-slate-700 font-medium">React</span> inferred from <span className="text-slate-700 font-medium">Next.js</span></span>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-600 italic leading-relaxed border-l-2 border-[#6B1FD1] pl-2">
                &ldquo;Expert in React (6 yrs), led real-time apps using Socket.IO with 200+ users.&rdquo;
              </div>
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-4 shrink-0 text-xs text-white/50">© SkillsHub — Prompt &amp; Pixels</p>
        </div>
      </aside>

      <section className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
