import Link from "next/link";
import { CarFront, Search } from "lucide-react";

export default function VehicleNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[var(--container-max)] flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-inset)] text-[var(--color-text-muted)]">
        <CarFront size={30} />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-[var(--color-text)]">
        Vehicle not found
      </h1>
      <p className="mt-2 max-w-md text-[var(--color-text-secondary)]">
        This vehicle may have been removed or is no longer available. Let&apos;s
        find you another great ride.
      </p>
      <Link
        href="/rentals"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-on-primary)] no-underline transition-colors hover:bg-[var(--color-primary-hover)]"
      >
        <Search size={18} />
        Browse available vehicles
      </Link>
    </main>
  );
}
