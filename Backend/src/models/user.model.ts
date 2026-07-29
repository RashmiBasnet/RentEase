import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";

const UserSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true, minLength: 2 },
        email: { type: String, required: true, unique: true },
        // Optional so Google-created accounts (which have no password) are valid.
        password: { type: String, minLength: 6 },
        // Optional + sparse: Google sign-in doesn't provide a phone number, so these
        // accounts have none until the user adds one. Sparse keeps the unique index
        // from clashing across the many documents without a phoneNumber.
        phoneNumber: { type: String, unique: true, sparse: true, minLength: 10, maxLength: 10 },
        // Google's stable subject id ("sub"). Sparse-unique so only linked accounts have one.
        googleId: { type: String, unique: true, sparse: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        profilePicture: { type: String },
        isVerified: { type: Boolean, default: false },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
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