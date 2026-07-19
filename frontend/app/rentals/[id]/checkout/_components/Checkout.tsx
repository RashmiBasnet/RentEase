"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Banknote,
  BadgeCheck,
  Cog,
  Fuel,
  Info,
  Landmark,
  Lock,
  Wallet,
} from "lucide-react";
import { Badge } from "../../../../_components/Badge";
import { BookingConfirmation } from "../../../../_components/BookingConfirmation";
import { Button } from "../../../../_components/Button";
import { SpecChip } from "../../../../_components/SpecChip";
import { Stepper } from "../../../../_components/Stepper";
import { cn } from "../../../../_components/cn";
import { handleCreateBooking } from "@/lib/actions/booking-action";
import { handleInitiateKhaltiPayment } from "@/lib/actions/payment-action";

export type CheckoutVehicle = {
  id: string;
  title: string;
  imageUrl?: string;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  isVerified?: boolean;
  pricePerDay: number;
  deposit?: number;
  insuranceIncluded?: boolean;
};

type CheckoutProps = {
  vehicle: CheckoutVehicle;
  startDate: string;
  endDate: string;
  pickup: string;
  notes?: string;
  days: number;
};

const methods = [
  {
    value: "khalti",
    title: "Khalti",
    desc: "Pay securely via Khalti",
    icon: Wallet,
  },
  {
    value: "bank_transfer",
    title: "Bank Transfer",
    desc: "ConnectIPS or Mobile Banking",
    icon: Landmark,
  },
  {
    value: "cash_on_pickup",
    title: "Cash on Pickup",
    desc: "Pay at the rental hub",
    icon: Banknote,
  },
];

const rs = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;

export function Checkout({
  vehicle,
  startDate,
  endDate,
  pickup,
  notes,
  days,
}: CheckoutProps) {
  const [method, setMethod] = useState(methods[0].value);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<any | null>(null);

  const deposit = vehicle.deposit ?? 0;
  // Only the rental is charged online — the deposit is collected at pickup,
  // which matches the totalAmount the backend stores on the booking.
  const dailyTotal = vehicle.pricePerDay * days;
  const isCash = method === "cash_on_pickup";
  const isKhalti = method === "khalti";

  const onPay = async () => {
    setError(null);
    setSubmitting(true);

    const res = await handleCreateBooking({
      vehicleId: vehicle.id,
      startDate,
      endDate,
      pickupAddress: pickup,
      notes: notes || undefined,
      paymentMethod: method,
    });

    if (!res.success) {
      setSubmitting(false);
      setError(res.message ?? "Booking could not be created.");
      return;
    }

    if (isKhalti) {
      const bookingId = (res.data as { _id?: string } | undefined)?._id;
      if (!bookingId) {
        setSubmitting(false);
        setError("Booking was created but its reference is missing.");
        return;
      }

      const payment = await handleInitiateKhaltiPayment({
        bookingId: String(bookingId),
      });

      if (!payment.success || !payment.data?.paymentUrl) {
        setSubmitting(false);
        setError(payment.message ?? "Could not start the Khalti payment.");
        return;
      }

      // Hand off to Khalti — verification happens when they redirect back.
      window.location.href = payment.data.paymentUrl;
      return;
    }

    setSubmitting(false);
    setConfirmed(res.data ?? {});
    toast.success(
      isCash
        ? "Booking confirmed! Pay in cash at pickup. 🚗"
        : "Booking confirmed! 🎉"
    );
  };

  const step = confirmed ? 3 : 2;

  /* ---------- Confirmation (step 3) ---------- */
  if (confirmed) {
    return (
      <BookingConfirmation
        bookingId={confirmed?._id}
        vehicle={vehicle}
        startDate={startDate}
        endDate={endDate}
        pickup={pickup}
      />
    );
  }

  /* ---------- Summary card (shared across steps) ---------- */
  const summaryCard = (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      <div className="relative aspect-[16/10] w-full bg-[var(--color-surface-inset)]">
        {vehicle.imageUrl && (
          <Image
            src={vehicle.imageUrl}
            alt={vehicle.title}
            fill
            className="object-cover"
          />
        )}
        {vehicle.isVerified && (
          <span className="absolute right-3 top-3">
            <Badge variant="available" icon={<BadgeCheck size={14} />}>
              Verified
            </Badge>
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          {vehicle.title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {vehicle.transmission && (
            <SpecChip icon={<Cog size={14} />}>{vehicle.transmission}</SpecChip>
          )}
          {vehicle.fuelType && (
            <SpecChip icon={<Fuel size={14} />}>{vehicle.fuelType}</SpecChip>
          )}
        </div>

        <hr className="my-4 border-[var(--color-border)]" />

        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--color-text-secondary)]">
              Daily Rate ({days} day{days === 1 ? "" : "s"})
            </dt>
            <dd className="font-medium text-[var(--color-text)]">
              {rs(dailyTotal)}
            </dd>
          </div>
          {deposit > 0 && (
            <div className="flex justify-between">
              <dt className="text-[var(--color-text-secondary)]">
                Refundable Deposit{" "}
                <span className="text-[var(--color-text-muted)]">(at pickup)</span>
              </dt>
              <dd className="font-medium text-[var(--color-text)]">
                {rs(deposit)}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="font-semibold text-[var(--color-success-soft-text)]">
              Insurance (Basic)
            </dt>
            <dd className="font-bold text-[var(--color-success-soft-text)]">
              {vehicle.insuranceIncluded ? "FREE" : "—"}
            </dd>
          </div>
        </dl>

        <hr className="my-4 border-[var(--color-border)]" />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {isCash ? "Due at Pickup" : "Pay Now"}
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-primary)]">
              {rs(dailyTotal)}
            </p>
          </div>
          <span className="text-xs text-[var(--color-text-muted)]">
            VAT Included
          </span>
        </div>

        <Button
          size="lg"
          fullWidth
          className="mt-5"
          onClick={onPay}
          disabled={submitting}
        >
          {submitting
            ? isKhalti
              ? "Redirecting to Khalti..."
              : "Processing..."
            : isCash
              ? "Book Now"
              : isKhalti
                ? "Pay with Khalti"
                : "Pay Now"}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <Lock size={12} />
          {isCash
            ? "Pay in cash at the rental hub"
            : isKhalti
              ? "You'll be redirected to Khalti to complete payment"
              : "Secure SSL Encrypted Payment"}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <Stepper steps={["Details", "Payment", "Confirmation"]} current={step} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Left column — payment */}
        <div>
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              Payment Method
            </h2>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-[var(--color-danger-soft-bg)] px-3 py-2 text-sm text-[var(--color-danger-soft-text)]"
              >
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {methods.map((m) => {
                const active = method === m.value;
                const Icon = m.icon;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMethod(m.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-inset)] text-[var(--color-text-secondary)]">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[var(--color-text)]">
                        {m.title}
                      </span>
                      <span className="block truncate text-xs text-[var(--color-text-muted)]">
                        {m.desc}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                        active
                          ? "border-[var(--color-primary)]"
                          : "border-[var(--color-border-strong)]"
                      )}
                    >
                      {active && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[var(--color-surface-muted)] p-5">
            <Info
              size={20}
              className="mt-0.5 shrink-0 text-[var(--color-warning)]"
            />
            <div>
              <p className="text-sm font-bold text-[var(--color-text)]">
                Cancellation Policy
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Free cancellation up to 24 hours before your pickup time.
                Cancellations made within 24 hours of pickup will incur a
                one-day rental fee. No-shows are non-refundable.
              </p>
            </div>
          </div>
        </div>

        {/* Right column — summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">{summaryCard}</aside>
      </div>
    </div>
  );
}
