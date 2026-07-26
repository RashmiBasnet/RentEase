import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Cog,
  Fuel,
  History,
  Info,
  Phone,
  Search,
  User,
  Users,
} from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { SpecChip } from "./SpecChip";

export type ConfirmationVehicle = {
  title: string;
  imageUrl?: string;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  isVerified?: boolean;
  insuranceIncluded?: boolean;
};

type BookingConfirmationProps = {
  bookingId?: string;
  vehicle: ConfirmationVehicle;
  startDate: string;
  endDate: string;
  pickup: string;
  /** Headline — differs between an inline booking and a returning payment. */
  heading?: string;
  subheading?: string;
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtShort = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** Builds a friendly booking reference like "ND-8829-XP" from the Mongo id. */
export const bookingRef = (id?: string) => {
  if (!id) return "ND-0000-XP";
  const hex = String(id).replace(/[^a-z0-9]/gi, "").toUpperCase();
  return `ND-${hex.slice(-6, -2) || "0000"}-${hex.slice(-2) || "XP"}`;
};

/**
 * Success screen shared by the inline checkout (step 3) and the Khalti
 * payment callback, so both land on the same confirmation.
 */
export function BookingConfirmation({
  bookingId,
  vehicle,
  startDate,
  endDate,
  pickup,
  heading = "Booking Confirmed!",
  subheading = "Your adventure across Nepal is ready to begin. Get your gear ready!",
}: BookingConfirmationProps) {
  return (
    <div>
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)] text-white">
          <CheckCircle2 size={34} />
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[var(--color-text)]">
          {heading}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">{subheading}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--color-surface-inset)] px-4 py-2 text-sm">
          <span className="text-[var(--color-text-secondary)]">Booking ID:</span>
          <span className="font-bold text-[var(--color-primary)]">
            {bookingRef(bookingId)}
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

      <div className="mx-auto mt-6 flex max-w-4xl flex-col gap-3 sm:flex-row">
        <Button href="/rentals" size="lg" fullWidth leftIcon={<Search size={18} />}>
          Continue Browsing Rentals
        </Button>
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
