"use client";

import { ChevronDown } from "lucide-react";
import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "./cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  className?: string;
  wrapperClassName?: string;
  children: ReactNode;
};


export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, hint, error, leftIcon, id, className, wrapperClassName, children, ...props },
    ref
  ) {
    const selectId = id ?? props.name;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative flex items-center rounded-lg border bg-[var(--color-surface-inset)] transition-shadow duration-200 focus-within:shadow-[var(--shadow-focus)]",
            error
              ? "border-[var(--color-danger)]"
              : "border-[var(--color-border)] focus-within:border-[var(--color-primary)]"
          )}
        >
          {leftIcon && (
            <span className="pointer-events-none pl-3 text-[var(--color-text-muted)]">
              {leftIcon}
            </span>
          )}
          <select
            id={selectId}
            ref={ref}
            aria-invalid={!!error}
            className={cn(
              "w-full appearance-none bg-transparent py-3 pl-4 pr-10 text-[var(--color-text)] outline-none",
              leftIcon ? "pl-2" : undefined,
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 text-[var(--color-text-muted)]"
            aria-hidden
          />
        </div>

        {(error || hint) && (
          <p
            className={cn(
              "text-xs",
              error
                ? "text-[var(--color-danger-soft-text)]"
                : "text-[var(--color-text-muted)]"
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);
