import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TogglePackageButton } from "@/components/admin/toggle-package-button";

export default async function AdminPackagesPage() {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("id, title, category, duration_days, departure_city, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Packages</h1>
          <p className="mt-1 text-sm text-muted-foreground">{packages?.length ?? 0} packages registered</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/packages/new"><Plus size={16} className="mr-1" /> Naya Package</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Days</th>
              <th className="p-3 font-medium">City</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {(packages ?? []).map((pkg) => (
              <tr key={pkg.id} className="border-t border-border hover:bg-muted/40">
                <td className="p-3 font-medium">{pkg.title}</td>
                <td className="p-3"><Badge>{pkg.category}</Badge></td>
                <td className="p-3">{pkg.duration_days} din</td>
                <td className="p-3">{pkg.departure_city}</td>
                <td className="p-3">
                  <span className={`text-xs font-medium ${pkg.is_active ? "text-primary" : "text-muted-foreground"}`}>
                    {pkg.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3">
                  <TogglePackageButton id={pkg.id} isActive={pkg.is_active} />
                </td>
              </tr>
            ))}
            {(!packages || packages.length === 0) && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Koi package nahi mila.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
