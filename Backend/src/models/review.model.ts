import mongoose, { Document, Schema } from "mongoose";
import { ReviewType } from "../types/review.type";

const ReviewSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
        bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, minLength: 5 },
        images: { type: [String] },
    },
    { timestamps: true }
);

ReviewSchema.index({ userId: 1, bookingId: 1 }, { unique: true });

export interface IReview extends Omit<ReviewType, "userId" | "vehicleId" | "bookingId">, Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    vehicleId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);