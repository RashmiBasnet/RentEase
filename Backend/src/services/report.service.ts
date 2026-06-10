import mongoose, { Types } from "mongoose";
import { ReportRepository } from "../repositories/report.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { IReport } from "../models/report.model";
import { HttpError } from "../errors/http-error";
import { CreateReportDto, UpdateReportStatusDto } from "../dtos/report.dto";
import { ReportType } from "../types/report.type";

const reportRepository = new ReportRepository();
const vehicleRepository = new VehicleRepository();

export class ReportService {
    async createReport(userId: string, data: CreateReportDto): Promise<IReport> {
        if (!mongoose.isValidObjectId(userId)) {
            throw new HttpError(400, "Invalid user id");
        }
        if (!mongoose.isValidObjectId(data.vehicleId)) {
            throw new HttpError(400, "Invalid vehicle id");
        }

        const vehicle = await vehicleRepository.getVehicleById(String(data.vehicleId));
        if (!vehicle) {
            throw new HttpError(404, "Vehicle not found");
        }

        const report = await reportRepository.createReport({
            reportedBy: new Types.ObjectId(userId),
            vehicleId: new Types.ObjectId(String(data.vehicleId)),
            reason: data.reason,
            description: data.description,
            status: "pending",
        });

        return report;
    }

    async getAllReports(filters: {
        page: number;
        size: number;
        status?: ReportType["status"];
        userId?: string;
        vehicleId?: string;
    }): Promise<{ reports: IReport[]; total: number; page: number; size: number }> {
        const page = Math.max(1, filters.page);
        const size = Math.max(1, filters.size);

        if (filters.userId && !mongoose.isValidObjectId(filters.userId)) {
            throw new HttpError(400, "Invalid user id");
        }
        if (filters.vehicleId && !mongoose.isValidObjectId(filters.vehicleId)) {
            throw new HttpError(400, "Invalid vehicle id");
        }

        const { reports, total } = await reportRepository.getAllReports({
            ...filters,
            page,
            size,
        });

        return { reports, total, page, size };
    }

    async getReportById(id: string): Promise<IReport> {
        if (!mongoose.isValidObjectId(id)) {
            throw new HttpError(400, "Invalid report id");
        }
        const report = await reportRepository.getReportById(id);
        if (!report) {
            throw new HttpError(404, "Report not found");
        }
        return report;
    }

    async updateReportStatus(
        id: string,
        data: UpdateReportStatusDto,
        requesterId: string,
        requesterRole: string
    ): Promise<IReport> {
        if (!mongoose.isValidObjectId(id)) {
            throw new HttpError(400, "Invalid report id");
        }

        const report = await reportRepository.getReportById(id);
        if (!report) {
            throw new HttpError(404, "Report not found");
        }

        if (requesterRole !== "admin") {
            throw new HttpError(403, "Only admins can update report status");
        }

        const updated = await reportRepository.updateReport(id, { status: data.status });
        return updated!;
    }

    async deleteReport(id: string, requesterId: string, requesterRole: string): Promise<IReport> {
        if (!mongoose.isValidObjectId(id)) {
            throw new HttpError(400, "Invalid report id");
        }

        const report = await reportRepository.getReportById(id);
        if (!report) {
            throw new HttpError(404, "Report not found");
        }

        if (requesterRole !== "admin") {
            const reportUserId =
                (report.reportedBy as any)?._id?.toString() ?? report.reportedBy?.toString();
            if (reportUserId !== requesterId) {
                throw new HttpError(403, "You can only delete your own reports");
            }
        }

        const deleted = await reportRepository.deleteReport(id);
        return deleted!;
    }

    async getMyReports(userId: string): Promise<{ reports: IReport[]; total: number }> {
        if (!mongoose.isValidObjectId(userId)) {
            throw new HttpError(400, "Invalid user id");
        }
        return reportRepository.getAllReports({ page: 1, size: 100, userId });
    }
}
