import mongoose, { Document, Schema } from "mongoose";
import { BookingType } from "../types/booking.type";

const BookingSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        totalDays: { type: Number, required: true, min: 1 },
        pickupAddress: { type: String, required: true },
        basePrice: { type: Number, required: true, min: 0 },
        depositAmount: { type: Number, min: 0 },
        insuranceCost: { type: Number, min: 0 },
        extraCharges: [
            {
                label: { type: String, required: true },
                amount: { type: Number, required: true, min: 0 },
            },
        ],
        totalAmount: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["pending", "confirmed", "active", "completed", "cancelled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded"],
            default: "pending",
        },
        paymentMethod: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

export interface IBooking extends Omit<BookingType, "userId" | "vehicleId">, Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    vehicleId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);