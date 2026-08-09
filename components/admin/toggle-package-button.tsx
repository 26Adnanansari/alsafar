'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { togglePackageActive } from '@/lib/actions/admin';

export function TogglePackageButton({ id, isActive }: { id: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(isActive);

  async function handle() {
    setLoading(true);
    const result = await togglePackageActive(id, active);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      setActive((v) => !v);
      toast.success(active ? 'Package inactive kar diya' : 'Package active kar diya');
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
          : 'bg-primary/10 text-primary hover:bg-primary/20'
      }`}
    >
      {loading ? '...' : active ? 'Deactivate' : 'Activate'}
    </button>
  );
}
