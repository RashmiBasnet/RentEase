import { Star } from "lucide-react";
import { cn } from "./cn";

type StarRatingProps = {
  rating: number;
  reviewCount?: number;

  variant?: "compact" | "stars";
  size?: number;
  className?: string;
};


export function StarRating({
  rating,
  reviewCount,
  variant = "compact",
  size = 16,
  className,
}: StarRatingProps) {
  if (variant === "stars") {
    const rounded = Math.round(rating);
    return (
      <div
        className={cn("inline-flex items-center gap-0.5", className)}
        role="img"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < rounded
                ? "text-[var(--color-warning)]"
                : "text-[var(--color-border-strong)]"
            }
            fill={i < rounded ? "currentColor" : "none"}
            aria-hidden
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center gap-1 text-sm", className)}
      aria-label={`Rated ${rating}${
        reviewCount ? ` from ${reviewCount} reviews` : ""
      }`}
    >
      <Star
        size={size}
        className="text-[var(--color-warning)]"
        fill="currentColor"
        aria-hidden
      />
      <span className="font-semibold text-[var(--color-text)]">{rating}</span>
      {reviewCount !== undefined && (
        <span className="text-[var(--color-text-muted)]">({reviewCount})</span>
      )}
    </span>
  );
}
