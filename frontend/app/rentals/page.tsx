import { getAllVehicles } from "@/lib/api/vehicle/vehicle";
import { getUserData } from "@/lib/cookie";
import { Footer } from "../_components/Footer";
import { SiteNavbar } from "../_components/SiteNavbar";
import { RentalsExplore, type ExploreVehicle } from "./_components/RentalsExplore";

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
  s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;

function toCategory(type?: string): ExploreVehicle["category"] {
  switch (type) {
    case "car":
      return "car";
    case "suv":
    case "van":
      return "suv";
    case "bike":
    case "scooter":
      return "bike-scooter";
    default:
      return "other";
  }
}

async function safe<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

function mapVehicle(v: any): ExploreVehicle {
  const id = String(v._id);
  const reviewCount = Number(v.reviewCount ?? 0);
  return {
    id,
    name: v.title,
    imageUrl: resolveImage(v.images?.[0]) ?? "/images/vehicles/placeholder.png",
    status: v.isAvailable === false ? "booked" : "available",
    verified: v.isVerified,
    rating: reviewCount > 0 ? v.rating : undefined,
    reviewCount: reviewCount > 0 ? reviewCount : undefined,
    transmission: capitalize(v.transmission),
    fuelType: capitalize(v.fuelType),
    seats: v.seats,
    range: v.range,
    isElectric: v.fuelType === "electric",
    pricePerDay: v.pricePerDay,
    href: `/rentals/${id}`,
    category: toCategory(v.type),
  };
}

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search.trim() : "";

  const [user, vehiclesRes] = await Promise.all([
    getUserData(),
    safe(getAllVehicles({ size: 60, search: search || undefined, isAvailable: true })),
  ]);

  const raw: any[] = vehiclesRes?.data?.vehicles ?? [];
  const vehicles = raw
    .filter((v) => v.isAvailable !== false)
    .map(mapVehicle);

  return (
    <>
      <SiteNavbar />

      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
          {search ? "Search Results" : "Explore Vehicle Rentals"}
        </h1>
        {search && (
          <p className="mt-1 text-[var(--color-text-secondary)]">
            {vehicles.length} result{vehicles.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-[var(--color-text)]">
              &ldquo;{search}&rdquo;
            </span>
          </p>
        )}

        <div className="mt-8">
          {vehicles.length > 0 ? (
            <RentalsExplore vehicles={vehicles} />
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-inset)] p-12 text-center">
              <p className="text-[var(--color-text-secondary)]">
                {search
                  ? `No vehicles match “${search}”. Try a different search.`
                  : "No vehicles available right now. Please check back soon."}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
