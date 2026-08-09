import { cn } from "@/lib/utils";
import type { PaymentStatus, VisaStatus, BookingStatus, TransactionStatus } from "@/lib/types";

const STYLES: Record<string, string> = {
  // Payment Status
  Pending: "bg-muted text-muted-foreground",
  "Partially Paid": "bg-gold-light/40 text-gold",
  Paid: "bg-primary/10 text-primary",
  Refunded: "bg-destructive/10 text-destructive",
  // Visa Status
  "Not Submitted": "bg-muted text-muted-foreground",
  Processing: "bg-gold-light/40 text-gold",
  Approved: "bg-primary/10 text-primary",
  Rejected: "bg-destructive/10 text-destructive",
  // Booking Status
  Confirmed: "bg-primary/10 text-primary",
  Cancelled: "bg-destructive/10 text-destructive",
  Completed: "bg-primary/20 text-primary-dark",
  // Transaction Status
  Verified: "bg-primary/10 text-primary",
  Failed: "bg-destructive/10 text-destructive",
};

type AnyStatus = PaymentStatus | VisaStatus | BookingStatus | TransactionStatus | string;

export function StatusBadge({ status }: { status: AnyStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}

