"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Star } from "lucide-react";
import { Button } from "../../../_components/Button";
import { cn } from "../../../_components/cn";
import { handleCreateReview } from "@/lib/actions/review-action";

type TripRatingProps = {
  vehicleId: string;
  bookingId: string;
};

export function TripRating({ vehicleId, bookingId }: TripRatingProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-[var(--color-warning)]/30 bg-[#fff8ec] p-5 text-center">
        <Star
          size={28}
          className="mx-auto text-[var(--color-warning)]"
          fill="currentColor"
        />
        <p className="mt-2 font-bold text-[var(--color-text)]">
          Thanks for your feedback!
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Your review helps other renters choose with confidence.
        </p>
      </div>
    );
  }

  const submit = async () => {
    if (rating < 1) {
      toast.error("Please pick a star rating");
      return;
    }
    if (comment.trim().length < 5) {
      toast.error("Please add a short comment (at least 5 characters)");
      return;
    }
    setSubmitting(true);
    const res = await handleCreateReview({
      vehicleId,
      bookingId,
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);
    if (res.success) {
      toast.success("Review submitted — thank you!");
      setDone(true);
      router.refresh();
    } else {
      toast.error(res.message ?? "Could not submit review");
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-warning)]/30 bg-[#fff8ec] p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-warning)]/15 text-[var(--color-warning)]">
          <Star size={20} fill="currentColor" />
        </span>
        <div>
          <h3 className="font-bold text-[var(--color-text)]">
            How was your trip?
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Help future renters by sharing your experience
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          const active = (hover || rating) >= value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              className="p-0.5"
            >
              <Star
                size={26}
                className={cn(
                  "transition-colors",
                  active
                    ? "text-[var(--color-warning)]"
                    : "text-[var(--color-border-strong)]"
                )}
                fill={active ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>

      {rating > 0 && (
        <div className="mt-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Tell us about the vehicle and your experience..."
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-focus)]"
          />
          <Button
            size="sm"
            fullWidth
            className="mt-2"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      )}
    </div>
  );
}
