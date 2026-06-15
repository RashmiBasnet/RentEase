import z from "zod";
import { BookingObjectSchema } from "../types/booking.type";

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

export const UpdateBookingStatusDto = BookingObjectSchema.pick({
    status: true,
});
export type UpdateBookingStatusDto = z.infer<typeof UpdateBookingStatusDto>;

export const UpdatePaymentStatusDto = BookingObjectSchema.pick({
    paymentStatus: true,
});
export type UpdatePaymentStatusDto = z.infer<typeof UpdatePaymentStatusDto>;
