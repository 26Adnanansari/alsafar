import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (used by every shadcn-style component). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as PKR currency, e.g. 450000 -> "Rs 450,000" */
export function formatCurrency(amount: number, currency: string = "PKR") {
  const symbol = currency === "PKR" ? "Rs" : currency;
  return `${symbol} ${amount.toLocaleString("en-PK")}`;
}

/** Format an ISO date string as "12 Aug 2026" */
export function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Days remaining until a given date — used for passport expiry alerts */
export function daysUntil(isoDate: string) {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const PAYMENT_STATUS_STYLES: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground",
  "Partially Paid": "bg-gold-light/40 text-gold-dark",
  Paid: "bg-primary/10 text-primary",
  Refunded: "bg-destructive/10 text-destructive",
};

export const VISA_STATUS_STYLES: Record<string, string> = {
  "Not Submitted": "bg-muted text-muted-foreground",
  Processing: "bg-gold-light/40 text-gold-dark",
  Approved: "bg-primary/10 text-primary",
  Rejected: "bg-destructive/10 text-destructive",
};
