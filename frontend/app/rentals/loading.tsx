import { Skeleton, VehicleCardSkeleton } from "../_components/Skeleton";

export default function RentalsLoading() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
      <Skeleton className="h-9 w-72" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
        {/* Filters */}
        <div className="hidden h-[28rem] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:block">
          <Skeleton className="h-6 w-24" />
          <div className="mt-6 flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>

        {/* Grid */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-44 rounded-lg" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
