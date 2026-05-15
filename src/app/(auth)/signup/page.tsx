"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      role,
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      redirect: false,
    });
    toast.success("Account created");
    router.push(role === "HR" ? "/hr" : "/employee");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join SkillsHub in under a minute</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("EMPLOYEE")}
                className={`p-3 rounded-md border text-sm font-medium transition ${
                  role === "EMPLOYEE"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                I&apos;m an Employee
              </button>
              <button
                type="button"
                onClick={() => setRole("HR")}
                className={`p-3 rounded-md border text-sm font-medium transition ${
                  role === "HR"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                I&apos;m HR
              </button>
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-center text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium underline">Log in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
