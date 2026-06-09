import z from "zod";

export const ReportSchema = z.object({
    reportedBy: z.string().trim().min(1, "Reporter ID is required"),
    vehicleId: z.string().trim().min(1, "Vehicle ID is required"),
    reason: z.enum([
        "fake_listing",
        "poor_condition",
        "scam",
        "misleading_info",
        "other",
    ]),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    status: z.enum(["pending", "reviewed", "resolved", "dismissed"]).default("pending"),
});

export type ReportType = z.infer<typeof ReportSchema>;