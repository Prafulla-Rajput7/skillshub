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

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false
    });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }
    const sess = await fetch("/api/auth/session").then((r) => r.json());
    router.push(sess?.user?.role === "HR" ? "/hr" : "/employee");
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
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-slate-600">Pick up where you left off.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full shadow-md shadow-[#6B1FD1]/30" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <p className="text-sm text-center text-slate-600 pt-2">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[#6B1FD1] hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
