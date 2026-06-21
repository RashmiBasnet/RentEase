import { BadgeCheck, Car } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { SpecChip } from "./SpecChip";
import { cn } from "./cn";

export type RentalSpec = { icon: ReactNode; label: string };

type RentalCardProps = {
  id: string;
  name: string;
  subtitle?: string;
  pricePerDay: number;
  currency?: string;
  specs: RentalSpec[];
  verified?: boolean;
  imageUrl?: string;
  className?: string;
};

function formatPrice(amount: number) {
  const k = amount / 1000;
  return `${Number.isInteger(k) ? k : Number(k.toFixed(1))}k`;
}

export function RentalCard({
  id,
  name,
  subtitle,
  pricePerDay,
  currency = "NPR",
  specs,
  verified,
  imageUrl,
  className,
}: RentalCardProps) {
  return (
    <Card padded={false} interactive className={cn("flex flex-col overflow-hidden", className)}>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-inset)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-50)] text-[var(--color-primary)]/40">
            <Car size={56} strokeWidth={1.5} />
          </div>
        )}
        {verified && (
          <span className="absolute right-3 top-3">
            <Badge variant="available" icon={<BadgeCheck size={14} />}>
              Verified
            </Badge>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-h-[2.75rem]">
            <h3 className="text-base font-bold leading-snug text-[var(--color-text)]">
              {name}
            </h3>
            {subtitle && (
              <p className="text-sm text-[var(--color-text-muted)]">{subtitle}</p>
            )}
          </div>
          <div className="text-right leading-tight">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-primary)]">
              {currency} {formatPrice(pricePerDay)}
            </span>
            <span className="block text-xs text-[var(--color-text-muted)]">per day</span>
          </div>
        </div>

        <div className="mt-3 mb-4 flex flex-wrap gap-2">
          {specs.map((s) => (
            <SpecChip key={s.label} icon={s.icon}>
              {s.label}
            </SpecChip>
          ))}
        </div>

        <Button href={`/rentals/${id}`} variant="outline" fullWidth className="mt-auto">
          View Details
        </Button>
      </div>
    </Card>
  );
}
