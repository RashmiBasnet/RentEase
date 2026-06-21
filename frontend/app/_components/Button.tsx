"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "./cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold leading-none no-underline hover:no-underline transition-colors duration-200 active:translate-y-px focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)]",
  outline:
    "border-[1.5px] border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-50)]",
  ghost:
    "bg-[var(--color-surface-inset)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children?: ReactNode;
};

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export function Button(props: AsButton | AsLink) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    leftIcon,
    rightIcon,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {leftIcon}
      {children}
      {rightIcon}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<AsLink, keyof CommonProps>;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
