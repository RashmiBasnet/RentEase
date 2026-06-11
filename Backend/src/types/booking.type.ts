import z from "zod";

const ExtraChargeSchema = z.object({
    label: z.string().trim().min(1, "Label is required"),
    amount: z.number().nonnegative("Amount must be non-negative"),
});

export const BookingObjectSchema = z.object({
    userId: z.string().trim().min(1, "User ID is required"),
    vehicleId: z.string().trim().min(1, "Vehicle ID is required"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    totalDays: z.number().int().positive("Total days must be positive"),
    pickupAddress: z.string().trim().min(1, "Pickup address is required"),
    basePrice: z.number().positive("Base price must be positive"),
    depositAmount: z.number().nonnegative().optional(),
    insuranceCost: z.number().nonnegative().optional(),
    extraCharges: z.array(ExtraChargeSchema).default([]),
    totalAmount: z.number().positive("Total amount must be positive"),
    status: z.enum(["pending", "confirmed", "active", "completed", "cancelled"]).default("pending"),
    paymentStatus: z.enum(["pending", "paid", "refunded"]).default("pending"),
    paymentMethod: z.string().trim().optional(),
    notes: z.string().trim().optional(),
});

export const BookingSchema = BookingObjectSchema.refine(
    (data) => data.endDate > data.startDate,
    { message: "End date must be after start date", path: ["endDate"] }
);

export type BookingType = z.infer<typeof BookingSchema>;
