import { CheckCircle2, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  method: string;
  status: "Pending" | "Verified" | "Failed";
  created_at: string;
}

export function InstallmentTimeline({
  transactions,
  totalAmount,
  paidAmount,
}: {
  transactions: Transaction[];
  totalAmount: number;
  paidAmount: number;
}) {
  const remaining = totalAmount - paidAmount;

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-display text-base font-semibold">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="font-display text-base font-semibold text-primary">{formatCurrency(paidAmount)}</p>
        </div>
        <div className="rounded-lg bg-gold-light/30 p-3">
          <p className="text-xs text-muted-foreground">Remaining</p>
          <p className="font-display text-base font-semibold text-gold">{formatCurrency(remaining)}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {transactions.map((tx) => (
          <li key={tx.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
            {tx.status === "Verified" ? (
              <CheckCircle2 size={18} className="shrink-0 text-primary" />
            ) : (
              <Clock size={18} className="shrink-0 text-gold" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{formatCurrency(tx.amount)} via {tx.method}</p>
              <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)} • {tx.status}</p>
            </div>
          </li>
        ))}
        {transactions.length === 0 && (
          <p className="text-sm text-muted-foreground">Abhi tak koi payment record nahi hai.</p>
        )}
      </ul>
    </div>
  );
}
