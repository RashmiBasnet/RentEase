import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { getAllVehicles } from "@/lib/api/vehicle/vehicle";
import { Footer } from "../_components/Footer";
import { SiteNavbar } from "../_components/SiteNavbar";
import { NearbyVehicles } from "./_components/NearbyVehicles";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function resolveImage(src?: string) {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  const cleanSrc = src.replace(/^\/+/, "");
  const path = cleanSrc.startsWith("uploads/") ? cleanSrc : `uploads/${cleanSrc}`;
  return `${API_BASE}/${path}`;
}

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "Other";

async function safe<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

type Hub = {
  name: string;
  count: number;
  types: Record<string, number>;
  image?: string;
};

export default async function LocationsPage() {
  const res = await safe(getAllVehicles({ size: 200, isAvailable: true }));
  const vehicles: any[] = res?.data?.vehicles ?? [];

  const hubMap = new Map<string, Hub>();
  for (const v of vehicles) {
    const key = (v.pickupAddress || "Other").trim();
    const hub: Hub = hubMap.get(key) ?? { name: key, count: 0, types: {}, image: undefined };
    hub.count += 1;
    const t = capitalize(v.type);
    hub.types[t] = (hub.types[t] ?? 0) + 1;
    if (!hub.image) hub.image = resolveImage(v.images?.[0]);
    hubMap.set(key, hub);
  }
  const hubs = [...hubMap.values()].sort((a, b) => b.count - a.count);

  return (
    <>
      <SiteNavbar />

      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
            Pickup Locations
          </h1>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Browse rental hubs across Nepal — {vehicles.length} vehicle
            {vehicles.length === 1 ? "" : "s"} available in {hubs.length}{" "}
            location{hubs.length === 1 ? "" : "s"}.
          </p>
        </header>

        <div className="mt-8">
          <NearbyVehicles />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-extrabold text-[var(--color-text)]">
            All Locations
          </h2>

          {hubs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-inset)] p-12 text-center">
              <p className="text-[var(--color-text-secondary)]">
                No pickup locations available right now. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hubs.map((hub) => (
                <Link
                  key={hub.name}
                  href={`/rentals?search=${encodeURIComponent(hub.name)}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] no-underline shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
                >
                  <div className="relative h-32 w-full bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-50)]">
                    {hub.image && (
                      <img
                        src={hub.image}
                        alt={hub.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-[var(--color-surface)]/95 px-2.5 py-1 text-xs font-bold text-[var(--color-text)] shadow-[var(--shadow-sm)]">
                      {hub.count} available
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="flex items-start gap-1.5 text-base font-bold text-[var(--color-text)]">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                      />
                      <span className="line-clamp-2">{hub.name}</span>
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(hub.types).map(([type, n]) => (
                        <span
                          key={type}
                          className="rounded-lg bg-[var(--color-surface-inset)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
                        >
                          {type} · {n}
                        </span>
                      ))}
                    </div>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] group-hover:gap-2.5">
                      View vehicles
                      <ArrowRight size={16} className="transition-all" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
