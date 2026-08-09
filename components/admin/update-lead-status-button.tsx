'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateLeadStatus } from '@/lib/actions/admin';
import type { LeadStatus } from '@/lib/types';

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];

export function UpdateLeadStatusButton({ id, currentStatus }: { id: string; currentStatus: LeadStatus }) {
  const [loading, setLoading] = useState(false);

  async function handle(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as LeadStatus;
    setLoading(true);
    const result = await updateLeadStatus(id, newStatus);
    setLoading(false);
    if (result?.error) toast.error(result.error);
    else toast.success('Lead status update ho gayi');
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handle}
      disabled={loading}
      className="rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
