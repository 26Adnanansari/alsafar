import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/payments/payment-status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

async function getMyBookings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("bookings")
    .select("*, packages(title, category)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function MyBookingsPage() {
  const bookings = await getMyBookings();

  return (
    <div className="container py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold">My Bookings</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground">Abhi tak koi booking nahi hai.</p>
            <Link href="/packages" className="text-sm font-medium text-primary hover:underline">
              Packages dekhein →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b: any) => (
            <Link key={b.id} href={`/dashboard/bookings/${b.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-display text-base font-semibold">{b.packages?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      #{b.booking_number} • Booked on {formatDate(b.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.payment_status} />
                    <p className="font-display text-sm font-semibold">{formatCurrency(b.total_amount)}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
