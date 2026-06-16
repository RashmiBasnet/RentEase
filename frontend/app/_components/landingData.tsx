import type { ReactNode } from "react";
import {
  Bike,
  Car,
  Cog,
  Fuel,
  Gauge,
  Mountain,
  ReceiptText,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import type { FleetSpec } from "./FleetCard";

type FeatureTone = "primary" | "success" | "warning";

export type LandingFeature = {
  icon: ReactNode;
  title: string;
  description: string;
  tone: FeatureTone;
};

export type LandingVehicle = {
  name: string;
  pricePerDay: number;
  verified: boolean;
  imageUrl: string;
  accent: string;
  icon: ReactNode;
  specs: FleetSpec[];
};

const spec = (icon: ReactNode, label: string): FleetSpec => ({
  icon,
  label,
});

export const landingFeatures: LandingFeature[] = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Verified Vehicles",
    description:
      "Every vehicle is reviewed and verified to ensure accurate information, quality standards, and a safer rental experience.",
    tone: "primary",
  },
  {
    icon: <ReceiptText size={22} />,
    title: "Transparent Pricing",
    description:
      "Know exactly what you're paying for with clear pricing, detailed cost breakdowns, and no hidden charges.",
    tone: "success",
  },
  {
    icon: <Zap size={22} />,
    title: "Quick & Easy Booking",
    description:
      "Find, compare, and book vehicles in just a few steps with a simple and user-friendly booking process.",
    tone: "warning",
  },
];

export const landingFleet: LandingVehicle[] = [
  {
    name: "Maruti Suzuki Swift",
    pricePerDay: 3500,
    verified: true,
    imageUrl: "/images/vehicles/maruti.png",
    accent: "from-[#2563eb] to-[#60a5fa]",
    icon: <Car size={56} strokeWidth={1.5} />,
    specs: [
      spec(<Cog size={14} />, "Manual"),
      spec(<Users size={14} />, "5 Seats"),
      spec(<Fuel size={14} />, "Petrol"),
    ],
  },
  {
    name: "Mahindra Thar 4x4",
    pricePerDay: 8500,
    verified: true,
    imageUrl: "/images/vehicles/thar.png",
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
    imageUrl: "/images/vehicles/royal.png",
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
    imageUrl: "/images/vehicles/hyundai.png",
    accent: "from-[#0f766e] to-[#39c6a2]",
    icon: <Car size={56} strokeWidth={1.5} />,
    specs: [
      spec(<Cog size={14} />, "Automatic"),
      spec(<Users size={14} />, "5 Seats"),
    ],
  },
];
