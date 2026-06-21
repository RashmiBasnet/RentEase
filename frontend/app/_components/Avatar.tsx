import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "./cn";

type AvatarProps = {
  name?: string;
  src?: string;
  showName?: boolean;
  size?: number;
  className?: string;
};

function initials(name?: string) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Avatar({
  name,
  src,
  showName = false,
  size = 32,
  className,
}: AvatarProps) {
  const circle = (
    <span
      className="flex items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)]"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? "User"}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : name ? (
        <span className="text-xs font-semibold">{initials(name)}</span>
      ) : (
        <User size={size * 0.55} aria-hidden />
      )}
    </span>
  );

  if (!showName) return <span className={className}>{circle}</span>;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-inset)] py-1 pl-1 pr-4",
        className
      )}
    >
      {circle}
      {name && (
        <span className="text-sm font-medium text-[var(--color-text)]">
          {name}
        </span>
      )}
    </span>
  );
}
