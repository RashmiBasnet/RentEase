import z from "zod";
import { ReviewSchema } from "../types/review.type";

// User provides these — server computes userId from token
export const CreateReviewDto = ReviewSchema.pick({
    vehicleId: true,
    bookingId: true,
    rating: true,
    comment: true,
    images: true,
});
export type CreateReviewDto = z.infer<typeof CreateReviewDto>;

export const UpdateReviewDto = ReviewSchema.pick({
    rating: true,
    comment: true,
    images: true,
}).partial();
export type UpdateReviewDto = z.infer<typeof UpdateReviewDto>;