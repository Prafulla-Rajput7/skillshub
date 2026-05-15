import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function EmployeeDashboard() {
  const session = await getServerSession(authOptions);
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold">SkillsHub · Employee</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{session?.user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-2">Welcome, {session?.user.name}</h2>
        <p className="text-slate-600">Upload your resume to build your profile.</p>
        <p className="mt-8 text-sm text-slate-400">Resume upload shipping in Chunk 2.</p>
      </div>
    </main>
  );
}
