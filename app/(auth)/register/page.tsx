"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password kam az kam 8 characters ka hona chahiye");
      return;
    }
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          phone: form.phone,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Profile insert (trigger nahi hoga agar DB trigger nahi hai)
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.full_name,
        phone: form.phone,
        role: "customer",
      });
    }

    toast.success("Account ban gaya! Apna email verify karein.");
    setLoading(false);
    router.push("/login");
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-1 font-display text-xl font-semibold">Account Banayein</h2>
      <p className="mb-6 text-sm text-muted-foreground">Hajj & Umrah booking ke liye register karein</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name">Pura Naam</Label>
          <Input id="full_name" name="full_name" required value={form.full_name} onChange={handleChange} placeholder="Muhammad Ali" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="03001234567" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="ali@example.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Kam az kam 8 characters" />
        </div>

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Account ban raha hai..." : "Register Karein"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Pehle se account hai?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login karein
        </Link>
      </p>
    </div>
  );
}
