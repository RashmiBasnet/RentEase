"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "./cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;

  leftIcon?: ReactNode;

  prefix?: string;
  className?: string;
  wrapperClassName?: string;
};


export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    leftIcon,
    prefix,
    id,
    className,
    wrapperClassName,
    ...props
  },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-lg border bg-[var(--color-surface-inset)] transition-shadow duration-200 focus-within:shadow-[var(--shadow-focus)]",
          error
            ? "border-[var(--color-danger)] focus-within:border-[var(--color-danger)]"
            : "border-[var(--color-border)] focus-within:border-[var(--color-primary)]"
        )}
      >
        {prefix && (
          <span className="flex items-center border-r border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 text-sm font-medium text-[var(--color-text-secondary)]">
            {prefix}
          </span>
        )}
        {leftIcon && (
          <span className="flex items-center pl-3 text-[var(--color-text-muted)]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            "w-full bg-transparent px-4 py-3 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]",
            leftIcon && "pl-2",
            className
          )}
          {...props}
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
});
