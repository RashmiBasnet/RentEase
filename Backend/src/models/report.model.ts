import mongoose, { Document, Schema } from "mongoose";
import { ReportType } from "../types/report.type";

const ReportSchema: Schema = new Schema(
    {
        reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
        reason: {
            type: String,
            enum: ["fake_listing", "poor_condition", "scam", "misleading_info", "other"],
            required: true,
        },
        description: { type: String, required: true, minLength: 10 },
        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved", "dismissed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Prevent a user from reporting the same vehicle multiple times
ReportSchema.index({ reportedBy: 1, vehicleId: 1 }, { unique: true });

export interface IReport extends Omit<ReportType, "reportedBy" | "vehicleId">, Document {
    _id: mongoose.Types.ObjectId;
    reportedBy: mongoose.Types.ObjectId;
    vehicleId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ReportModel = mongoose.model<IReport>("Report", ReportSchema);