import Link from "next/link";
import { CalendarCheck, Car, Flag, Star } from "lucide-react";
import { handleGetAllVehicles } from "@/lib/actions/vehicle-action";
import { handleGetAllBookings } from "@/lib/actions/booking-action";
import { handleGetAllReports } from "@/lib/actions/report-action";
import { handleGetAllReviews } from "@/lib/actions/review-action";
import { Card } from "../_components/Card";
import { StatusBadge } from "./_components/StatusBadge";
import { capitalize, formatDate, formatMoney } from "./_components/adminUtils";

const num = (n: unknown) => (typeof n === "number" ? n : 0);

export default async function AdminDashboardPage() {
  const [vehiclesRes, bookingsRes, reportsRes, reviewsRes] = await Promise.all([
    handleGetAllVehicles({ size: 1 }),
    handleGetAllBookings({ size: 5 }),
    handleGetAllReports(),
    handleGetAllReviews(),
  ]);

  const stats = [
    {
      label: "Vehicles",
      value: num(vehiclesRes.data?.total),
      href: "/admin/vehicles",
      icon: Car,
    },
    {
      label: "Bookings",
      value: num(bookingsRes.data?.total),
      href: "/admin/bookings",
      icon: CalendarCheck,
    },
    {
      label: "Reports",
      value: num(reportsRes.data?.total),
      href: "/admin/reports",
      icon: Flag,
    },
    {
      label: "Reviews",
      value: num(reviewsRes.data?.total),
      href: "/admin/reviews",
      icon: Star,
    },
  ];

  const recentBookings: any[] = bookingsRes.data?.bookings ?? [];
  const reports: any[] = reportsRes.data?.reports ?? [];
  const pendingReports = reports.filter((r) => r.status === "pending");

  return (
    <div>
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Overview of everything happening on RentEase.
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="no-underline">
            <Card interactive className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                <Icon size={22} />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-[var(--color-text)]">
                  {value}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent bookings */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--color-text)]">
              Recent Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-sm font-semibold text-[var(--color-primary)] no-underline hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-[var(--color-border)]">
            {recentBookings.length === 0 && (
              <li className="py-6 text-center text-sm text-[var(--color-text-muted)]">
                No bookings yet.
              </li>
            )}
            {recentBookings.map((b) => (
              <li
                key={String(b._id)}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                    {b.vehicleId?.title ?? "Vehicle"}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">
                    {b.userId?.fullName ?? "User"} · {formatDate(b.startDate)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-[var(--color-text)]">
                    {formatMoney(b.totalAmount)}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Pending reports */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--color-text)]">
              Pending Reports
            </h2>
            <Link
              href="/admin/reports"
              className="text-sm font-semibold text-[var(--color-primary)] no-underline hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-[var(--color-border)]">
            {pendingReports.length === 0 && (
              <li className="py-6 text-center text-sm text-[var(--color-text-muted)]">
                No pending reports. 🎉
              </li>
            )}
            {pendingReports.slice(0, 5).map((r) => (
              <li
                key={String(r._id)}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                    {r.vehicleId?.title ?? "Vehicle"}
                  </p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">
                    {capitalize(String(r.reason).replace(/_/g, " "))}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
