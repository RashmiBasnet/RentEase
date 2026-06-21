"use client";

import { Star } from "lucide-react";
import { Card } from "../../_components/Card";
import { cn } from "../../_components/cn";
import {
  PRICE_MAX,
  PRICE_MIN,
  type FuelFilter,
  type RentalFilterState,
  type VehicleTypeFilter,
} from "./filterTypes";

type RentalFiltersProps = {
  value: RentalFilterState;
  onChange: (next: RentalFilterState) => void;
  onClear: () => void;
  className?: string;
};

const vehicleTypes: { label: string; value: VehicleTypeFilter }[] = [
  { label: "Car", value: "car" },
  { label: "Bike / Scooter", value: "bike-scooter" },
  { label: "4WD / SUV", value: "suv" },
];

const fuelTypes: { label: string; value: FuelFilter }[] = [
  { label: "Petrol", value: "petrol" },
  { label: "Diesel", value: "diesel" },
  { label: "Electric", value: "electric" },
];

const ratings: { label: string; value: number }[] = [
  { label: "4.5 & up", value: 4.5 },
  { label: "4.0 & up", value: 4.0 },
];

const formatRs = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
      {children}
    </h3>
  );
}

export function RentalFilters({
  value,
  onChange,
  onClear,
  className,
}: RentalFiltersProps) {
  const toggleType = (type: VehicleTypeFilter) => {
    const types = value.types.includes(type)
      ? value.types.filter((t) => t !== type)
      : [...value.types, type];
    onChange({ ...value, types });
  };

  const toggleFuel = (fuel: FuelFilter) => {
    onChange({ ...value, fuel: value.fuel === fuel ? null : fuel });
  };

  const setRating = (rating: number) => {
    onChange({
      ...value,
      minRating: value.minRating === rating ? null : rating,
    });
  };

  return (
    <Card as="aside" className={cn("h-fit", className)}>
      <h2 className="text-xl font-extrabold text-[var(--color-text)]">
        Filters
      </h2>

      {/* Vehicle type */}
      <div className="mt-6">
        <SectionLabel>Vehicle Type</SectionLabel>
        <div className="mt-4 flex flex-col gap-3">
          {vehicleTypes.map((t) => (
            <label
              key={t.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-[var(--color-text)]"
            >
              <input
                type="checkbox"
                checked={value.types.includes(t.value)}
                onChange={() => toggleType(t.value)}
                className="h-4 w-4 rounded border-[var(--color-border-strong)] accent-[var(--color-primary)]"
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <hr className="my-6 border-[var(--color-border)]" />

      {/* Price range */}
      <div>
        <SectionLabel>Price Range (Daily)</SectionLabel>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500}
          value={value.maxPrice}
          onChange={(e) =>
            onChange({ ...value, maxPrice: Number(e.target.value) })
          }
          className="mt-5 w-full accent-[var(--color-primary)]"
          aria-label="Maximum daily price"
        />
        <div className="mt-2 flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
          <span>{formatRs(PRICE_MIN)}</span>
          <span>{formatRs(value.maxPrice)}</span>
        </div>
      </div>

      <hr className="my-6 border-[var(--color-border)]" />

      {/* Fuel type */}
      <div>
        <SectionLabel>Fuel Type</SectionLabel>
        <div className="mt-4 flex flex-wrap gap-2">
          {fuelTypes.map((f) => {
            const active = value.fuel === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => toggleFuel(f.value)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                    : "border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="my-6 border-[var(--color-border)]" />

      {/* Minimum rating */}
      <div>
        <SectionLabel>Minimum Rating</SectionLabel>
        <div className="mt-4 flex flex-col gap-3">
          {ratings.map((r) => (
            <label
              key={r.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-[var(--color-text)]"
            >
              <input
                type="radio"
                name="min-rating"
                checked={value.minRating === r.value}
                onChange={() => setRating(r.value)}
                onClick={() => {
                  if (value.minRating === r.value) setRating(r.value);
                }}
                className="h-4 w-4 border-[var(--color-border-strong)] accent-[var(--color-primary)]"
              />
              <span className="inline-flex items-center gap-1.5">
                <Star
                  size={15}
                  className="text-[var(--color-warning)]"
                  fill="currentColor"
                  aria-hidden
                />
                {r.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="mt-8 w-full rounded-xl bg-[var(--color-surface-inset)] px-4 py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)]"
      >
        Clear All Filters
      </button>
    </Card>
  );
}
