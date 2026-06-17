import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Car,
  ChevronDown,
  Cog,
  FileText,
  Fuel,
  Gauge,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { handleGetVehicleById } from "@/lib/actions/vehicle-action";
import { handleGetReviewsForVehicle } from "@/lib/actions/review-action";
import { getUserData } from "@/lib/cookie";
import { Badge } from "../../_components/Badge";
import { Footer } from "../../_components/Footer";
import { SiteNavbar } from "../../_components/SiteNavbar";
import { StarRating } from "../../_components/StarRating";
import { Gallery } from "./_components/Gallery";
import { BookingPanel } from "./_components/BookingPanel";

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

const formatDate = (value?: string | Date) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, vehicleRes, reviewsRes] = await Promise.all([
    getUserData(),
    handleGetVehicleById(id),
    handleGetReviewsForVehicle(id),
  ]);

  if (!vehicleRes.success || !vehicleRes.data) {
    notFound();
  }

  const v = vehicleRes.data;
  const images: string[] = Array.isArray(v.images)
    ? v.images
        .map((src: string) => resolveImage(src))
        .filter((src: string | undefined): src is string => Boolean(src))
    : [];

  const reviews: any[] = reviewsRes.data?.reviews ?? [];
  const averageRating: number = reviewsRes.data?.averageRating ?? 0;
  const reviewCount: number = reviewsRes.data?.total ?? reviews.length;

  const specs = [
    { icon: <Cog size={18} />, label: "Transmission", value: capitalize(v.transmission) },
    { icon: <Fuel size={18} />, label: "Fuel Type", value: capitalize(v.fuelType) },
    { icon: <Users size={18} />, label: "Seats", value: `${v.seats} Seats` },
    { icon: <Calendar size={18} />, label: "Year", value: String(v.year) },
    { icon: <Car size={18} />, label: "Type", value: capitalize(v.type) },
    {
      icon: <Gauge size={18} />,
      label: "Condition",
      value: `${v.conditionRating ?? "—"} / 5`,
    },
  ];

  return (
    <>
      <SiteNavbar />

      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-8">
        <Link
          href="/rentals"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={16} />
          Back to rentals
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_22rem]">
          {/* Left column */}
          <div>
            <Gallery images={images} alt={v.title} />

            {/* Title block */}
            <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
                    {v.title}
                  </h1>
                  {v.isVerified && (
                    <Badge variant="verified" icon={<BadgeCheck size={14} />}>
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-[var(--color-text-secondary)]">
                  {[v.brand, v.vehicleModel, v.year].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  {reviewCount > 0 && (
                    <StarRating
                      rating={Number(averageRating.toFixed(1))}
                      reviewCount={reviewCount}
                    />
                  )}
                  <Badge variant={v.isAvailable ? "available" : "booked"} dot>
                    {v.isAvailable ? "Available" : "Booked"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                    {s.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {s.label}
                    </p>
                    <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                      {s.value || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {v.description && (
              <section className="mt-8">
                <h2 className="text-lg font-bold text-[var(--color-text)]">
                  About this vehicle
                </h2>
                <p className="mt-2 leading-relaxed text-[var(--color-text-secondary)]">
                  {v.description}
                </p>
              </section>
            )}

            {/* Pickup + insurance */}
            <section className="mt-8 grid gap-3 sm:grid-cols-2">
              {v.pickupAddress && (
                <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <MapPin size={18} className="mt-0.5 text-[var(--color-primary)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Pickup location
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {v.pickupAddress}
                    </p>
                  </div>
                </div>
              )}
              {v.insurance?.included && (
                <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <ShieldCheck size={18} className="mt-0.5 text-[var(--color-success)]" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Insurance included
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {v.insurance.details || "Coverage included with this rental."}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Features */}
            {Array.isArray(v.features) && v.features.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-bold text-[var(--color-text)]">
                  Features
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {v.features.map((f: string) => (
                    <span
                      key={f}
                      className="rounded-lg bg-[var(--color-surface-inset)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Rental terms & policies — revealed on demand (progressive disclosure) */}
            <section className="mt-8">
              <details className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 [&_summary]:list-none">
                <summary className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
                    <FileText size={18} className="text-[var(--color-primary)]" />
                    Rental terms &amp; policies
                  </span>
                  <ChevronDown
                    size={20}
                    className="text-[var(--color-text-muted)] transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="mt-4 grid gap-4 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-text-secondary)] sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">
                      Documents required
                    </p>
                    <p>
                      Valid driving license and a government-issued ID or
                      passport at pickup.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">
                      Fuel policy
                    </p>
                    <p>
                      Provided with a full tank — please return it full to avoid
                      refuelling charges.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">
                      Security deposit
                    </p>
                    <p>
                      {v.deposit
                        ? `A refundable deposit of Rs. ${Number(v.deposit).toLocaleString("en-US")} is collected at pickup.`
                        : "No security deposit required for this vehicle."}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">
                      Cancellation
                    </p>
                    <p>
                      Free cancellation up to 24 hours before pickup. Later
                      cancellations incur a one-day rental fee.
                    </p>
                  </div>
                </div>
              </details>
            </section>

            {/* Reviews */}
            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--color-text)]">
                  Reviews
                </h2>
                {reviewCount > 0 && (
                  <StarRating
                    rating={Number(averageRating.toFixed(1))}
                    reviewCount={reviewCount}
                  />
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="mt-3 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-inset)] p-6 text-center text-sm text-[var(--color-text-muted)]">
                  No reviews yet. Be the first to rent and review this vehicle.
                </p>
              ) : (
                <ul className="mt-4 flex flex-col gap-4">
                  {reviews.map((rv) => (
                    <li
                      key={String(rv._id)}
                      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-[var(--color-on-primary)]">
                            {(rv.userId?.fullName ?? "U").charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-text)]">
                              {rv.userId?.fullName ?? "Anonymous"}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                              {formatDate(rv.createdAt)}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={rv.rating} variant="stars" size={14} />
                      </div>
                      {rv.comment && (
                        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                          {rv.comment}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Right column — booking */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingPanel
              vehicleId={id}
              pricePerDay={v.pricePerDay}
              deposit={v.deposit}
              pickupAddress={v.pickupAddress}
              isAvailable={Boolean(v.isAvailable)}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
