import { notFound, redirect } from "next/navigation";
import { handleGetVehicleById } from "@/lib/actions/vehicle-action";
import { getUserData } from "@/lib/cookie";
import { Footer } from "../../../_components/Footer";
import { SiteNavbar } from "../../../_components/SiteNavbar";
import { Checkout, type CheckoutVehicle } from "./_components/Checkout";

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

const dayCount = (start: string, end: string) => {
  const diff = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000
  );
  return diff > 0 ? diff : 0;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const start = typeof sp.start === "string" ? sp.start : "";
  const end = typeof sp.end === "string" ? sp.end : "";
  const pickup = typeof sp.pickup === "string" ? sp.pickup : "";
  const notes = typeof sp.notes === "string" ? sp.notes : undefined;

  // Without valid dates there's nothing to pay for — send the user back to pick them.
  const days = start && end ? dayCount(start, end) : 0;
  if (!start || !end || days <= 0) {
    redirect(`/rentals/${id}`);
  }

  const [user, vehicleRes] = await Promise.all([
    getUserData(),
    handleGetVehicleById(id),
  ]);

  if (!vehicleRes.success || !vehicleRes.data) {
    notFound();
  }

  const v = vehicleRes.data;
  const vehicle: CheckoutVehicle = {
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

      <main className="mx-auto w-full max-w-[var(--container-max)] px-6 py-10">
        <Checkout
          vehicle={vehicle}
          startDate={start}
          endDate={end}
          pickup={pickup}
          notes={notes}
          days={days}
        />
      </main>

      <Footer />
    </>
  );
}
