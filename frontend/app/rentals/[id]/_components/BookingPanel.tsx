"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, MapPin } from "lucide-react";
import { Button } from "../../../_components/Button";
import { Price } from "../../../_components/Price";

type BookingPanelProps = {
  vehicleId: string;
  pricePerDay: number;
  deposit?: number;
  pickupAddress?: string;
  isAvailable: boolean;
};

const todayStr = () => new Date().toISOString().split("T")[0];

const inputClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-focus)]";

export function BookingPanel({
  vehicleId,
  pricePerDay,
  deposit = 0,
  pickupAddress = "",
  isAvailable,
}: BookingPanelProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickup, setPickup] = useState(pickupAddress);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const subtotal = days * pricePerDay;
  const total = subtotal + (subtotal > 0 ? deposit : 0);

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startDate || !endDate) {
      setError("Please choose your pickup and return dates.");
      return;
    }
    if (days <= 0) {
      setError("Return date must be after the pickup date.");
      return;
    }
    if (!pickup.trim()) {
      setError("Please enter a pickup address.");
      return;
    }

    const query = new URLSearchParams({
      start: startDate,
      end: endDate,
      pickup: pickup.trim(),
    });
    if (notes.trim()) query.set("notes", notes.trim());

    router.push(`/rentals/${vehicleId}/checkout?${query.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-end justify-between">
        <Price amount={pricePerDay} per="day" size="xl" />
      </div>

      {!isAvailable && (
        <p className="mt-3 rounded-lg bg-[var(--color-danger-soft-bg)] px-3 py-2 text-xs font-medium text-[var(--color-danger-soft-text)]">
          This vehicle is currently booked. You can still request it for future
          dates.
        </p>
      )}

      <form onSubmit={onContinue} className="mt-5 flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-[var(--color-danger-soft-bg)] px-3 py-2 text-sm text-[var(--color-danger-soft-text)]">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--color-text-secondary)]">
            Pickup
            <input
              type="date"
              min={todayStr()}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--color-text-secondary)]">
            Return
            <input
              type="date"
              min={startDate || todayStr()}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--color-text-secondary)]">
          Pickup address
          <span className="relative flex items-center">
            <MapPin
              size={16}
              className="pointer-events-none absolute left-3 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Where should we hand over the keys?"
              className={`${inputClass} pl-9`}
            />
          </span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--color-text-secondary)]">
          Notes <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything we should know?"
            className={inputClass}
          />
        </label>

        {days > 0 && (
          <div className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-4 text-sm">
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>
                Rs. {pricePerDay.toLocaleString("en-US")} × {days} day
                {days === 1 ? "" : "s"}
              </span>
              <span className="font-medium text-[var(--color-text)]">
                Rs. {subtotal.toLocaleString("en-US")}
              </span>
            </div>
            {deposit > 0 && (
              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>Refundable deposit</span>
                <span className="font-medium text-[var(--color-text)]">
                  Rs. {deposit.toLocaleString("en-US")}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-[var(--color-border)] pt-2 text-base font-bold text-[var(--color-text)]">
              <span>Total</span>
              <span>Rs. {total.toLocaleString("en-US")}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          leftIcon={<CalendarCheck size={18} />}
        >
          Continue to Payment
        </Button>
        <p className="text-center text-xs text-[var(--color-text-muted)]">
          You won't be charged yet — review payment on the next step.
        </p>
      </form>
    </div>
  );
}
