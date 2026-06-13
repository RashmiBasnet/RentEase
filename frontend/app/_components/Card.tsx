import type { ElementType, ReactNode } from "react";
import { cn } from "./cn";

type CardProps = {
  as?: ElementType;
  padded?: boolean;
  interactive?: boolean;
  muted?: boolean;
  className?: string;
  children: ReactNode;
};

export function Card({
  as: Tag = "div",
  padded = true,
  interactive = false,
  muted = false,
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-sm)]",
        muted
          ? "bg-[var(--color-surface-muted)]"
          : "bg-[var(--color-surface)]",
        padded && "p-6",
        interactive &&
          "transition-shadow duration-200 hover:shadow-[var(--shadow-md)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
