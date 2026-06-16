"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "./cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  prefix?: string;
  error?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, icon, prefix, error, id, className, ...props }, ref) {
    const inputId = id ?? props.name;
    const hasAdornment = !!icon || !!prefix;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
        <div
          className={cn(
            "flex items-stretch overflow-hidden rounded-lg border bg-[var(--color-surface)] transition-shadow duration-200 focus-within:shadow-[var(--shadow-focus)]",
            error
              ? "border-[var(--color-danger)] focus-within:border-[var(--color-danger)]"
              : "border-[var(--color-border)] focus-within:border-[var(--color-primary)]"
          )}
        >
          {icon && (
            <span className="flex items-center pl-3 text-[var(--color-text-muted)]">
              {icon}
            </span>
          )}
          {prefix && (
            <span className="flex items-center pl-4 text-sm font-medium text-[var(--color-text-muted)]">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            className={cn(
              "w-full bg-transparent py-3 pr-4 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]",
              hasAdornment ? "pl-2" : "pl-4",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[var(--color-danger-soft-text)]">{error}</p>
        )}
      </div>
    );
  }
);
