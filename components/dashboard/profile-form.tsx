'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '@/lib/actions/profile';
import type { Profile } from '@/lib/types';

const LANG_OPTIONS = [
  { value: 'ur', label: 'Urdu' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
];

export function ProfileForm({ profile, email }: { profile: Profile | null; email: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Profile update ho gayi!');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6">
      <div className="flex flex-col gap-1.5">
        <Label>Email (change nahi ho sakta)</Label>
        <Input value={email} disabled />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Pura Naam</Label>
        <Input id="full_name" name="full_name" required defaultValue={profile?.full_name ?? ''} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" required defaultValue={profile?.phone ?? ''} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cnic">CNIC (ikhtiyari)</Label>
        <Input id="cnic" name="cnic" placeholder="XXXXX-XXXXXXX-X" defaultValue={profile?.cnic ?? ''} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="preferred_language">Pasandida Zaban</Label>
        <select
          id="preferred_language"
          name="preferred_language"
          defaultValue={profile?.preferred_language ?? 'ur'}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {LANG_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Save ho raha hai...' : 'Profile Save Karein'}
      </Button>
    </form>
  );
}
