import type { ReactNode } from "react";
import { cn } from "./cn";

type BadgeVariant =
  | "verified"
  | "available"
  | "booked"
  | "cancelled"
  | "neutral";

type BadgeProps = {
  variant?: BadgeVariant;
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

const variantClasses: Record<BadgeVariant, string> = {
  verified:
    "bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]",
  available: "bg-[var(--color-success)] text-white",
  booked: "bg-[var(--color-danger)] text-white",
  cancelled:
    "bg-[var(--color-danger-soft-bg)] text-[var(--color-danger-soft-text)]",
  neutral:
    "bg-[var(--color-surface-inset)] text-[var(--color-text-secondary)]",
};

export function Badge({
  variant = "neutral",
  dot,
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-tight",
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      )}
      {icon}
      {children}
    </span>
  );
}
