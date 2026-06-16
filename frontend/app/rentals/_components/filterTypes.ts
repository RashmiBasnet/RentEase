export type VehicleTypeFilter = "car" | "bike-scooter" | "suv";
export type FuelFilter = "petrol" | "diesel" | "electric";

export type RentalFilterState = {
  types: VehicleTypeFilter[];
  maxPrice: number;
  fuel: FuelFilter | null;
  minRating: number | null;
};

export const PRICE_MIN = 500;
export const PRICE_MAX = 15000;

export const defaultFilters: RentalFilterState = {
  types: [],
  maxPrice: PRICE_MAX,
  fuel: null,
  minRating: null,
};
