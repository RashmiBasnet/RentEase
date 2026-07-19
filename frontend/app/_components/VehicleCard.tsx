import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Cog, Fuel, Users, Zap } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { Price } from "./Price";
import { SpecChip } from "./SpecChip";
import { StarRating } from "./StarRating";
import { cn } from "./cn";

export type Vehicle = {
  id: string;
  name: string;
  imageUrl: string;
  status: "available" | "booked";
  verified?: boolean;
  rating?: number;
  reviewCount?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;

  range?: string;
  isElectric?: boolean;
  pricePerDay: number;

  /** Details page for the vehicle — the whole card links here. */
  href?: string;
  /** Booking flow entry point. Falls back to `href` when not supplied. */
  bookHref?: string;
};

type VehicleCardProps = {
  vehicle: Vehicle;
  className?: string;
};


export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const {
    name,
    imageUrl,
    status,
    verified,
    rating,
    reviewCount,
    transmission,
    fuelType,
    seats,
    range,
    isElectric,
    pricePerDay,
    href,
    bookHref,
  } = vehicle;

  const isAvailable = status === "available";

  return (
    <Card
      padded={false}
      interactive={!!href}
      className={cn("relative flex flex-col overflow-hidden", className)}
    >
      {/* Stretched link — makes the whole card navigate to the details page. */}
      {href && (
        <Link
          href={href}
          aria-label={`View details for ${name}`}
          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        />
      )}

      <div className="relative aspect-[16/10] w-full bg-[var(--color-surface-inset)]">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
        <span className="absolute right-3 top-3">
          {isAvailable ? (
            <Badge variant="available" dot>
              Available
            </Badge>
          ) : (
            <Badge variant="booked" dot>
              Booked
            </Badge>
          )}
        </span>
        {isElectric && (
          <span className="absolute bottom-3 left-3">
            <Badge variant="neutral" icon={<Zap size={12} />}>
              Electric
            </Badge>
          </span>
        )}
      </div>


      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          {verified && (
            <Badge variant="verified" icon={<BadgeCheck size={14} />}>
              Verified
            </Badge>
          )}
          {rating !== undefined && (
            <StarRating rating={rating} reviewCount={reviewCount} />
          )}
        </div>

        <h3 className="mt-3 text-lg font-bold text-[var(--color-text)]">
          {name}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {transmission && (
            <SpecChip icon={<Cog size={14} />}>{transmission}</SpecChip>
          )}
          {range ? (
            <SpecChip icon={<Zap size={14} />}>{range}</SpecChip>
          ) : (
            fuelType && <SpecChip icon={<Fuel size={14} />}>{fuelType}</SpecChip>
          )}
          {seats !== undefined && (
            <SpecChip icon={<Users size={14} />}>{seats} Seats</SpecChip>
          )}
        </div>

        <hr className="my-4 border-[var(--color-border)]" />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <Price amount={pricePerDay} per="day" size="sm" />
          {isAvailable ? (
            <Button href={bookHref ?? href} size="sm" className="relative z-20">
              Quick Book
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="relative z-20" disabled>
              Notify Me
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
