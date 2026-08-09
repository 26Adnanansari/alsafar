"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RoomTypeSelector } from "@/components/packages/room-type-selector";
import { PassengerForm } from "@/components/booking/passenger-form";
import { createClient } from "@/lib/supabase/client";
import { bookingSchema, type BookingFormValues } from "@/lib/validations/booking";
import { formatCurrency } from "@/lib/utils";
import type { Package, RoomType } from "@/lib/types";

const EMPTY_PASSENGER = { full_name: "", cnic: "", passport_number: "", passport_expiry: "" };

export function BookingForm({ pkg }: { pkg: Package }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      package_id: pkg.id,
      room_type: undefined,
      passengers: [EMPTY_PASSENGER],
      agree_to_terms: false,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "passengers" });
  const selectedRoomType = watch("room_type");
  const passengerCount = fields.length;

  const selectedPrice = pkg.room_pricing.find((r) => r.room_type === selectedRoomType)?.price ?? 0;
  const totalAmount = selectedPrice * passengerCount;

  async function onSubmit(values: BookingFormValues) {
    setSubmitting(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Booking se pehle login karna zaroori hai");
      router.push(`/login?redirectTo=/packages/${pkg.slug}`);
      setSubmitting(false);
      return;
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        package_id: values.package_id,
        room_type: values.room_type,
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      toast.error("Booking create nahi ho saki, dobara koshish karein");
      setSubmitting(false);
      return;
    }

    const { error: passengersError } = await supabase.from("passengers").insert(
      values.passengers.map((p) => ({
        booking_id: booking.id,
        full_name: p.full_name,
        cnic: p.cnic || null,
        passport_number: p.passport_number,
        passport_expiry: p.passport_expiry,
      }))
    );

    setSubmitting(false);

    if (passengersError) {
      toast.error("Passenger details save nahi hui, dashboard se dobara try karein");
      router.push(`/dashboard/bookings/${booking.id}`);
      return;
    }

    toast.success("Booking successful! Ab documents upload karein.");
    router.push(`/dashboard/bookings/${booking.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">1. Room Sharing Select Karein</h2>
        <RoomTypeSelector
          options={pkg.room_pricing}
          selected={selectedRoomType ?? null}
          onSelect={(type: RoomType) => setValue("room_type", type, { shouldValidate: true })}
        />
        {errors.room_type && (
          <p className="mt-2 text-xs text-destructive">Room type select karna zaroori hai</p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">2. Musafiron Ki Tafseel</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append(EMPTY_PASSENGER)}
          >
            <Plus size={14} /> Musafir Add Karein
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <PassengerForm
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
        </div>
        {errors.passengers?.root && (
          <p className="mt-2 text-xs text-destructive">{errors.passengers.root.message}</p>
        )}
      </section>

      <section className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex items-start gap-2">
          <input
            id="agree_to_terms"
            type="checkbox"
            className="mt-1 h-4 w-4"
            {...register("agree_to_terms")}
          />
          <label htmlFor="agree_to_terms" className="text-sm text-foreground/80">
            Main <a href="/policy/terms" className="text-primary underline">Terms of Service</a> aur{" "}
            <a href="/policy/refund" className="text-primary underline">Refund/Cancellation Policy</a> ko
            parh chuka hoon aur mujhe manzoor hai.
          </label>
        </div>
        {errors.agree_to_terms && (
          <p className="mt-2 text-xs text-destructive">{errors.agree_to_terms.message}</p>
        )}
      </section>

      <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div>
          <p className="text-xs text-muted-foreground">Total Amount ({passengerCount} passenger{passengerCount > 1 ? "s" : ""})</p>
          <p className="font-display text-2xl font-semibold text-primary">
            {totalAmount ? formatCurrency(totalAmount) : "—"}
          </p>
        </div>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Booking ho rahi hai..." : "Booking Confirm Karein"}
        </Button>
      </div>
    </form>
  );
}
