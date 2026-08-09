"use client";

import { cn, formatCurrency } from "@/lib/utils";
import type { RoomPricing, RoomType } from "@/lib/types";

const ROOM_DESCRIPTIONS: Record<RoomType, string> = {
  Quad: "4 people share one room — most economical",
  Triple: "3 people share one room",
  Double: "2 people share one room",
  Single: "Private room — highest comfort",
};

export function RoomTypeSelector({
  options,
  selected,
  onSelect,
}: {
  options: RoomPricing[];
  selected: RoomType | null;
  onSelect: (type: RoomType) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Select room sharing type" className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected === option.room_type;
        return (
          <button
            key={option.room_type}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.room_type)}
            className={cn(
              "flex flex-col items-start rounded-lg border p-4 text-left transition-colors duration-200",
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-white hover:border-primary/40"
            )}
          >
            <span className="font-display text-base font-semibold">{option.room_type} Sharing</span>
            <span className="mt-0.5 text-xs text-muted-foreground">
              {ROOM_DESCRIPTIONS[option.room_type]}
            </span>
            <span className="mt-2 font-display text-lg font-semibold text-primary">
              {formatCurrency(option.price, option.currency)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/ person</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
