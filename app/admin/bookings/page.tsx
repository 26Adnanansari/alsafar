import { StatusBadge } from "@/components/payments/payment-status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

async function getAllBookings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, profiles(full_name, phone), packages(title)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">All Bookings</h1>
        <p className="text-sm text-muted-foreground">{bookings.length} total</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Booking #</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Package</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Payment</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: any) => (
              <tr key={b.id} className="border-t border-border hover:bg-muted/40">
                <td className="p-3 font-medium">{b.booking_number}</td>
                <td className="p-3">
                  <p>{b.profiles?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{b.profiles?.phone}</p>
                </td>
                <td className="p-3">{b.packages?.title}</td>
                <td className="p-3 font-medium">{formatCurrency(b.total_amount)}</td>
                <td className="p-3"><StatusBadge status={b.payment_status} /></td>
                <td className="p-3"><StatusBadge status={b.booking_status} /></td>
                <td className="p-3 text-muted-foreground">{formatDate(b.created_at)}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  Koi booking nahi mili.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
