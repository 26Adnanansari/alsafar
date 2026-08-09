import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/payments/payment-status-badge";
import { InstallmentTimeline } from "@/components/payments/installment-timeline";
import { DocumentUpload } from "@/components/booking/document-upload";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

async function getBookingDetail(id: string) {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, packages(title, category, hotel_makkah, hotel_madinah)")
    .eq("id", id)
    .single();

  if (!booking) return null;

  const { data: passengers } = await supabase
    .from("passengers")
    .select("*")
    .eq("booking_id", id);

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("booking_id", id)
    .order("created_at", { ascending: false });

  return { booking, passengers: passengers ?? [], transactions: transactions ?? [] };
}

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const detail = await getBookingDetail(params.id);
  if (!detail) notFound();

  const { booking, passengers, transactions } = detail;

  return (
    <div className="container flex flex-col gap-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">{booking.packages?.title}</h1>
          <p className="text-sm text-muted-foreground">Booking #{booking.booking_number}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={booking.booking_status} />
          <StatusBadge status={booking.payment_status} />
        </div>
      </div>

      {/* Payments */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Payment Timeline</h2>
        <InstallmentTimeline
          transactions={transactions}
          totalAmount={booking.total_amount}
          paidAmount={booking.paid_amount}
        />
      </section>

      {/* Passengers + document upload */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Passengers &amp; Documents</h2>
        <div className="flex flex-col gap-6">
          {passengers.map((p: any, i: number) => (
            <div key={p.id} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-display text-sm font-semibold">{p.full_name}</p>
                  <p className="text-xs text-muted-foreground">Passport: {p.passport_number}</p>
                </div>
                <StatusBadge status={p.visa_status} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DocumentUpload
                  passengerId={p.id}
                  field="passport_file_url"
                  label="Passport Scan"
                  existingUrl={p.passport_file_url}
                />
                <DocumentUpload
                  passengerId={p.id}
                  field="photo_file_url"
                  label="Passport-size Photo"
                  existingUrl={p.photo_file_url}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
