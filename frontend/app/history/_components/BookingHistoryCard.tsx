"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Car, Clock, MapPin } from "lucide-react";
import { Button } from "../../_components/Button";
import { cn } from "../../_components/cn";
import { handleCancelBooking } from "@/lib/actions/booking-action";

export type HistoryBooking = {
  id: string;
  ref: string;
  vehicleId: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  dateLabel: string;
  days: number;
  location: string;
  total: number;
};

const statusBadge: Record<string, string> = {
  completed: "bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]",
  cancelled: "bg-[var(--color-danger-soft-bg)] text-[var(--color-danger-soft-text)]",
};

// Deterministic placeholder tint for vehicles without an image.
const placeholderTints = [
  "from-[#cbd5e1] to-[#94a3b8]",
  "from-[#1e293b] to-[#475569]",
  "from-[#ef4444] to-[#f87171]",
  "from-[#c7d2fe] to-[#a5b4fc]",
  "from-[#b08d57] to-[#cda86b]",
  "from-[#e2e8f0] to-[#cbd5e1]",
];
const tintFor = (id: string) =>
  placeholderTints[
    [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % placeholderTints.length
  ];

export function BookingHistoryCard({ booking }: { booking: HistoryBooking }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [downloading, setDownloading] = useState(false);
  const isUpcoming = ["pending", "confirmed", "active"].includes(booking.status);

  const onCancel = () => {
    if (!confirm("Cancel this booking? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await handleCancelBooking(booking.id);
      if (!res.success) {
        alert(res.message ?? "Could not cancel booking");
        return;
      }
      router.refresh();
    });
  };

  const onDownloadInvoice = () => {
    setDownloading(true);
    const lines = [
      "RentEase — Rental Invoice",
      "=================================",
      `Booking Ref : ${booking.ref}`,
      `Vehicle     : ${booking.title}`,
      `Category    : ${booking.subtitle}`,
      `Period      : ${booking.dateLabel} (${booking.days} day${booking.days === 1 ? "" : "s"})`,
      `Pickup      : ${booking.location}`,
      `Status      : ${booking.status.toUpperCase()}`,
      "---------------------------------",
      `Total Paid  : NPR ${booking.total.toLocaleString("en-US")}`,
      "=================================",
      "Thank you for riding with RentEase!",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${booking.ref}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center",
        pending && "opacity-60"
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-40">
        {booking.imageUrl ? (
          <Image
            src={booking.imageUrl}
            alt={booking.title}
            fill
            className="object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br text-white/50",
              tintFor(booking.id)
            )}
          >
            <Car size={40} strokeWidth={1.5} />
          </div>
        )}
        {statusBadge[booking.status] && (
          <span
            className={cn(
              "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              statusBadge[booking.status]
            )}
          >
            {booking.status}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-[var(--color-text)]">
          {booking.title}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          {booking.subtitle}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={14} />
            {booking.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} />
            {booking.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} />
            {booking.days} day{booking.days === 1 ? "" : "s"}
          </span>
        </div>
        <p className="mt-2 text-sm font-bold text-[var(--color-text)]">
          NPR {booking.total.toLocaleString("en-US")}{" "}
          <span className="text-xs font-normal text-[var(--color-text-muted)]">
            total
          </span>
        </p>
      </div>

      {/* Ref + actions */}
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-44 sm:items-end">
        <span className="self-start rounded-md bg-[var(--color-surface-inset)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-muted)] sm:self-end">
          {booking.ref}
        </span>

        <div className="flex w-full flex-col gap-2">
          {isUpcoming ? (
            <>
              <Button
                href={`/rentals/${booking.vehicleId}`}
                variant="outline"
                size="sm"
                fullWidth
              >
                View Details
              </Button>
              <Button
                size="sm"
                fullWidth
                onClick={onCancel}
                disabled={pending}
              >
                {pending ? "Cancelling..." : "Cancel"}
              </Button>
            </>
          ) : booking.status === "completed" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={onDownloadInvoice}
                disabled={downloading}
              >
                Download Invoice
              </Button>
              <Button
                href={`/rentals/${booking.vehicleId}`}
                variant="ghost"
                size="sm"
                fullWidth
              >
                Book Again
              </Button>
            </>
          ) : (
            <>
              <Button
                href={`/rentals/${booking.vehicleId}`}
                variant="outline"
                size="sm"
                fullWidth
              >
                View Details
              </Button>
              <Button
                href={`/rentals/${booking.vehicleId}`}
                variant="ghost"
                size="sm"
                fullWidth
              >
                Book Again
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
