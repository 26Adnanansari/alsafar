import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { UpdateLeadStatusButton } from "@/components/admin/update-lead-status-button";

const STATUS_COLORS: Record<string, string> = {
  New: "text-primary bg-primary/10",
  Contacted: "text-gold bg-gold/10",
  "Follow-up": "text-gold bg-gold-light/20",
  Converted: "text-primary bg-primary/10",
  Lost: "text-muted-foreground bg-muted",
};

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*, packages(title)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Leads / CRM</h1>
        <p className="mt-1 text-sm text-muted-foreground">{leads?.length ?? 0} kul leads</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Naam</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Source</th>
              <th className="p-3 font-medium">Package</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead: any) => (
              <tr key={lead.id} className="border-t border-border hover:bg-muted/40">
                <td className="p-3 font-medium">{lead.full_name}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3 text-muted-foreground">{lead.source}</td>
                <td className="p-3">{lead.packages?.title ?? "—"}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status] ?? ""}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{formatDate(lead.created_at)}</td>
                <td className="p-3">
                  <UpdateLeadStatusButton id={lead.id} currentStatus={lead.status} />
                </td>
              </tr>
            ))}
            {(!leads || leads.length === 0) && (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Koi lead nahi mili.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
