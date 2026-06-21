"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "../../../_components/cn";
import { StatusBadge } from "../../_components/StatusBadge";
import { formatDate, formatMoney } from "../../_components/adminUtils";
import { handleUpdateBookingStatus } from "@/lib/actions/booking-action";
import type { BookingStatus } from "@/lib/api/booking/booking";

const STATUSES: (BookingStatus | "all")[] = [
  "all",
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
];

// Mirrors the backend's allowed transitions.
const NEXT: Record<string, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["active", "cancelled"],
  active: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function BookingsManager({ bookings }: { bookings: any[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? bookings
        : bookings.filter((b) => b.status === filter),
    [bookings, filter]
  );

  const updateStatus = (id: string, status: BookingStatus) => {
    setBusyId(id);
    startTransition(async () => {
      const res = await handleUpdateBookingStatus(id, status);
      setBusyId(null);
      if (!res.success) {
        alert(res.message ?? "Failed to update booking");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div>
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Bookings
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Manage and progress customer bookings.
        </p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === s
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                : "border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-[var(--color-surface-inset)] text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Dates</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-[var(--color-text-muted)]"
                  >
                    No bookings to show.
                  </td>
                </tr>
              )}
              {filtered.map((b) => {
                const id = String(b._id);
                const busy = pending && busyId === id;
                const transitions = NEXT[b.status] ?? [];
                return (
                  <tr key={id} className={cn(busy && "opacity-60")}>
                    <td className="px-4 py-3 font-semibold text-[var(--color-text)]">
                      {b.vehicleId?.title ?? "Vehicle"}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      <div className="min-w-0">
                        <p className="truncate">{b.userId?.fullName ?? "—"}</p>
                        <p className="truncate text-xs text-[var(--color-text-muted)]">
                          {b.userId?.email ?? ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-text)]">
                      {formatMoney(b.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {transitions.length === 0 ? (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            —
                          </span>
                        ) : (
                          transitions.map((t) => (
                            <button
                              key={t}
                              type="button"
                              disabled={busy}
                              onClick={() => updateStatus(id, t)}
                              className={cn(
                                "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors disabled:opacity-50",
                                t === "cancelled"
                                  ? "bg-[var(--color-danger-soft-bg)] text-[var(--color-danger-soft-text)] hover:bg-[var(--color-danger)] hover:text-white"
                                  : "bg-[var(--color-primary-50)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]"
                              )}
                            >
                              {t}
                            </button>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
