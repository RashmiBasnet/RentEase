import { Skeleton } from "../../_components/Skeleton";

export default function VehicleDetailsLoading() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-8">
      <Skeleton className="h-5 w-32" />

      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Left */}
        <div>
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <div className="mt-3 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-24 rounded-xl" />
            ))}
          </div>

          <Skeleton className="mt-6 h-8 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/3" />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>

          <Skeleton className="mt-8 h-5 w-48" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
        </div>

        {/* Booking panel */}
        <div className="h-fit rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <Skeleton className="h-9 w-40" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="mt-4 h-16 w-full" />
          <Skeleton className="mt-4 h-12 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
