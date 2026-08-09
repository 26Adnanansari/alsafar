import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, BookOpen, User, LogOut } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Meri Bookings", icon: BookOpen },
  { href: "/dashboard/profile", label: "Mera Profile", icon: User },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="container grid min-h-[80vh] gap-8 py-8 md:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="flex flex-col gap-2">
        <div className="mb-4 rounded-lg border border-border bg-white p-4">
          <p className="font-display text-sm font-semibold">{profile?.full_name ?? "Customer"}</p>
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">{profile?.role}</p>
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
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
