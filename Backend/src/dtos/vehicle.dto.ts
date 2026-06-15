import z from "zod";
import { VehicleSchema } from "../types/vehicle.type";

export const CreateVehicleDto = VehicleSchema.omit({
    isVerified: true,
    isAvailable: true,
});
export type CreateVehicleDto = z.infer<typeof CreateVehicleDto>;

export const UpdateVehicleDto = VehicleSchema.partial();
export type UpdateVehicleDto = z.infer<typeof UpdateVehicleDto>;

export const VehicleFilterDto = z.object({
    type: z.enum(["car", "bike", "scooter", "suv", "van"]).optional(),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]).optional(),
    transmission: z.enum(["manual", "automatic"]).optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    seats: z.coerce.number().int().min(1).optional(),
    isAvailable: z.coerce.boolean().optional(),
    pickupAddress: z.string().trim().optional(),
});
export type VehicleFilterDto = z.infer<typeof VehicleFilterDto>;