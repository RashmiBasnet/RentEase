import z from "zod";

export const InitiateKhaltiPaymentDto = z.object({
    bookingId: z.string().trim().min(1, "Booking ID is required"),
});
export type InitiateKhaltiPaymentDto = z.infer<typeof InitiateKhaltiPaymentDto>;

export const VerifyKhaltiPaymentDto = z.object({
    pidx: z.string().trim().min(1, "Payment identifier is required"),
});
export type VerifyKhaltiPaymentDto = z.infer<typeof VerifyKhaltiPaymentDto>;
