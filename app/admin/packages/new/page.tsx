'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createPackage } from '@/lib/actions/admin';
import { ImageUploadField } from '@/components/admin/image-upload-field';

const ROOM_TYPES = ['Quad', 'Triple', 'Double', 'Single'] as const;
const CATEGORIES = ['Economy', 'Deluxe', 'VIP'] as const;

export default function NewPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createPackage(formData);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Package create ho gaya!');
      router.push('/admin/packages');
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-semibold">Naya Package</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="title">Package Title *</Label>
            <Input id="title" name="title" required placeholder="Economy Umrah Package 2026" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Category *</Label>
            <select id="category" name="category" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration_days">Duration (Days) *</Label>
            <Input id="duration_days" name="duration_days" type="number" required min={1} placeholder="14" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="departure_city">Departure City *</Label>
            <Input id="departure_city" name="departure_city" required placeholder="Karachi" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hotel_makkah">Makkah Hotel *</Label>
            <Input id="hotel_makkah" name="hotel_makkah" required placeholder="Hilton Suites Makkah" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hotel_madinah">Madinah Hotel *</Label>
            <Input id="hotel_madinah" name="hotel_madinah" required placeholder="Al-Eiman Royal Hotel" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="makkah_distance">Makkah Distance (Haram se)</Label>
            <Input id="makkah_distance" name="makkah_distance" placeholder="50m" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="madinah_distance">Madinah Distance</Label>
            <Input id="madinah_distance" name="madinah_distance" placeholder="200m" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Package Cover Image</Label>
          <ImageUploadField />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} placeholder="Package ki tafseel..." />
        </div>

        {/* Inclusions */}
        <div>
          <p className="mb-2 text-sm font-medium">Package mein kya shamil hai?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['flights_included', 'Flights'],
              ['visa_included', 'Visa'],
              ['transport_included', 'Transport'],
              ['ziyarat_included', 'Ziyarat'],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={name} className="h-4 w-4" defaultChecked={name !== 'ziyarat_included'} />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Room Pricing */}
        <div>
          <p className="mb-2 text-sm font-medium">Room Pricing (PKR per person)</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROOM_TYPES.map((rt) => (
              <div key={rt} className="flex flex-col gap-1">
                <Label htmlFor={`price_${rt}`}>{rt} Sharing</Label>
                <Input id={`price_${rt}`} name={`price_${rt}`} type="number" placeholder="0" min={0} />
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? 'Create ho raha hai...' : 'Package Create Karein'}
        </Button>
      </form>
    </div>
  );
}
