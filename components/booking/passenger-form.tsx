"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { BookingFormValues } from "@/lib/validations/booking";

export function PassengerForm({
  index,
  register,
  errors,
  onRemove,
  canRemove,
}: {
  index: number;
  register: UseFormRegister<BookingFormValues>;
  errors: FieldErrors<BookingFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const passengerErrors = errors.passengers?.[index];

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-sm font-semibold">Passenger {index + 1}</p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove passenger ${index + 1}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`passengers.${index}.full_name`}>Full Name (as per passport)</Label>
          <Input
            id={`passengers.${index}.full_name`}
            {...register(`passengers.${index}.full_name` as const)}
          />
          {passengerErrors?.full_name && (
            <p className="text-xs text-destructive">{passengerErrors.full_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`passengers.${index}.cnic`}>CNIC (optional)</Label>
          <Input
            id={`passengers.${index}.cnic`}
            placeholder="12345-1234567-1"
            {...register(`passengers.${index}.cnic` as const)}
          />
          {passengerErrors?.cnic && (
            <p className="text-xs text-destructive">{passengerErrors.cnic.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`passengers.${index}.passport_number`}>Passport Number</Label>
          <Input
            id={`passengers.${index}.passport_number`}
            {...register(`passengers.${index}.passport_number` as const)}
          />
          {passengerErrors?.passport_number && (
            <p className="text-xs text-destructive">{passengerErrors.passport_number.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`passengers.${index}.passport_expiry`}>Passport Expiry Date</Label>
          <Input
            id={`passengers.${index}.passport_expiry`}
            type="date"
            {...register(`passengers.${index}.passport_expiry` as const)}
          />
          {passengerErrors?.passport_expiry && (
            <p className="text-xs text-destructive">{passengerErrors.passport_expiry.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
