import { cn } from "../../_components/cn";
import { capitalize, statusTone } from "./adminUtils";

const toneClasses: Record<string, string> = {
  success: "bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]",
  warning: "bg-[#fff4e5] text-[#b54708]",
  danger: "bg-[var(--color-danger-soft-bg)] text-[var(--color-danger-soft-text)]",
  info: "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
  neutral: "bg-[var(--color-surface-inset)] text-[var(--color-text-secondary)]",
};

export function StatusBadge({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        toneClasses[statusTone(status)],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {capitalize(status) || "Unknown"}
    </span>
  );
}
