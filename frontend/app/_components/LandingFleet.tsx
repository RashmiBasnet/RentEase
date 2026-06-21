import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FleetCard } from "./FleetCard";
import { landingFleet } from "./landingData";

export function LandingFleet() {
  return (
    <section className="mx-auto max-w-[var(--container-max)] px-6 pb-20">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
          Pick Your Rentals
        </h2>
        <Link
          href="/rentals"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--color-primary)] no-underline hover:underline"
        >
          View All Fleet
          <ArrowRight size={16} />
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {landingFleet.map((vehicle) => (
          <FleetCard key={vehicle.name} {...vehicle} />
        ))}
      </div>
    </section>
  );
}
