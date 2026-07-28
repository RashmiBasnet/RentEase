import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { handleGetVehicleById } from "@/lib/actions/vehicle-action";
import { getUserData } from "@/lib/cookie";
import { Footer } from "../../../_components/Footer";
import { SiteNavbar } from "../../../_components/SiteNavbar";
import { BookingDetails, type BookingVehicle } from "./_components/BookingDetails";

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

export default async function BookingDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const pick = (key: string) => (typeof sp[key] === "string" ? sp[key] : undefined);

  const [user, vehicleRes] = await Promise.all([
    getUserData(),
    handleGetVehicleById(id),
  ]);

  if (!vehicleRes.success || !vehicleRes.data) {
    notFound();
  }

  const v = vehicleRes.data;
  const vehicle: BookingVehicle = {
    id,
    title: v.title,
    imageUrl: resolveImage(v.images?.[0]),
    transmission: capitalize(v.transmission),
    fuelType: capitalize(v.fuelType),
    seats: v.seats,
    isVerified: v.isVerified,
    pricePerDay: v.pricePerDay,
    deposit: v.deposit,
    insuranceIncluded: v.insurance?.included ?? true,
  };

  return (
    <>
      <SiteNavbar />

      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-8">
        <Link
          href={`/rentals/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={16} />
          Back to vehicle details
        </Link>

        <div className="mt-6">
          <BookingDetails
            vehicle={vehicle}
            driver={{
              fullName: user?.fullName ?? "",
              email: user?.email ?? "",
              phone: user?.phone ?? "",
            }}
            initial={{
              start: pick("start"),
              end: pick("end"),
              pickup: pick("pickup"),
            }}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
