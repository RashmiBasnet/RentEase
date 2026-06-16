import { handleGetMyBookings } from "@/lib/actions/booking-action";
import { getUserData } from "@/lib/cookie";
import { Footer } from "../_components/Footer";
import { Navbar } from "../_components/Navbar";
import { BookingHistory } from "./_components/BookingHistory";
import type { HistoryBooking } from "./_components/BookingHistoryCard";

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

const short = (d?: string | Date) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    : "";
const long = (d?: string | Date) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "";

function bookingRef(id: string, date?: string | Date) {
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const hex = id.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return `BK-${year}-${hex.slice(-4) || "0000"}`;
}

function mapBooking(b: any): HistoryBooking {
  const id = String(b._id);
  const v = b.vehicleId ?? {};
  const start = b.startDate;
  const end = b.endDate;
  return {
    id,
    ref: bookingRef(id, start),
    vehicleId: typeof b.vehicleId === "object" ? String(v._id ?? "") : String(b.vehicleId),
    title: v.title ?? "Vehicle",
    subtitle: [capitalize(v.type), v.brand].filter(Boolean).join(" · ") || "Rental",
    imageUrl: resolveImage(v.images?.[0]),
    status: b.status ?? "pending",
    startDate: start,
    endDate: end,
    dateLabel: `${short(start)} – ${long(end)}`,
    days: b.totalDays ?? 0,
    location: b.pickupAddress ?? "—",
    total: b.totalAmount ?? 0,
  };
}

export default async function HistoryPage() {
  const [user, res] = await Promise.all([
    getUserData(),
    handleGetMyBookings(),
  ]);

  const raw: any[] = Array.isArray(res.data) ? res.data : [];
  const bookings = raw.map(mapBooking);

  return (
    <>
      <Navbar
        user={user ? { name: user.fullName ?? "Account" } : undefined}
        links={[
          { label: "Home", href: "/home" },
          { label: "Rentals", href: "/rentals" },
          { label: "Locations", href: "/locations" },
          { label: "History", href: "/history" },
        ]}
      />

      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
        {bookings.length > 0 ? (
          <BookingHistory bookings={bookings} />
        ) : (
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
              Booking History
            </h1>
            <p className="mt-1 text-[var(--color-text-secondary)]">
              All your past, current, and upcoming rentals in one place
            </p>
            <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-inset)] p-12 text-center">
              <p className="text-[var(--color-text-secondary)]">
                You haven&apos;t booked any vehicles yet.
              </p>
              <a
                href="/rentals"
                className="mt-3 inline-block font-semibold text-[var(--color-primary)] no-underline hover:underline"
              >
                Explore vehicles →
              </a>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
