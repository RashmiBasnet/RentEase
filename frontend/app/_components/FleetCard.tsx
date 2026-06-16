import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { Price } from "./Price";
import { SpecChip } from "./SpecChip";
import { cn } from "./cn";

export type FleetSpec = { icon: ReactNode; label: string };

type FleetCardProps = {
  name: string;
  pricePerDay: number;
  per?: string;
  specs: FleetSpec[];
  verified?: boolean;

  imageUrl?: string;

  accent?: string;

  icon?: ReactNode;
  href?: string;
  className?: string;
};


export function FleetCard({
  name,
  pricePerDay,
  per = "day",
  specs,
  verified,
  imageUrl,
  accent = "from-[var(--color-primary-100)] to-[var(--color-primary-50)]",
  icon,
  href = "#",
  className,
}: FleetCardProps) {
  return (
    <Card
      padded={false}
      interactive
      className={cn("flex flex-col overflow-hidden", className)}
    >
      <div className="relative aspect-[16/11] w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br text-white/70",
              accent
            )}
            aria-hidden
          >
            {icon}
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
          <h3 className="min-h-[2.75rem] text-base font-bold leading-snug text-[var(--color-text)]">
            {name}
          </h3>
          <Price amount={pricePerDay} per={per} size="md" className="text-right" />
        </div>

        <div className="mt-3 mb-4 flex flex-wrap gap-2">
          {specs.map((spec) => (
            <SpecChip key={spec.label} icon={spec.icon}>
              {spec.label}
            </SpecChip>
          ))}
        </div>

        <Button href={href} variant="outline" fullWidth className="mt-auto">
          Book Now
        </Button>
      </div>
    </Card>
  );
}
