import { z } from 'zod';

export const passengerSchema = z.object({
  full_name: z.string().min(3, 'Naam kam az kam 3 characters ka hona chahiye'),
  cnic: z.string().optional(),
  passport_number: z.string().min(6, 'Valid passport number darain'),
  passport_expiry: z.string().min(1, 'Passport expiry date darain'),
});

export const bookingSchema = z.object({
  package_id: z.string().uuid(),
  room_type: z.enum(['Quad', 'Triple', 'Double', 'Single'], {
    required_error: 'Room type select karna zaroori hai',
  }),
  passengers: z
    .array(passengerSchema)
    .min(1, 'Kam az kam ek musafir add karein'),
  agree_to_terms: z.boolean().refine((v) => v === true, {
    message: 'Terms accept karna zaroori hai',
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type PassengerFormValues = z.infer<typeof passengerSchema>;
