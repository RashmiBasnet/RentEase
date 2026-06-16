"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { cn } from "../../../_components/cn";
import { formatDate } from "../../_components/adminUtils";
import { handleDeleteReview } from "@/lib/actions/review-action";

function Stars({ rating = 0 }: { rating?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.round(rating)
              ? "text-[var(--color-warning)]"
              : "text-[var(--color-border-strong)]"
          }
          fill={i < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

export function ReviewsManager({ reviews }: { reviews: any[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const remove = (id: string) => {
    if (!confirm("Delete this review?")) return;
    setBusyId(id);
    startTransition(async () => {
      const res = await handleDeleteReview(id);
      setBusyId(null);
      if (!res.success) {
        alert(res.message ?? "Failed to delete review");
        return;
      }
      router.refresh();
    });
  };

  return (
    <div>
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Reviews
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          {reviews.length} review{reviews.length === 1 ? "" : "s"} across all
          vehicles.
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-4">
        {reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center text-[var(--color-text-muted)]">
            No reviews yet.
          </div>
        )}

        {reviews.map((rv) => {
          const id = String(rv._id);
          const busy = pending && busyId === id;
          return (
            <div
              key={id}
              className={cn(
                "flex items-start justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
                busy && "opacity-60"
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-[var(--color-text)]">
                    {rv.vehicleId?.title ?? "Vehicle"}
                  </h3>
                  <Stars rating={rv.rating} />
                </div>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {rv.comment}
                </p>
                <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                  By {rv.userId?.fullName ?? "Anonymous"} ·{" "}
                  {formatDate(rv.createdAt)}
                </p>
              </div>

              <button
                type="button"
                title="Delete review"
                disabled={busy}
                onClick={() => remove(id)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
