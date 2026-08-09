"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/bookings";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      toast.error("Email ya password ghalat hai");
      return;
    }

    // Role-based redirect: admin → /admin, agent → /agent, customer → /dashboard
    let destination = redirectTo === "/dashboard/bookings" ? null : redirectTo;

    if (!destination && authData.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profile?.role === "admin")       destination = "/admin";
      else if (profile?.role === "agent")  destination = "/agent";
      else                                 destination = "/dashboard";
    }

    setLoading(false);
    toast.success("Khush aamdeed!");
    router.push(destination ?? "/dashboard");
    router.refresh();
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-6 shadow-sm">
        <h1 className="mb-1 font-display text-2xl font-semibold">Welcome Back</h1>
        <p className="mb-6 text-sm text-muted-foreground">Apni booking dekhne ke liye login karein</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Account nahi hai?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register karein
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container flex min-h-[70vh] items-center justify-center py-10">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
