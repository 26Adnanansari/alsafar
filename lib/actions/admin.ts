'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { LeadStatus, TransactionStatus, BookingStatus } from '@/lib/types';

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return null;
  return supabase;
}

export async function verifyTransaction(transactionId: string, newStatus: TransactionStatus) {
  const supabase = await verifyAdmin();
  if (!supabase) return { error: 'Unauthorized' };

  const { data: tx } = await supabase
    .from('transactions').select('booking_id, amount').eq('id', transactionId).single();
  if (!tx) return { error: 'Transaction nahi mili' };

  const { error } = await supabase
    .from('transactions').update({ status: newStatus }).eq('id', transactionId);
  if (error) return { error: error.message };

  // If verified, update paid_amount on the booking
  if (newStatus === 'Verified') {
    const { data: booking } = await supabase
      .from('bookings').select('paid_amount, total_amount').eq('id', tx.booking_id).single();
    if (booking) {
      const newPaid = booking.paid_amount + tx.amount;
      const paymentStatus = newPaid >= booking.total_amount ? 'Paid' : 'Partially Paid';
      await supabase
        .from('bookings')
        .update({ paid_amount: newPaid, payment_status: paymentStatus })
        .eq('id', tx.booking_id);
    }
  }

  revalidatePath('/admin/transactions');
  return { success: true };
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = await verifyAdmin();
  if (!supabase) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('leads').update({ status }).eq('id', leadId);
  if (error) return { error: error.message };

  revalidatePath('/admin/leads');
  return { success: true };
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const supabase = await verifyAdmin();
  if (!supabase) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('bookings').update({ booking_status: status }).eq('id', bookingId);
  if (error) return { error: error.message };

  revalidatePath('/admin/bookings');
  return { success: true };
}

export async function togglePackageActive(packageId: string, isActive: boolean) {
  const supabase = await verifyAdmin();
  if (!supabase) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('packages').update({ is_active: !isActive }).eq('id', packageId);
  if (error) return { error: error.message };

  revalidatePath('/admin/packages');
  return { success: true };
}

export async function createPackage(formData: FormData) {
  const supabase = await verifyAdmin();
  if (!supabase) return { error: 'Unauthorized' };

  const title = formData.get('title') as string;
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const packageData = {
    title,
    slug,
    category: formData.get('category') as string,
    duration_days: parseInt(formData.get('duration_days') as string),
    departure_city: formData.get('departure_city') as string,
    hotel_makkah: formData.get('hotel_makkah') as string,
    hotel_madinah: formData.get('hotel_madinah') as string,
    makkah_distance: formData.get('makkah_distance') as string || null,
    madinah_distance: formData.get('madinah_distance') as string || null,
    flights_included: formData.get('flights_included') === 'on',
    visa_included: formData.get('visa_included') === 'on',
    transport_included: formData.get('transport_included') === 'on',
    ziyarat_included: formData.get('ziyarat_included') === 'on',
    cover_image_url: formData.get('cover_image_url') as string || null,
    description: formData.get('description') as string || null,
    is_active: true,
  };

  const { data: pkg, error: pkgError } = await supabase
    .from('packages').insert(packageData).select().single();
  if (pkgError || !pkg) return { error: pkgError?.message ?? 'Package create nahi ho saka' };

  // Room pricing rows
  const roomTypes = ['Quad', 'Triple', 'Double', 'Single'] as const;
  const pricingRows = roomTypes
    .map((rt) => ({
      package_id: pkg.id,
      room_type: rt,
      price: parseFloat(formData.get(`price_${rt}`) as string) || 0,
      currency: 'PKR',
    }))
    .filter((r) => r.price > 0);

  if (pricingRows.length > 0) {
    await supabase.from('package_room_pricing').insert(pricingRows);
  }

  revalidatePath('/admin/packages');
  return { success: true, packageId: pkg.id };
}
