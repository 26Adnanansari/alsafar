import { notFound } from "next/navigation";
import { MapPin, Plane, FileCheck, Bus, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking/booking-form";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type { Package } from "@/lib/types";

async function getPackage(slug: string): Promise<Package | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("*, room_pricing:package_room_pricing(room_type, price, currency)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  return data as Package | null;
}

const INCLUSION_ICONS = [
  { key: "flights_included", icon: Plane, label: "Return Flights" },
  { key: "visa_included", icon: FileCheck, label: "Visa Processing" },
  { key: "transport_included", icon: Bus, label: "Ground Transport" },
  { key: "ziyarat_included", icon: Landmark, label: "Ziyarat Tour" },
] as const;

export default async function PackageDetailPage({ params }: { params: { id: string } }) {
  const pkg = await getPackage(params.id);
  if (!pkg) notFound();

  return (
    <div className="container grid gap-10 py-10 lg:grid-cols-[1.4fr_1fr]">
      {/* Left: details */}
      <div className="flex flex-col gap-8">
        <div>
          <Badge>{pkg.category}</Badge>
          <h1 className="mt-2 font-display text-3xl font-semibold">{pkg.title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={14} /> Departure: {pkg.departure_city} • {pkg.duration_days} Days
          </p>
        </div>

        {pkg.description && (
          <p className="leading-relaxed text-foreground/80">{pkg.description}</p>
        )}

        {/* Hotels */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Makkah Hotel</p>
            <p className="mt-1 font-display text-base font-semibold">{pkg.hotel_makkah}</p>
            <p className="mt-1 text-sm text-muted-foreground">{pkg.makkah_distance} from Haram</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Madinah Hotel</p>
            <p className="mt-1 font-display text-base font-semibold">{pkg.hotel_madinah}</p>
            <p className="mt-1 text-sm text-muted-foreground">{pkg.madinah_distance} from Masjid Nabawi</p>
          </div>
        </section>

        {/* Inclusions */}
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Package Inclusions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INCLUSION_ICONS.map(({ key, icon: Icon, label }) => {
              const included = pkg[key];
              return (
                <div
                  key={key}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center ${
                    included ? "border-primary/20 bg-primary/5" : "border-border opacity-40"
                  }`}
                >
                  <Icon size={20} className={included ? "text-primary" : "text-muted-foreground"} />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Room pricing table */}
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Room Sharing Prices</h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="p-3 font-medium">Room Type</th>
                  <th className="p-3 font-medium">Price per Person</th>
                </tr>
              </thead>
              <tbody>
                {pkg.room_pricing.map((r) => (
                  <tr key={r.room_type} className="border-t border-border">
                    <td className="p-3">{r.room_type} Sharing</td>
                    <td className="p-3 font-semibold text-primary">{formatCurrency(r.price, r.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Right: sticky booking form */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-display text-lg font-semibold">Book This Package</h2>
          <BookingForm pkg={pkg} />
        </div>
      </div>
    </div>
  );
}
