import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { VerifyTransactionButton } from "@/components/admin/verify-transaction-button";

const STATUS_STYLES: Record<string, string> = {
  Pending: "text-gold bg-gold/10",
  Verified: "text-primary bg-primary/10",
  Failed: "text-destructive bg-destructive/10",
};

export default async function AdminTransactionsPage() {
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, bookings(booking_number, user_id, profiles(full_name))")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Transactions</h1>
        <p className="mt-1 text-sm text-muted-foreground">{transactions?.length ?? 0} kul transactions</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Booking #</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Method</th>
              <th className="p-3 font-medium">Ref #</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {(transactions ?? []).map((tx: any) => (
              <tr key={tx.id} className="border-t border-border hover:bg-muted/40">
                <td className="p-3 font-medium">{tx.bookings?.booking_number ?? "—"}</td>
                <td className="p-3">{tx.bookings?.profiles?.full_name ?? "—"}</td>
                <td className="p-3 font-semibold text-primary">{formatCurrency(tx.amount)}</td>
                <td className="p-3">{tx.method}</td>
                <td className="p-3 text-muted-foreground">{tx.reference_number ?? "—"}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[tx.status] ?? ""}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{formatDate(tx.created_at)}</td>
                <td className="p-3">
                  <VerifyTransactionButton id={tx.id} currentStatus={tx.status} />
                </td>
              </tr>
            ))}
            {(!transactions || transactions.length === 0) && (
              <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">Koi transaction nahi mili.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
