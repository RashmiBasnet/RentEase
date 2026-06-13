import type { ReactNode } from "react";
import { cn } from "./cn";

type SpecChipProps = {
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};


export function SpecChip({ icon, className, children }: SpecChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-inset)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)]",
        className
      )}
    >
      {icon && (
        <span className="text-[var(--color-text-muted)]" aria-hidden>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
