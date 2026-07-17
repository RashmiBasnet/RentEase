"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  DollarSign,
  Search,
} from "lucide-react";
import { cn } from "../../_components/cn";
import { Pagination } from "../../rentals/_components/Pagination";
import { BookingHistoryCard, type HistoryBooking } from "./BookingHistoryCard";

type TabKey = "all" | "active" | "upcoming" | "completed" | "cancelled";

const PAGE_SIZE = 6;

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const matches = (b: HistoryBooking, key: TabKey) => {
  switch (key) {
    case "all":
      return true;
    case "active":
      return b.status === "active";
    case "upcoming":
      return b.status === "pending" || b.status === "confirmed";
    case "completed":
      return b.status === "completed";
    case "cancelled":
      return b.status === "cancelled";
  }
};

const isUpcomingGroup = (b: HistoryBooking) =>
  ["pending", "confirmed", "active"].includes(b.status);

export function BookingHistory({ bookings }: { bookings: HistoryBooking[] }) {
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [tab, search, sort]);

  const stats = useMemo(() => {
    const completed = bookings.filter((b) => b.status === "completed").length;
    const days = bookings.reduce((sum, b) => sum + (b.days || 0), 0);
    const spent = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.total || 0), 0);
    return { total: bookings.length, completed, days, spent };
  }, [bookings]);

  const count = (key: TabKey) =>
    bookings.filter((b) => matches(b, key)).length;

  const processed = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = bookings.filter((b) => {
      if (!matches(b, tab)) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) || b.ref.toLowerCase().includes(q)
      );
    });
    return filtered.sort((a, b) => {
      const diff =
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      return sort === "newest" ? diff : -diff;
    });
  }, [bookings, tab, search, sort]);

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.total,
      icon: CalendarDays,
      tint: "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CircleCheck,
      tint: "bg-[var(--color-success-soft-bg)] text-[var(--color-success-soft-text)]",
    },
    {
      label: "Rental Days",
      value: stats.days,
      icon: Clock,
      tint: "bg-[var(--color-warning-soft-bg)] text-[var(--color-warning-soft-text)]",
    },
    {
      label: "Total Spent",
      value: `NPR ${stats.spent.toLocaleString("en-US")}`,
      icon: DollarSign,
      tint: "bg-[var(--color-danger-soft-bg)] text-[var(--color-danger-soft-text)]",
    },
  ];

  /* ----- Rendering of the list area ----- */
  let listArea: React.ReactNode;

  if (processed.length === 0) {
    listArea = (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center text-[var(--color-text-muted)]">
        No bookings found.
      </div>
    );
  } else if (tab === "all") {
    const upcoming = processed.filter(isUpcomingGroup);
    const past = processed.filter((b) => !isUpcomingGroup(b));
    const totalPages = Math.max(1, Math.ceil(past.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const pastPage = past.slice(
      (current - 1) * PAGE_SIZE,
      current * PAGE_SIZE
    );

    listArea = (
      <div className="flex flex-col gap-10">
        {upcoming.length > 0 && (
          <section>
            <SectionHeading title="Active & Upcoming" count={upcoming.length} />
            <div className="mt-4 flex flex-col gap-4">
              {upcoming.map((b) => (
                <BookingHistoryCard key={b.id} booking={b} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <SectionHeading title="Past Rentals" count={past.length} />
            <div className="mt-4 flex flex-col gap-4">
              {pastPage.map((b) => (
                <BookingHistoryCard key={b.id} booking={b} />
              ))}
            </div>
            <PageFooter
              page={current}
              totalPages={totalPages}
              total={past.length}
              onChange={setPage}
            />
          </section>
        )}
      </div>
    );
  } else {
    const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const pageItems = processed.slice(
      (current - 1) * PAGE_SIZE,
      current * PAGE_SIZE
    );
    listArea = (
      <div>
        <div className="flex flex-col gap-4">
          {pageItems.map((b) => (
            <BookingHistoryCard key={b.id} booking={b} />
          ))}
        </div>
        <PageFooter
          page={current}
          totalPages={totalPages}
          total={processed.length}
          onChange={setPage}
        />
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Booking History
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          All your past, current, and upcoming rentals in one place
        </p>
      </header>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tint }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]"
          >
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl",
                tint
              )}
            >
              <Icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs text-[var(--color-text-muted)]">
                {label}
              </p>
              <p className="text-xl font-extrabold text-[var(--color-text)]">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)] lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t.key
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-inset)]"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  tab === t.key
                    ? "bg-white/20"
                    : "bg-[var(--color-surface-inset)] text-[var(--color-text-muted)]"
                )}
              >
                {count(t.key)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center gap-2 lg:ml-auto lg:max-w-md">
          <Search size={16} className="text-[var(--color-text-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by vehicle or booking ID..."
            className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* List */}
      <div className="mt-8">{listArea}</div>
    </div>
  );
}

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-extrabold text-[var(--color-text)]">
        {title}
      </h2>
      <span className="rounded-full bg-[var(--color-surface-inset)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
        {count} trip{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}

function PageFooter({
  page,
  totalPages,
  total,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-[var(--color-text-muted)]">
        Showing <span className="font-semibold text-[var(--color-text)]">{from}</span>
        –<span className="font-semibold text-[var(--color-text)]">{to}</span> of{" "}
        <span className="font-semibold text-[var(--color-text)]">{total}</span>{" "}
        bookings
      </p>
      <Pagination page={page} totalPages={totalPages} onChange={onChange} />
    </div>
  );
}
