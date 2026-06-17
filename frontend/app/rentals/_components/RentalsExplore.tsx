"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { VehicleCard, type Vehicle } from "../../_components/VehicleCard";
import { Pagination } from "./Pagination";
import { RentalFilters } from "./RentalFilters";
import {
  defaultFilters,
  type RentalFilterState,
  type VehicleTypeFilter,
} from "./filterTypes";

export type ExploreVehicle = Vehicle & {
  category: VehicleTypeFilter | "other";
};

type RentalsExploreProps = {
  vehicles: ExploreVehicle[];
  pageSize?: number;
};

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function RentalsExplore({
  vehicles,
  pageSize = 6,
}: RentalsExploreProps) {
  const [filters, setFilters] = useState<RentalFilterState>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const result = vehicles.filter((v) => {
      if (filters.types.length && !filters.types.includes(v.category as VehicleTypeFilter)) {
        return false;
      }
      if (v.pricePerDay > filters.maxPrice) return false;
      if (filters.fuel && v.fuelType?.toLowerCase() !== filters.fuel) {
        return false;
      }
      if (filters.minRating && (v.rating ?? 0) < filters.minRating) {
        return false;
      }
      return true;
    });

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
      case "price-desc":
        return [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
      case "rating":
        return [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return result;
    }
  }, [vehicles, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const updateFilters = (next: RentalFilterState) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <RentalFilters
        value={filters}
        onChange={updateFilters}
        onClear={() => updateFilters(defaultFilters)}
      />

      <div>
        {/* Result count + sort — clear, familiar controls (Hick's / Jakob's) */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-bold text-[var(--color-text)]">
              {filtered.length}
            </span>{" "}
            vehicle{filtered.length === 1 ? "" : "s"} available
          </p>

          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <span className="hidden sm:inline">Sort by</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setPage(1);
              }}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-medium text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-focus)]"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {pageItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-inset)] p-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)]">
              <SlidersHorizontal size={22} />
            </span>
            <p className="mt-4 font-semibold text-[var(--color-text)]">
              No vehicles match your filters
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Try widening your price range or clearing some filters.
            </p>
            <button
              type="button"
              onClick={() => updateFilters(defaultFilters)}
              className="mt-4 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Clear all filters
            </button>
          </div>
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={setPage}
          className="mt-12"
        />
      </div>
    </div>
  );
}
