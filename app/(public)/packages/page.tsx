import Link from "next/link";
import { cn } from "@/lib/utils";
import { PackageCard } from "@/components/packages/package-card";
import { createClient } from "@/lib/supabase/server";
import type { Package, PackageCategory } from "@/lib/types";

const CATEGORIES: PackageCategory[] = ["Economy", "Deluxe", "VIP"];

async function getPackages(category?: string): Promise<Package[]> {
  const supabase = await createClient();
  let query = supabase
    .from("packages")
    .select("*, room_pricing:package_room_pricing(room_type, price, currency)")
    .eq("is_active", true);

  if (category && CATEGORIES.includes(category as PackageCategory)) {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return (data as Package[]) ?? [];
}

export default async function PackagesPage(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const packages = await getPackages(searchParams.category);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Hajj &amp; Umrah Packages</h1>
        <p className="mt-1 text-muted-foreground">
          Sab packages verified hotels aur transparent inclusions ke sath.
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/packages"
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            !searchParams.category
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:border-primary/40"
          )}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/packages?category=${cat}`}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              searchParams.category === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/40"
            )}
          >
            {cat}
          </Link>
        ))}
      </div>

      {packages.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} imageUrl="/images/package-placeholder.jpg" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          Is category mein filhal koi package available nahi.
        </div>
      )}
    </div>
  );
}
