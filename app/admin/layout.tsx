import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Package, BookOpen, Users, CreditCard, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/leads", label: "Leads / CRM", icon: Users },
  { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="container grid min-h-[80vh] gap-8 py-8 md:grid-cols-[220px_1fr]">
      <aside className="flex flex-col gap-2">
        <div className="mb-4 rounded-lg border border-border bg-primary-dark p-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wide text-white/60">Admin Panel</p>
          <p className="mt-1 font-display text-sm font-semibold">{profile?.full_name}</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
              <LogOut size={16} /> Logout
            </button>
          </form>
        </div>
      </aside>
      <main>{children}</main>
    </div>
  );
}
