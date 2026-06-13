import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "./cn";

type FeatureTone = "primary" | "success" | "warning";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  tone?: FeatureTone;
  className?: string;
};

const toneClasses: Record<FeatureTone, string> = {
  primary: "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
  success: "bg-[var(--color-success-soft-bg)] text-[var(--color-success)]",
  warning: "bg-[#fef0e0] text-[var(--color-warning)]",
};


export function FeatureCard({
  icon,
  title,
  description,
  tone = "primary",
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn("flex flex-col gap-4", className)}>
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl",
          toneClasses[tone]
        )}
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <h3 className="text-xl font-bold text-[var(--color-text)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </Card>
  );
}
