import z from "zod";
import { ReportSchema } from "../types/report.type";

export const CreateReportDto = ReportSchema.pick({
    vehicleId: true,
    reason: true,
    description: true,
});
export type CreateReportDto = z.infer<typeof CreateReportDto>;

export const UpdateReportStatusDto = ReportSchema.pick({
    status: true,
});
export type UpdateReportStatusDto = z.infer<typeof UpdateReportStatusDto>;