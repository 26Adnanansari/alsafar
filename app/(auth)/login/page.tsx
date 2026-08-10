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

        <Button
          type="button"
          variant="outline"
          className="w-full mb-4 flex items-center justify-center gap-2 rounded-xl border bg-white hover:shadow-md"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin + '/auth/callback',
              },
            });
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">ya</span>
          </div>
        </div>

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
