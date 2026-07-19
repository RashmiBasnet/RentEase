import { handleGetBookingById } from "@/lib/actions/booking-action";
import { handleVerifyKhaltiPayment } from "@/lib/actions/payment-action";
import { BookingConfirmation } from "../../_components/BookingConfirmation";
import { Footer } from "../../_components/Footer";
import { SiteNavbar } from "../../_components/SiteNavbar";
import { PaymentIssue } from "./_components/PaymentIssue";

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
  s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;

/** Copy for the non-success statuses Khalti can report back. */
const statusCopy: Record<string, string> = {
  Pending:
    "Khalti is still processing this payment. Your booking is held for now — check your booking history shortly.",
  Initiated: "This payment was started but never completed.",
  Expired: "The payment link expired before it was completed.",
  "User canceled": "You cancelled the payment, so nothing was charged.",
  Refunded: "This payment was refunded.",
  "Partially Refunded": "This payment was partially refunded.",
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNavbar />
      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
        {children}
      </main>
      <Footer />
    </>
  );
}

/**
 * Khalti redirects here after checkout. The query params it appends are only a
 * hint — the outcome comes from the server-side lookup in the verify action.
 */
export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pidx = typeof sp.pidx === "string" ? sp.pidx : "";

  if (!pidx) {
    return (
      <Shell>
        <PaymentIssue
          kind="error"
          message="This link is missing its payment reference."
        />
      </Shell>
    );
  }

  const verified = await handleVerifyKhaltiPayment({ pidx });

  if (!verified.success) {
    return (
      <Shell>
        <PaymentIssue
          kind="error"
          message={verified.message ?? "We could not verify this payment."}
        />
      </Shell>
    );
  }

  if (!verified.data?.paid) {
    const status = String(verified.data?.status ?? "");
    return (
      <Shell>
        <PaymentIssue
          kind="unpaid"
          message={
            statusCopy[status] ??
            "This payment did not complete, so nothing was charged."
          }
        />
      </Shell>
    );
  }

  const bookingId = String(verified.data.bookingId);
  const bookingRes = await handleGetBookingById(bookingId);
  const booking = bookingRes.success ? bookingRes.data : null;

  // Payment is confirmed either way — if the booking read failed, fall back to
  // a bare success rather than implying the payment did not go through.
  if (!booking) {
    return (
      <Shell>
        <PaymentIssue
          kind="unpaid"
          message="Your payment went through, but we couldn't load the booking details. Check your booking history."
        />
      </Shell>
    );
  }

  const v = booking.vehicleId ?? {};

  return (
    <Shell>
      <BookingConfirmation
        bookingId={bookingId}
        vehicle={{
          title: v.title ?? "Your vehicle",
          imageUrl: resolveImage(v.images?.[0]),
          transmission: capitalize(v.transmission),
          fuelType: capitalize(v.fuelType),
          seats: v.seats,
          isVerified: v.isVerified,
          insuranceIncluded: v.insurance?.included ?? true,
        }}
        startDate={String(booking.startDate)}
        endDate={String(booking.endDate)}
        pickup={booking.pickupAddress ?? ""}
        heading="Payment Confirmed!"
        subheading="Your booking is confirmed and your adventure is ready to begin."
      />
    </Shell>
  );
}
