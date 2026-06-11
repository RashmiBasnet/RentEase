import { QueryFilter } from "mongoose";
import { IReport, ReportModel } from "../models/report.model";
import { ReportType } from "../types/report.type";

type ReportListFilters = {
    page: number;
    size: number;
    status?: ReportType["status"];
    userId?: string;
    vehicleId?: string;
};

export interface IReportRepository {
    createReport(data: Partial<IReport>): Promise<IReport>;
    getAllReports({
        page,
        size,
        status,
        userId,
        vehicleId,
    }: ReportListFilters): Promise<{ reports: IReport[]; total: number }>;
    getReportById(id: string): Promise<IReport | null>;
    updateReport(id: string, data: Partial<IReport>): Promise<IReport | null>;
    deleteReport(id: string): Promise<IReport | null>;
}

export class ReportRepository implements IReportRepository {
    async createReport(data: Partial<IReport>): Promise<IReport> {
        const report = await ReportModel.create(data);
        return report;
    }

    async getAllReports({
        page,
        size,
        status,
        userId,
        vehicleId,
    }: ReportListFilters): Promise<{ reports: IReport[]; total: number }> {
        const query: QueryFilter<IReport> = {};

        if (status) query.status = status;
        if (userId) query.reportedBy = userId;
        if (vehicleId) query.vehicleId = vehicleId;

        const skip = (page - 1) * size;
        const [reports, total] = await Promise.all([
            ReportModel.find(query)
                .populate("reportedBy", "fullName email profilePicture")
                .populate("vehicleId", "title brand vehicleModel images")
                .skip(skip)
                .limit(size)
                .sort({ createdAt: -1 }),
            ReportModel.countDocuments(query),
        ]);

        return { reports, total };
    }

    async getReportById(id: string): Promise<IReport | null> {
        return ReportModel.findById(id)
            .populate("reportedBy", "fullName email profilePicture")
            .populate("vehicleId", "title brand vehicleModel images");
    }

    async updateReport(id: string, data: Partial<IReport>): Promise<IReport | null> {
        return ReportModel.findByIdAndUpdate(id, data, { new: true })
            .populate("reportedBy", "fullName email profilePicture")
            .populate("vehicleId", "title brand vehicleModel images");
    }

    async deleteReport(id: string): Promise<IReport | null> {
        return ReportModel.findByIdAndDelete(id);
    }
}
