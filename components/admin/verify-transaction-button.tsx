'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { verifyTransaction } from '@/lib/actions/admin';
import type { TransactionStatus } from '@/lib/types';

export function VerifyTransactionButton({ id, currentStatus }: { id: string; currentStatus: TransactionStatus }) {
  const [loading, setLoading] = useState(false);

  async function handle(newStatus: TransactionStatus) {
    setLoading(true);
    const result = await verifyTransaction(id, newStatus);
    setLoading(false);
    if (result?.error) toast.error(result.error);
    else toast.success(`Transaction ${newStatus === 'Verified' ? 'verify' : 'reject'} ho gayi`);
  }

  if (currentStatus !== 'Pending') {
    return <span className="text-xs text-muted-foreground">{currentStatus}</span>;
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={() => handle('Verified')}
        disabled={loading}
        className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
      >
        Verify
      </button>
      <button
        onClick={() => handle('Failed')}
        disabled={loading}
        className="rounded bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
