import Link from "next/link";
import { Cog, ExternalLink, Fuel, Users } from "lucide-react";
import { getAllVehicles } from "@/lib/api/vehicle/vehicle";
import { getMyBookings } from "@/lib/api/booking/booking";
import { getUserData } from "@/lib/cookie";
import { ActiveTripCard } from "./ActiveTripCard";
import { Footer } from "../../_components/Footer";
import { Navbar } from "../../_components/Navbar";
import { RentalCard, type RentalSpec } from "../../_components/RentalCard";
import { RentalSearch } from "../../_components/RentalSearch";

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
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

async function safe<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

export async function HomeDashboard() {
  const [user, vehiclesRes, bookingsRes] = await Promise.all([
    getUserData(),
    safe(getAllVehicles({ size: 3 })),
    safe(getMyBookings()),
  ]);

  const firstName = user?.fullName?.split(" ")[0] ?? "Traveler";

  const vehicles: any[] = vehiclesRes?.data?.vehicles ?? [];
  const bookings: any[] = Array.isArray(bookingsRes?.data) ? bookingsRes.data : [];
  const activeTrip =
    bookings.find((b) => b.status === "active") ??
    bookings.find((b) => b.status === "confirmed");

  const buildSpecs = (v: any): RentalSpec[] => {
    const specs: RentalSpec[] = [];
    if (v.transmission) {
      specs.push({
        icon: <Cog size={14} />,
        label: v.transmission === "automatic" ? "Auto" : "Manual",
      });
    }
    if (v.seats !== undefined) {
      specs.push({ icon: <Users size={14} />, label: `${v.seats} Seats` });
    }
    if (v.fuelType) {
      specs.push({ icon: <Fuel size={14} />, label: capitalize(v.fuelType) });
    }
    return specs;
  };

  return (
    <>
      <Navbar
        user={{ name: user?.fullName ?? "Account" }}
        links={[
          { label: "Home", href: "/home" },
          { label: "Rentals", href: "/rentals" },
          { label: "Locations", href: "/locations" },
          { label: "History", href: "/history" },
        ]}
      />

      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
        {/* Greeting */}
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
            Namaste, {firstName}!
          </h1>
          <p className="mt-2 max-w-xl text-[var(--color-text-secondary)]">
            Your journey through the Himalayas is waiting. Manage your active
            rentals or plan your next escape.
          </p>
        </header>

        {/* Search */}
        <div className="mt-8">
          <RentalSearch />
        </div>

        {/* Active trip */}
        {activeTrip && (
          <div className="mt-10">
            <ActiveTripCard
              bookingId={String(activeTrip._id)}
              vehicleTitle={activeTrip.vehicleId?.title ?? "Your booking"}
              returnDate={activeTrip.endDate}
              location={activeTrip.pickupAddress}
              imageUrl={resolveImage(activeTrip.vehicleId?.images?.[0])}
              statusLabel={activeTrip.status === "active" ? "Active Trip" : "Confirmed"}
            />
          </div>
        )}

        {/* Discover */}
        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
              Discover Vehicle Rentals
            </h2>
            <Link
              href="/rentals"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--color-primary)] no-underline hover:underline"
            >
              See All
              <ExternalLink size={15} />
            </Link>
          </div>

          {vehicles.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <RentalCard
                  key={String(v._id)}
                  id={String(v._id)}
                  name={v.title}
                  subtitle={capitalize(v.type)}
                  pricePerDay={v.pricePerDay}
                  verified={v.isVerified}
                  imageUrl={resolveImage(v.images?.[0])}
                  specs={buildSpecs(v)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-inset)] p-10 text-center">
              <p className="text-[var(--color-text-secondary)]">
                No vehicles available right now. Please check back soon.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
