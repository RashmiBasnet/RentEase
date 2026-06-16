import { CalendarDays, MapPin, Settings } from "lucide-react";
import { Button } from "../../_components/Button";

type ActiveTripCardProps = {
  bookingId: string;
  vehicleTitle: string;
  returnDate: string | Date;
  location?: string;
  imageUrl?: string;
  statusLabel?: string;
};

function formatDate(date: string | Date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ActiveTripCard({
  bookingId,
  vehicleTitle,
  returnDate,
  location,
  imageUrl,
  statusLabel = "Active Trip",
}: ActiveTripCardProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-slate-900">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={vehicleTitle}
          className="absolute inset-y-0 right-0 h-full w-2/3 object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.97)_0%,rgba(15,23,42,0.85)_45%,rgba(15,23,42,0.35)_100%)]" />

      <div className="relative flex flex-col gap-5 p-8 sm:p-10">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-success)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
          {statusLabel}
        </span>

        <div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            {vehicleTitle}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={16} className="text-[var(--color-success)]" />
              Return: {formatDate(returnDate)}
            </span>
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} className="text-[var(--color-success)]" />
                {location}
              </span>
            )}
          </div>
        </div>

        <Button
          href={`/bookings/${bookingId}`}
          size="md"
          className="w-fit"
          leftIcon={<Settings size={16} />}
        >
          Manage Trip
        </Button>
      </div>
    </section>
  );
}
