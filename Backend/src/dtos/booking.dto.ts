import z from "zod";
import { BookingObjectSchema } from "../types/booking.type";

// User provides only these — server computes userId, totalDays, basePrice, totalAmount
export const CreateBookingDto = BookingObjectSchema.pick({
    vehicleId: true,
    startDate: true,
    endDate: true,
    pickupAddress: true,
    notes: true,
    paymentMethod: true,
}).refine(
    (data) => data.endDate > data.startDate,
    { message: "End date must be after start date", path: ["endDate"] }
);
export type CreateBookingDto = z.infer<typeof CreateBookingDto>;

// Admin updates booking status (confirm, activate, complete, cancel)
export const UpdateBookingStatusDto = BookingObjectSchema.pick({
    status: true,
});
export type UpdateBookingStatusDto = z.infer<typeof UpdateBookingStatusDto>;

// Admin updates payment status
export const UpdatePaymentStatusDto = BookingObjectSchema.pick({
    paymentStatus: true,
});
export type UpdatePaymentStatusDto = z.infer<typeof UpdatePaymentStatusDto>;
