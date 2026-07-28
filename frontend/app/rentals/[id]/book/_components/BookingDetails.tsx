"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  Cog,
  MapPin,
  Route,
  ShieldCheck,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "../../../../_components/Badge";
import { Button } from "../../../../_components/Button";
import { Input } from "../../../../_components/Input";
import { SpecChip } from "../../../../_components/SpecChip";
import { Stepper } from "../../../../_components/Stepper";
import { isValidNepaliPhone, normalizePhone } from "@/lib/phone";

export type BookingVehicle = {
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

type Driver = {
  fullName: string;
  email: string;
  phone: string;
};

type BookingDetailsProps = {
  vehicle: BookingVehicle;
  driver: Driver;
  /** Dates/pickup already entered on the vehicle page, carried over so they
   *  aren't asked for a second time. */
  initial?: { start?: string; end?: string; pickup?: string };
};

/** Now, in the `datetime-local` format (YYYY-MM-DDTHH:mm), for min bounds. */
const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

/** A date-only value (YYYY-MM-DD) carried from the vehicle page gets a default
 *  pickup time so it populates the datetime-local inputs. */
const toLocalDateTime = (value?: string) =>
  value ? (value.includes("T") ? value : `${value}T10:00`) : "";

/** Where "save my details for future bookings" persists — the API has no driver profile yet. */
const DRIVER_STORAGE_KEY = "rentease:driver-details";

const rs = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;

const dayCount = (start: string, end: string) => {
  if (!start || !end) return 0;
  const diff = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000
  );
  return diff > 0 ? diff : 0;
};

export function BookingDetails({ vehicle, driver, initial }: BookingDetailsProps) {
  const router = useRouter();

  const [pickup, setPickup] = useState(initial?.pickup ?? "");
  const [dropoff, setDropoff] = useState("");
  const [startDate, setStartDate] = useState(toLocalDateTime(initial?.start));
  const [endDate, setEndDate] = useState(toLocalDateTime(initial?.end));

  const [fullName, setFullName] = useState(driver.fullName);
  const [email, setEmail] = useState(driver.email);
  const [phone, setPhone] = useState(driver.phone);
  const [saveDetails, setSaveDetails] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fall back to locally saved details when the account has none on file.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRIVER_STORAGE_KEY);
      if (!saved) return;
      const d = JSON.parse(saved) as Partial<Driver>;
      setFullName((v) => v || d.fullName || "");
      setEmail((v) => v || d.email || "");
      setPhone((v) => v || d.phone || "");
      setSaveDetails(true);
    } catch {
      /* corrupt or unavailable storage — just start blank */
    }
  }, []);

  const days = useMemo(() => dayCount(startDate, endDate), [startDate, endDate]);
  const deposit = vehicle.deposit ?? 0;
  const rental = vehicle.pricePerDay * days;
  const total = rental + (days > 0 ? deposit : 0);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!pickup.trim()) next.pickup = "Enter a pickup location.";
    if (!dropoff.trim()) next.dropoff = "Enter a drop-off location.";
    if (!startDate) next.startDate = "Choose a pickup date and time.";
    if (!endDate) next.endDate = "Choose a return date and time.";
    if (startDate && endDate && days <= 0) {
      next.endDate = "Return must be after the pickup date.";
    }

    if (!fullName.trim()) next.fullName = "Enter the driver's full name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!isValidNepaliPhone(phone)) {
      next.phone = "Enter a valid 10-digit phone number.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (saveDetails) {
      try {
        localStorage.setItem(
          DRIVER_STORAGE_KEY,
          JSON.stringify({ fullName, email, phone })
        );
      } catch {
        /* storage full or blocked — not worth blocking checkout over */
      }
    } else {
      try {
        localStorage.removeItem(DRIVER_STORAGE_KEY);
      } catch {
        /* nothing to clean up */
      }
    }

    // The booking API only stores pickupAddress + notes, so drop-off and driver
    // details ride along in notes until the backend has fields for them.
    const notes = [
      `Drop-off: ${dropoff.trim()}`,
      `Driver: ${fullName.trim()} · ${email.trim()} · +977 ${normalizePhone(phone)}`,
    ].join("\n");

    const query = new URLSearchParams({
      start: startDate,
      end: endDate,
      pickup: pickup.trim(),
      notes,
    });

    router.push(`/rentals/${vehicle.id}/checkout?${query.toString()}`);
  };

  return (
    <form onSubmit={onContinue}>
      <Stepper steps={["Details", "Payment", "Confirmation"]} current={1} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Left column — trip + driver */}
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text)]">
              <Route size={20} className="text-[var(--color-primary)]" />
              Trip Details
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input
                name="pickup"
                label="Pickup Location"
                placeholder="e.g. Tribhuvan International Airport"
                leftIcon={<MapPin size={18} />}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                error={errors.pickup}
              />
              <Input
                name="dropoff"
                label="Drop-off Location"
                placeholder="e.g. Thamel, Kathmandu"
                leftIcon={<MapPin size={18} />}
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                error={errors.dropoff}
              />
              <Input
                name="startDate"
                type="datetime-local"
                label="Pickup Date & Time"
                leftIcon={<CalendarClock size={18} />}
                min={nowLocal()}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                error={errors.startDate}
              />
              <Input
                name="endDate"
                type="datetime-local"
                label="Return Date & Time"
                leftIcon={<CalendarCheck size={18} />}
                min={startDate || nowLocal()}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                error={errors.endDate}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--color-text)]">
              <User size={20} className="text-[var(--color-primary)]" />
              User Information
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
              />
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="john@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <Input
                name="phone"
                type="tel"
                label="Phone Number"
                placeholder="98XXXXXXXX"
                prefix="+977"
                autoComplete="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
              />

              <label className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] sm:mt-7 sm:self-start">
                <input
                  type="checkbox"
                  checked={saveDetails}
                  onChange={(e) => setSaveDetails(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--color-border-strong)] accent-[var(--color-primary)]"
                />
                Save my details for future bookings
              </label>
            </div>
          </section>
        </div>

        {/* Right column — order summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-[var(--color-surface-muted)] p-6">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              Order Summary
            </h2>

            <div className="mt-5 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
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
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[var(--color-text)]">
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
                  {vehicle.seats !== undefined && (
                    <SpecChip icon={<Users size={14} />}>
                      {vehicle.seats} Seats
                    </SpecChip>
                  )}
                </div>
              </div>
            </div>

            <dl className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-secondary)]">
                  Rental{days > 0 ? ` (${days} day${days === 1 ? "" : "s"})` : ""}
                </dt>
                <dd className="font-medium text-[var(--color-text)]">
                  {days > 0 ? rs(rental) : "—"}
                </dd>
              </div>
              {deposit > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-secondary)]">
                    Refundable Deposit
                  </dt>
                  <dd className="font-medium text-[var(--color-text)]">
                    {days > 0 ? rs(deposit) : "—"}
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

            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Total Amount
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-primary)]">
              {days > 0 ? rs(total) : "—"}
            </p>
            {days === 0 && (
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Pick your dates to see the total.
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              className="mt-5"
              rightIcon={<ArrowRight size={18} />}
            >
              Continue to Payment
            </Button>

            <div className="mt-4 flex flex-col gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <p className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[var(--color-success)]" />
                Secure booking &amp; free cancellation
              </p>
              <p className="flex items-center gap-1.5">
                <Wallet size={14} className="text-[var(--color-text-muted)]" />
                No payment required until pickup
              </p>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
