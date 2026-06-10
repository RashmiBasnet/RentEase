import z from "zod";

const GeoPointSchema = z.object({
    type: z.literal("Point").default("Point"),
    // GeoJSON format: [longitude, latitude]
    coordinates: z.tuple([z.number(), z.number()]),
});

export const VehicleSchema = z.object({
    title: z.string().trim().min(2, "Title must be at least 2 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    type: z.enum(["car", "bike", "scooter", "suv", "van"]),
    brand: z.string().trim().min(1, "Brand is required"),
    vehicleModel: z.string().trim().min(1, "Model is required"),
    year: z.number().int().min(1990).max(new Date().getFullYear()),
    registrationNumber: z.string().trim().min(1, "Registration number is required"),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
    transmission: z.enum(["manual", "automatic"]),
    seats: z.number().int().min(1).max(12),
    pricePerDay: z.number().positive("Price per day must be positive"),
    deposit: z.number().nonnegative().optional(),
    images: z.array(z.string()).min(1, "At least one image is required"),
    pickupAddress: z.string().trim().min(1, "Pickup address is required"),
    location: GeoPointSchema,
    features: z.array(z.string()).default([]),
    isVerified: z.boolean().default(false),
    isAvailable: z.boolean().default(true),
    conditionRating: z.number().int().min(1).max(5),
    conditionNotes: z.string().trim().optional(),
    insurance: z.object({
        included: z.boolean().default(false),
        details: z.string().optional(),
    }).optional(),
});

export type VehicleType = z.infer<typeof VehicleSchema>;
