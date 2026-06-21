"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../_components/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
};

/** Builds a compact page list with an ellipsis, e.g. [1, 2, 3, "…", 8]. */
function buildPages(page: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, page, page - 1, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  const arrow =
    "flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text-secondary)]";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={arrow}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            className="flex h-10 w-10 items-center justify-center text-[var(--color-text-muted)]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
              p === page
                ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-inset)] hover:text-[var(--color-primary)]"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={arrow}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
