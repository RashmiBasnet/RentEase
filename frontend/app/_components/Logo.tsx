import Link from "next/link";
import { cn } from "./cn";

type LogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
} as const;


export function Logo({ href = "/", size = "md", className }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="RentEase home"
      className={cn(
        "font-[family-name:var(--font-display)] font-extrabold tracking-tight text-[var(--color-primary)] no-underline hover:no-underline",
        sizeMap[size],
        className
      )}
    >
      RentEase
    </Link>
  );
}
