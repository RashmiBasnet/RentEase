import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";

const UserSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true, minLength: 2 },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minLength: 6 },
        phoneNumber: { type: String, required: true, unique: true, minLength: 10, maxLength: 10 },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        profilePicture: { type: String },
        isVerified: { type: Boolean, default: false },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            // GeoJSON format: [longitude, latitude]
            coordinates: {
                type: [Number],
                default: [0, 0],
                validate: {
                    validator: (coords: number[]) =>
                        Array.isArray(coords) && coords.length === 2,
                    message: "Location coordinates must be [lng, lat]",
                },
            },
        },
    },
    { timestamps: true }
);

UserSchema.index({ location: "2dsphere" });

export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>("User", UserSchema);