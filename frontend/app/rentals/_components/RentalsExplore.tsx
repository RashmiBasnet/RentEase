"use client";

import { useMemo, useState } from "react";
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

export function RentalsExplore({
  vehicles,
  pageSize = 6,
}: RentalsExploreProps) {
  const [filters, setFilters] = useState<RentalFilterState>(defaultFilters);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
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
  }, [vehicles, filters]);

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
        {pageItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-inset)] p-12 text-center">
            <p className="text-[var(--color-text-secondary)]">
              No vehicles match your filters. Try adjusting them.
            </p>
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
