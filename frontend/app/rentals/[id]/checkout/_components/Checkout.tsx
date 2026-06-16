"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  BadgeCheck,
  CheckCircle2,
  Cog,
  Fuel,
  History,
  Info,
  Landmark,
  Lock,
  Phone,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "../../../../_components/Badge";
import { Button } from "../../../../_components/Button";
import { SpecChip } from "../../../../_components/SpecChip";
import { Stepper } from "../../../../_components/Stepper";
import { cn } from "../../../../_components/cn";
import { handleCreateBooking } from "@/lib/actions/booking-action";

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
    value: "digital_wallet",
    title: "Digital Wallets",
    desc: "eSewa, Khalti, IME Pay",
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
const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const fmtShort = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** Builds a friendly booking reference like "ND-8829-XP" from the Mongo id. */
const bookingRef = (id?: string) => {
  if (!id) return "ND-0000-XP";
  const hex = String(id).replace(/[^a-z0-9]/gi, "").toUpperCase();
  return `ND-${hex.slice(-6, -2) || "0000"}-${hex.slice(-2) || "XP"}`;
};

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
  const dailyTotal = vehicle.pricePerDay * days;
  const total = dailyTotal + deposit;

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
    setSubmitting(false);

    if (res.success) {
      setConfirmed(res.data ?? {});
    } else {
      setError(res.message ?? "Payment could not be processed.");
    }
  };

  const step = confirmed ? 3 : 2;

  /* ---------- Confirmation (step 3) ---------- */
  if (confirmed) {
    return (
      <div>
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)] text-white">
            <CheckCircle2 size={34} />
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[var(--color-text)]">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Your adventure across Nepal is ready to begin. Get your gear ready!
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--color-surface-inset)] px-4 py-2 text-sm">
            <span className="text-[var(--color-text-secondary)]">Booking ID:</span>
            <span className="font-bold text-[var(--color-primary)]">
              {bookingRef(confirmed?._id)}
            </span>
          </span>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-[20rem_1fr]">
          {/* Vehicle card */}
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
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-[var(--color-text)]">
                  {vehicle.title}
                </h3>
                {vehicle.isVerified && (
                  <Badge variant="verified" icon={<BadgeCheck size={12} />}>
                    Verified
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {vehicle.transmission && (
                  <SpecChip icon={<Cog size={14} />}>
                    {vehicle.transmission}
                  </SpecChip>
                )}
                {vehicle.fuelType && (
                  <SpecChip icon={<Fuel size={14} />}>{vehicle.fuelType}</SpecChip>
                )}
                {vehicle.seats !== undefined && (
                  <SpecChip icon={<Users size={14} />}>
                    {vehicle.seats} Seats
                  </SpecChip>
                )}
              </div>

              <hr className="my-4 border-[var(--color-border)]" />

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Pickup
                  </p>
                  <p className="mt-1 font-semibold text-[var(--color-text)]">
                    {fmt(startDate)}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">
                    {pickup}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-[var(--color-text-muted)]"
                />
                <div className="min-w-0 text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Return
                  </p>
                  <p className="mt-1 font-semibold text-[var(--color-text)]">
                    {fmt(endDate)}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">
                    {pickup}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text)]">
              <Info size={20} className="text-[var(--color-primary)]" />
              What happens next?
            </h2>

            <ol className="mt-5 flex flex-col gap-6">
              <li className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-sm font-bold text-[var(--color-primary)]">
                  1
                </span>
                <div>
                  <h3 className="font-bold text-[var(--color-text)]">
                    Vehicle Handover
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Your vehicle will be delivered to {pickup} at 9:00 AM on{" "}
                    {fmtShort(startDate)}. Please have your original Driving
                    License and Passport ready for verification.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-sm font-bold text-[var(--color-primary)]">
                  2
                </span>
                <div className="w-full">
                  <h3 className="font-bold text-[var(--color-text)]">
                    Contact Information
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-x-10 gap-y-3 rounded-xl bg-[var(--color-surface-inset)] px-4 py-3">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        <User size={13} /> Support
                      </p>
                      <p className="mt-0.5 font-bold text-[var(--color-text)]">
                        RentEase Support
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        <Phone size={13} /> Phone
                      </p>
                      <p className="mt-0.5 font-bold text-[var(--color-text)]">
                        +977-9841XXXXXX
                      </p>
                    </div>
                  </div>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-sm font-bold text-[var(--color-primary)]">
                  3
                </span>
                <div>
                  <h3 className="font-bold text-[var(--color-text)]">
                    Fuel &amp; Insurance
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    The vehicle comes with a full tank. Please return it with a
                    full tank.{" "}
                    {vehicle.insuranceIncluded
                      ? "Comprehensive insurance covers all major damage with a NPR 10,000 deductible."
                      : "Insurance is not included for this booking."}
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-4xl">
          <Button
            href="/history"
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<History size={18} />}
          >
            View Booking History
          </Button>
        </div>
      </div>
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
                Refundable Deposit
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
              Total Amount
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-primary)]">
              {rs(total)}
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
          {submitting ? "Processing..." : "Pay Now"}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <Lock size={12} />
          Secure SSL Encrypted Payment
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <Stepper steps={["Vehicle", "Payment", "Confirm"]} current={step} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Left column — payment */}
        <div>
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              Payment Method
            </h2>

            {error && (
              <p className="mt-4 rounded-lg bg-[var(--color-danger-soft-bg)] px-3 py-2 text-sm text-[var(--color-danger-soft-text)]">
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
