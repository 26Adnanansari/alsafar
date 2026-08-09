import Link from "next/link";
import Image from "next/image";
import { MapPin, Plane, Home } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Package } from "@/lib/types";

const CATEGORY_STYLES: Record<string, "default" | "gold" | "muted"> = {
  Economy: "muted",
  Deluxe: "default",
  VIP: "gold",
};

export function PackageCard({ pkg, imageUrl }: { pkg: Package; imageUrl: string }) {
  // Lowest room price is the headline price ("starting from")
  const startingPrice = pkg.room_pricing.length
    ? Math.min(...pkg.room_pricing.map((r) => r.price))
    : null;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={pkg.cover_image_url || imageUrl}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <Badge variant={CATEGORY_STYLES[pkg.category]} className="absolute left-3 top-3">
          {pkg.category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 pt-5">
        <h3 className="font-display text-lg font-semibold leading-tight">{pkg.title}</h3>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span>Makkah: {pkg.makkah_distance ?? "N/A"} • Madinah: {pkg.madinah_distance ?? "N/A"}</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
            <Plane size={12} /> {pkg.duration_days} Days
          </span>
          {pkg.flights_included && (
            <span className="rounded-full bg-muted px-2.5 py-1">Flights Included</span>
          )}
          {pkg.visa_included && (
            <span className="rounded-full bg-muted px-2.5 py-1">Visa Included</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="font-display text-xl font-semibold text-primary">
            {startingPrice ? formatCurrency(startingPrice) : "Contact us"}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href={`/packages/${pkg.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
