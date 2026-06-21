import { cn } from "./cn";

type PriceProps = {
  amount: number;

  currency?: "Rs." | "NPR" | "₨";

  per?: string;

  prefix?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const amountSize = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl",
} as const;


export function Price({
  amount,
  currency = "Rs.",
  per,
  prefix,
  size = "md",
  className,
}: PriceProps) {
  return (
    <div className={cn("leading-tight", className)}>
      {prefix && (
        <span className="block text-xs text-[var(--color-text-muted)]">
          {prefix}
        </span>
      )}
      <span className="font-[family-name:var(--font-display)] font-bold text-[var(--color-primary)]">
        <span className="text-sm font-semibold align-baseline">
          {currency}{" "}
        </span>
        <span className={amountSize[size]}>
          {amount.toLocaleString("en-US")}
        </span>
      </span>
      {per && (
        <span className="text-xs text-[var(--color-text-muted)]">/{per}</span>
      )}
    </div>
  );
}
