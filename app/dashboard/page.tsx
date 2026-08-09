import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { BookOpen, CreditCard, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("total_amount, paid_amount, payment_status, booking_status")
    .eq("user_id", user.id);

  const total = bookings?.length ?? 0;
  const totalPaid = bookings?.reduce((sum, b) => sum + b.paid_amount, 0) ?? 0;
  const totalAmount = bookings?.reduce((sum, b) => sum + b.total_amount, 0) ?? 0;
  const confirmed = bookings?.filter((b) => b.booking_status === "Confirmed").length ?? 0;
  const pending = bookings?.filter((b) => b.payment_status === "Pending" || b.payment_status === "Partially Paid").length ?? 0;

  const stats = [
    { label: "Kul Bookings", value: total, icon: BookOpen, color: "text-primary" },
    { label: "Total Paid", value: formatCurrency(totalPaid), icon: CreditCard, color: "text-primary" },
    { label: "Confirmed Trips", value: confirmed, icon: CheckCircle2, color: "text-primary" },
    { label: "Pending Payments", value: pending, icon: Clock, color: "text-gold" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Apni bookings aur payments ka jaiza lein</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex flex-col gap-2 p-4">
              <Icon size={20} className={color} />
              <p className="font-display text-2xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {total === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Abhi tak koi booking nahi hai.{" "}
            <a href="/packages" className="font-medium text-primary hover:underline">Packages dekhein →</a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
