import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  Car,
  Cog,
  Fuel,
  Gauge,
  Mountain,
  ReceiptText,
  ShieldCheck,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";
import { FeatureCard } from "./_components/FeatureCard";
import { FleetCard, type FleetSpec } from "./_components/FleetCard";

const features = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Verified Vehicles",
    description:
      "Every vehicle is reviewed and verified to ensure accurate information, quality standards, and a safer rental experience.",
    tone: "primary" as const,
  },
  {
    icon: <ReceiptText size={22} />,
    title: "Transparent Pricing",
    description:
      "Know exactly what you're paying for with clear pricing, detailed cost breakdowns, and no hidden charges.",
    tone: "success" as const,
  },
  {
    icon: <Zap size={22} />,
    title: "Quick & Easy Booking",
    description:
      "Find, compare, and book vehicles in just a few steps with a simple and user-friendly booking process.",
    tone: "warning" as const,
  },
];

const spec = (icon: React.ReactNode, label: string): FleetSpec => ({
  icon,
  label,
});

const fleet = [
  {
    name: "Maruti Suzuki Swift",
    pricePerDay: 3500,
    verified: true,
    accent: "from-[#2563eb] to-[#60a5fa]",
    icon: <Car size={56} strokeWidth={1.5} />,
    specs: [
      spec(<Cog size={14} />, "Manual"),
      spec(<Users size={14} />, "5 Seats"),
      spec(<Fuel size={14} />, "Petrol"),
    ],
  },
  {
    name: "Mahindra Thar 4×4",
    pricePerDay: 8500,
    verified: true,
    accent: "from-[#334155] to-[#64748b]",
    icon: <Car size={56} strokeWidth={1.5} />,
    specs: [
      spec(<Cog size={14} />, "Manual"),
      spec(<Users size={14} />, "4 Seats"),
      spec(<Mountain size={14} />, "4WD"),
    ],
  },
  {
    name: "Royal Enfield Scram",
    pricePerDay: 2200,
    verified: true,
    accent: "from-[#0f172a] to-[#475569]",
    icon: <Bike size={56} strokeWidth={1.5} />,
    specs: [
      spec(<Gauge size={14} />, "411cc"),
      spec(<Users size={14} />, "2 Seats"),
    ],
  },
  {
    name: "Hyundai i20",
    pricePerDay: 4200,
    verified: true,
    accent: "from-[#0f766e] to-[#39c6a2]",
    icon: <Car size={56} strokeWidth={1.5} />,
    specs: [
      spec(<Cog size={14} />, "Automatic"),
      spec(<Users size={14} />, "5 Seats"),
    ],
  },
];

export default function Home() {
  return (
    <>
      <Navbar />


      <section className="relative isolate w-full overflow-hidden bg-slate-950">

        <div className="relative aspect-[3/2] max-h-[660px] w-full sm:aspect-[16/9]">
          <Image
            src="/images/landing_pic.png"
            alt="Vehicle on a scenic mountain road"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,33,58,0.40)_0%,rgba(3,36,66,0.18)_45%,rgba(0,24,71,0.72)_100%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl">
              Rent Smart, Travel Easy
            </h1>
            <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-white/90 sm:text-base">
              Find verified vehicles, transparent pricing, and hassle-free
              booking. RentEase helps you travel with confidence wherever the
              road takes you.
            </p>
          </div>
        </div>
      </section>

      <main>

        <section className="mx-auto max-w-[var(--container-max)] px-6 py-20">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
              Why Book with RentEase?
            </h2>
            <span className="mt-3 h-1 w-16 rounded-full bg-[var(--color-primary)]" />
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>


        <section className="mx-auto max-w-[var(--container-max)] px-6 pb-20">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-[var(--color-text)] sm:text-3xl">
              Pick Your Rentals
            </h2>
            <Link
              href="/rentals"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--color-primary)] no-underline hover:underline"
            >
              View All Fleet
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fleet.map((vehicle) => (
              <FleetCard key={vehicle.name} {...vehicle} />
            ))}
          </div>
        </section>


        <section className="mx-auto max-w-[var(--container-max)] px-6 pb-24">
          <div className="grid gap-6 lg:grid-cols-2">

            <div className="relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0b2a5b_0%,#15489e_100%)] p-9">
              <h3 className="text-3xl font-extrabold text-white">
                Reviews &amp; Ratings
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                Read authentic ratings and experiences from previous renters to
                make confident booking decisions.
              </p>
              <Link
                href="/reviews"
                className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] no-underline transition-colors hover:bg-white/90 hover:no-underline"
              >
                View More
              </Link>
            </div>


            <div className="relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#a86b12_0%,#c8881c_100%)] p-9">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white"
                aria-hidden
              >
                <Tag size={22} />
              </span>
              <h3 className="mt-5 text-3xl font-extrabold text-white">
                Fast &amp; Easy Booking
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                Find, compare, and reserve your vehicle in just a few simple
                steps with a streamlined booking process designed to save time.
              </p>
              <Link
                href="/rentals"
                className="mt-6 inline-flex w-fit items-center gap-1 text-sm font-semibold text-white underline-offset-4 hover:underline"
              >
                Learn more about Booking Process
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
