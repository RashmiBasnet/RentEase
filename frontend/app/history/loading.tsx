import { Skeleton } from "../_components/Skeleton";

export default function HistoryLoading() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-2 h-4 w-80" />

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>

      {/* Controls */}
      <Skeleton className="mt-6 h-14 w-full rounded-2xl" />

      {/* Cards */}
      <div className="mt-8 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    </main>
  );
}
