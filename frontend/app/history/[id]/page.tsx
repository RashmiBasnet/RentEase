import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  Car,
  CheckCircle2,
  ClipboardList,
  Cog,
  Flag,
  Fuel,
  MapPin,
  RotateCcw,
  Snowflake,
  Users,
} from "lucide-react";
import { handleGetBookingById } from "@/lib/actions/booking-action";
import { handleGetVehicleById } from "@/lib/actions/vehicle-action";
import { Footer } from "../../_components/Footer";
import { SiteNavbar } from "../../_components/SiteNavbar";
import { Button } from "../../_components/Button";
import { cn } from "../../_components/cn";
import { TripRating } from "./_components/TripRating";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function resolveImage(src?: string) {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  const cleanSrc = src.replace(/^\/+/, "");
  const path = cleanSrc.startsWith("uploads/") ? cleanSrc : `uploads/${cleanSrc}`;
  return `${API_BASE}/${path}`;
}

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const fmtDate = (d?: string | Date) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

const rs = (n: number) => `NPR ${Number(n || 0).toLocaleString("en-US")}`;

const paymentLabel = (m?: string) => {
  switch (m) {
    case "digital_wallet":
      return "Digital Wallet";
    case "bank_transfer":
      return "Bank Transfer";
    case "cash_on_pickup":
      return "Cash on Pickup";
    default:
      return m ? capitalize(m) : "—";
  }
};

const statusPill: Record<string, string> = {
  completed: "bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]",
  active: "bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]",
  confirmed: "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
  pending: "bg-[#fff4e5] text-[#b54708]",
  cancelled: "bg-[var(--color-danger-soft-bg)] text-[var(--color-danger-soft-text)]",
};

function bookingRef(id: string, date?: string | Date) {
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const hex = id.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return `BK-${year}-${hex.slice(-4) || "0000"}`;
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await handleGetBookingById(id);
  if (!res.success || !res.data) notFound();

  const b = res.data;
  const v = b.vehicleId ?? {};
  const vehicleId = typeof v === "object" ? String(v._id ?? "") : String(v);

  const vehicleRes = vehicleId ? await handleGetVehicleById(vehicleId) : null;
  const full = vehicleRes?.success ? vehicleRes.data : null;

  const title = v.title ?? full?.title ?? "Vehicle";
  const imageUrl = resolveImage((v.images?.[0] as string) ?? full?.images?.[0]);
  const days = b.totalDays ?? 0;
  const pricePerDay = v.pricePerDay ?? full?.pricePerDay ?? 0;
  const basePrice = b.basePrice ?? pricePerDay * days;
  const insuranceCost = b.insuranceCost ?? 0;
  const deposit = b.depositAmount ?? 0;
  const extraCharges: { label: string; amount: number }[] = Array.isArray(b.extraCharges)
    ? b.extraCharges
    : [];
  const total = b.totalAmount ?? 0;
  const paid = b.paymentStatus === "paid";
  const isCompleted = b.status === "completed";
  const pickup = b.pickupAddress ?? full?.pickupAddress ?? "—";

  const features: string[] = Array.isArray(full?.features) ? full.features : [];
  const hasAC = features.some((f) => /a\/?c|air\s*condition/i.test(f));

  return (
    <>
      <SiteNavbar />

      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-8">
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] no-underline hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Booking History
        </Link>

        {/* Header */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
                  statusPill[b.status] ?? statusPill.pending
                )}
              >
                {b.status === "completed" && <CheckCircle2 size={13} />}
                {b.status}
              </span>
              <span className="rounded-md bg-[var(--color-surface-inset)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
                {bookingRef(String(b._id), b.startDate)}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <Calendar size={15} />
              {fmtDate(b.startDate)} – {fmtDate(b.endDate)} · {days} day
              {days === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button href="/history" variant="outline" leftIcon={<Flag size={16} />}>
              Report Issue
            </Button>
            <Button href={`/rentals/${vehicleId}`} leftIcon={<RotateCcw size={16} />}>
              Book Again
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Vehicle */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center">
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-50)] sm:w-44">
                {imageUrl ? (
                  <Image src={imageUrl} alt={title} fill className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[var(--color-primary)]/40">
                    <Car size={48} strokeWidth={1.5} />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[var(--color-text)]">
                  {title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[var(--color-text-secondary)]">
                  {full?.seats !== undefined && (
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={15} /> {full.seats} Seats
                    </span>
                  )}
                  {full?.transmission && (
                    <span className="inline-flex items-center gap-1.5">
                      <Cog size={15} /> {capitalize(full.transmission)}
                    </span>
                  )}
                  {(full?.fuelType || v.type) && (
                    <span className="inline-flex items-center gap-1.5">
                      <Fuel size={15} /> {capitalize(full?.fuelType ?? v.type)}
                    </span>
                  )}
                  {hasAC && (
                    <span className="inline-flex items-center gap-1.5">
                      <Snowflake size={15} /> A/C
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Trip summary */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <ClipboardList size={17} />
                </span>
                Trip Summary
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SummaryTile
                  icon={<CalendarClock size={15} />}
                  label="Duration"
                  value={`${days} day${days === 1 ? "" : "s"}`}
                  sub={`${days * 24} hours total`}
                />
                <SummaryTile
                  icon={<Car size={15} />}
                  label="Daily Rate"
                  value={rs(pricePerDay)}
                  sub="per day"
                />
                <SummaryTile
                  icon={<MapPin size={15} />}
                  label="Pickup Location"
                  value={pickup}
                />
                <SummaryTile
                  icon={<CheckCircle2 size={15} />}
                  label="Payment"
                  value={paid ? "Paid" : capitalize(b.paymentStatus ?? "pending")}
                  sub={paymentLabel(b.paymentMethod)}
                />
              </div>
            </section>

            {/* Pickup & return */}
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <MapPin size={17} />
                </span>
                Pickup &amp; Return
              </h2>

              <div className="relative mt-4 h-40 overflow-hidden rounded-xl bg-[var(--color-surface-muted)]">
                <svg className="absolute inset-0 h-full w-full" aria-hidden>
                  <line
                    x1="16%"
                    y1="72%"
                    x2="84%"
                    y2="32%"
                    stroke="var(--color-primary)"
                    strokeWidth="2.5"
                    strokeDasharray="7 7"
                  />
                </svg>
                <span className="absolute left-[16%] top-[72%] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-sm)]">
                  <MapPin size={16} />
                </span>
                <span className="absolute left-[84%] top-[32%] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--color-success)] bg-[var(--color-surface)] text-[var(--color-success)] shadow-[var(--shadow-sm)]">
                  <CheckCircle2 size={16} />
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                      <MapPin size={15} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                        Pickup
                      </p>
                      <p className="font-semibold text-[var(--color-text)]">
                        {pickup}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[var(--color-text)]">
                    {fmtDate(b.startDate)}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]">
                      <CheckCircle2 size={15} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                        Return
                      </p>
                      <p className="font-semibold text-[var(--color-text)]">
                        {pickup}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[var(--color-text)]">
                    {fmtDate(b.endDate)}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="flex flex-col gap-6">
            {isCompleted && (
              <TripRating vehicleId={vehicleId} bookingId={String(b._id)} />
            )}

            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
              <div className="bg-[var(--color-primary)] p-5 text-[var(--color-on-primary)]">
                <p className="text-xs text-white font-semibold uppercase tracking-wider opacity-90">
                  Total {paid ? "Paid" : "Due"}
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-white font-bold">
                  {rs(total)}
                </p>
                <span
                  className={cn(
                    "mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
                    paid
                      ? "bg-white/20 text-white"
                      : "bg-white/20 text-white"
                  )}
                >
                  <CheckCircle2 size={13} />
                  {paid ? "Paid" : capitalize(b.paymentStatus ?? "Pending")}
                </span>
              </div>

              <div className="bg-[var(--color-surface)] p-5">
                <dl className="flex flex-col gap-3 text-sm">
                  <Row
                    label={`Daily Rate (${days} × ${rs(pricePerDay)})`}
                    value={rs(basePrice)}
                  />
                  {insuranceCost > 0 && (
                    <Row label="Insurance" value={rs(insuranceCost)} />
                  )}
                  {extraCharges.map((c, i) => (
                    <Row key={i} label={c.label} value={rs(c.amount)} />
                  ))}
                  {deposit > 0 && (
                    <Row label="Refundable Deposit" value={rs(deposit)} />
                  )}
                </dl>

                <hr className="my-4 border-[var(--color-border)]" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-text)]">
                    Total {paid ? "Paid" : "Due"}
                  </span>
                  <span className="font-bold text-[var(--color-primary)]">
                    {rs(total)}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-lg bg-[var(--color-surface-inset)] px-3 py-2.5">
                  <span className="flex h-7 w-10 items-center justify-center rounded bg-[var(--color-surface)] text-[10px] font-bold text-[var(--color-primary)] shadow-[var(--shadow-sm)]">
                    PAY
                  </span>
                  <div className="text-xs">
                    <p className="font-semibold text-[var(--color-text)]">
                      {paymentLabel(b.paymentMethod)}
                    </p>
                    <p className="text-[var(--color-text-muted)]">
                      {paid ? "Paid" : "Pending"} · {fmtDate(b.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

function SummaryTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--color-surface-inset)] p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate font-bold text-[var(--color-text)]">{value}</p>
      {sub && <p className="text-xs text-[var(--color-text-muted)]">{sub}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="font-semibold text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
