'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function cancelBooking(bookingId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Verify this booking belongs to the user
  const { data: booking } = await supabase
    .from('bookings')
    .select('user_id, booking_status')
    .eq('id', bookingId)
    .single();

  if (!booking || booking.user_id !== user.id) return { error: 'Booking nahi mili' };
  if (booking.booking_status === 'Cancelled') return { error: 'Booking already cancel ho chuki hai' };

  const { error } = await supabase
    .from('bookings')
    .update({ booking_status: 'Cancelled', cancellation_reason: reason })
    .eq('id', bookingId);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/bookings');
  return { success: true };
}
