import z from "zod";

export const ReviewSchema = z.object({
    userId: z.string().trim().min(1, "User ID is required"),
    vehicleId: z.string().trim().min(1, "Vehicle ID is required"),
    bookingId: z.string().trim().min(1, "Booking ID is required"),
    rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating can't be more than 5"),
    comment: z.string().trim().min(5, "Comment must be at least 5 characters"),
    images: z.array(z.string()).optional(),
});

export type ReviewType = z.infer<typeof ReviewSchema>;