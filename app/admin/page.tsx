import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, BookOpen, Users, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: totalBookings }, { data: bookings }, { count: totalLeads }, { count: pendingTx }] =
    await Promise.all([
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("total_amount, paid_amount"),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("transactions").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    ]);

  const totalRevenue = bookings?.reduce((s, b) => s + b.paid_amount, 0) ?? 0;
  const totalOutstanding = bookings?.reduce((s, b) => s + (b.total_amount - b.paid_amount), 0) ?? 0;

  const stats = [
    { label: "Total Revenue Collected", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-primary" },
    { label: "Total Bookings", value: totalBookings ?? 0, icon: BookOpen, color: "text-primary" },
    { label: "New Leads", value: totalLeads ?? 0, icon: Users, color: "text-gold" },
    { label: "Pending Transactions", value: pendingTx ?? 0, icon: Clock, color: "text-destructive" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform ka mukammal jaiza</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex flex-col gap-2 p-5">
              <Icon size={20} className={color} />
              <p className="font-display text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-medium text-muted-foreground">Outstanding Amount</p>
          <p className="mt-1 font-display text-3xl font-bold text-gold">{formatCurrency(totalOutstanding)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Sab bookings ka baqi raqam</p>
        </CardContent>
      </Card>
    </div>
  );
}
