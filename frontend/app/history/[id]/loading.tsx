import { Skeleton } from "../../_components/Skeleton";

export default function BookingDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-8">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="mt-4 h-28 w-full rounded-2xl" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
