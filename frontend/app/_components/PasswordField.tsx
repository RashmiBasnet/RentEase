"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { cn } from "./cn";

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  action?: ReactNode;
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, error, action, id, className, ...props }, ref) {
    const inputId = id ?? props.name;
    const [show, setShow] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
          {action}
        </div>
        <div
          className={cn(
            "flex items-stretch overflow-hidden rounded-lg border bg-[var(--color-surface)] transition-shadow duration-200 focus-within:shadow-[var(--shadow-focus)]",
            error
              ? "border-[var(--color-danger)] focus-within:border-[var(--color-danger)]"
              : "border-[var(--color-border)] focus-within:border-[var(--color-primary)]"
          )}
        >
          <span className="flex items-center pl-3 text-[var(--color-text-muted)]">
            <LockKeyhole size={18} />
          </span>
          <input
            id={inputId}
            ref={ref}
            type={show ? "text" : "password"}
            aria-invalid={!!error}
            className={cn(
              "w-full bg-transparent py-3 pl-2 pr-2 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="flex items-center px-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          >
            {show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {error && (
          <p className="text-xs text-[var(--color-danger-soft-text)]">{error}</p>
        )}
      </div>
    );
  }
);
