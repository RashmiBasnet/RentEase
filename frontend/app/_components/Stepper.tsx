import { Check } from "lucide-react";
import { cn } from "./cn";

type StepperProps = {
  steps: string[];

  current: number;
  className?: string;
};


export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol
      className={cn(
        "mx-auto flex w-full max-w-xl items-start justify-between",
        className
      )}
    >
      {steps.map((label, i) => {
        const step = i + 1;
        const isComplete = step < current;
        const isActive = step === current;
        const isLast = i === steps.length - 1;

        return (
          <li
            key={label}
            className="relative flex flex-1 flex-col items-center"
          >

            {!isLast && (
              <span
                className={cn(
                  "absolute left-1/2 top-4 -z-0 h-0.5 w-full",
                  isComplete
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-border-strong)]"
                )}
                aria-hidden
              />
            )}

            <span
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                isComplete &&
                  "bg-[var(--color-primary)] text-[var(--color-on-primary)]",
                isActive &&
                  "bg-[var(--color-primary)] text-[var(--color-on-primary)] ring-4 ring-[var(--color-primary-100)]",
                !isComplete &&
                  !isActive &&
                  "bg-[var(--color-surface-inset)] text-[var(--color-text-muted)]"
              )}
            >
              {isComplete ? <Check size={16} aria-hidden /> : step}
            </span>

            <span
              className={cn(
                "mt-2 text-sm font-medium",
                isActive || isComplete
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)]"
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
