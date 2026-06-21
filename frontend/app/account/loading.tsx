import { Skeleton } from "../_components/Skeleton";

export default function AccountLoading() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <Skeleton className="mx-auto h-28 w-28 rounded-full" />
          <Skeleton className="mx-auto mt-4 h-6 w-40" />
          <Skeleton className="mx-auto mt-2 h-4 w-48" />
          <Skeleton className="mx-auto mt-4 h-9 w-full rounded-xl" />
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <Skeleton className="h-6 w-40" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
          <Skeleton className="mt-6 ml-auto h-12 w-40 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
