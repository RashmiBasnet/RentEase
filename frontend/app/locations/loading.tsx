import { Skeleton } from "../_components/Skeleton";

export default function LocationsLoading() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-2 h-4 w-96" />

      <Skeleton className="mt-8 h-24 w-full rounded-2xl" />

      <Skeleton className="mt-10 h-7 w-40" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    </main>
  );
}
