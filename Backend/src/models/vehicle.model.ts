import mongoose, { Document, Schema } from "mongoose";
import { VehicleType } from "../types/vehicle.type";

const VehicleSchema: Schema = new Schema(
    {
        title: { type: String, required: true, minLength: 2 },
        description: { type: String, required: true, minLength: 10 },
        type: { type: String, enum: ["car", "bike", "scooter", "suv", "van"], required: true },
        brand: { type: String, required: true },
        vehicleModel: { type: String, required: true },
        year: { type: Number, required: true, min: 1990, max: new Date().getFullYear() },
        registrationNumber: { type: String, required: true, unique: true },
        fuelType: { type: String, enum: ["petrol", "diesel", "electric", "hybrid"], required: true },
        transmission: { type: String, enum: ["manual", "automatic"], required: true },
        seats: { type: Number, required: true, min: 1, max: 12 },
        pricePerDay: { type: Number, required: true, min: 0 },
        deposit: { type: Number, min: 0 },
        images: { type: [String], required: true },
        pickupAddress: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: (coords: number[]) =>
                        Array.isArray(coords) && coords.length === 2,
                    message: "Location coordinates must be [lng, lat]",
                },
            },
        },
        features: { type: [String], default: [] },
        isVerified: { type: Boolean, default: false },
        isAvailable: { type: Boolean, default: true },
        conditionRating: { type: Number, required: true, min: 1, max: 5 },
        conditionNotes: { type: String },
        insurance: {
            included: { type: Boolean, default: false },
            details: { type: String },
        },
    },
    { timestamps: true }
);

VehicleSchema.index({ location: "2dsphere" });

export interface IVehicle extends VehicleType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const VehicleModel = mongoose.model<IVehicle>("Vehicle", VehicleSchema);