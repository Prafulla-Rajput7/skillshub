"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSplitLayout } from "@/components/auth-split-layout";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "HR" | "EMPLOYEE";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("EMPLOYEE");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      role
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "Signup failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false
    });
    toast.success("Account created");
    router.push(role === "HR" ? "/hr" : "/employee");
    router.refresh();
  }

  return (
    <AuthSplitLayout>
      <div className="space-y-1 lg:hidden mb-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#6B1FD1] to-pink-500 flex items-center justify-center shadow-md shadow-[#6B1FD1]/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">SkillsHub</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Get started</h1>
        <p className="text-slate-600">It takes under a minute. Promise.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label className="text-xs uppercase tracking-wider text-slate-500 mb-2 block">I&apos;m signing up as</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("EMPLOYEE")}
              className={cn(
                "p-3 rounded-md border text-sm font-medium transition-all",
                role === "EMPLOYEE"
                  ? "border-[#6B1FD1] bg-[#6B1FD1] text-white shadow-md shadow-[#6B1FD1]/30"
                  : "border-slate-200 hover:border-slate-300 text-slate-700"
              )}
            >
              An Employee
            </button>
            <button
              type="button"
              onClick={() => setRole("HR")}
              className={cn(
                "p-3 rounded-md border text-sm font-medium transition-all",
                role === "HR"
                  ? "border-[#6B1FD1] bg-[#6B1FD1] text-white shadow-md shadow-[#6B1FD1]/30"
                  : "border-slate-200 hover:border-slate-300 text-slate-700"
              )}
            >
              In HR
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" minLength={6} required />
        </div>
        <Button type="submit" className="w-full shadow-md shadow-[#6B1FD1]/30" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-sm text-center text-slate-600 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#6B1FD1] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
