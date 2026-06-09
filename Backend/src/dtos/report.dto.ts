import z from "zod";
import { ReportSchema } from "../types/report.type";

// User provides these — server computes reportedBy from token
export const CreateReportDto = ReportSchema.pick({
    vehicleId: true,
    reason: true,
    description: true,
});
export type CreateReportDto = z.infer<typeof CreateReportDto>;

// Admin updates the status of a report
export const UpdateReportStatusDto = ReportSchema.pick({
    status: true,
});
export type UpdateReportStatusDto = z.infer<typeof UpdateReportStatusDto>;