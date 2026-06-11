import { Request, Response } from "express";
import { ReportService } from "../services/report.service";
import { CreateReportDto, UpdateReportStatusDto } from "../dtos/report.dto";
import { ReportType } from "../types/report.type";

const reportService = new ReportService();

type AuthenticatedRequest = Request & {
    user?: {
        _id?: string;
        id?: string;
        role?: string;
    };
};

const getFirstZodMessage = (error: { issues: { message: string }[] }) =>
    error.issues[0]?.message || "Invalid request data";

export class ReportController {
    async createReport(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const parsedData = CreateReportDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }

            const report = await reportService.createReport(String(userId), parsedData.data);
            return res.status(201).json({
                success: true,
                data: report,
                message: "Report submitted successfully",
            });
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message?: string };
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async getAllReports(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;
            const status = req.query.status as ReportType["status"] | undefined;
            const userId = req.query.userId as string | undefined;
            const vehicleId = req.query.vehicleId as string | undefined;

            const result = await reportService.getAllReports({ page, size, status, userId, vehicleId });
            return res.status(200).json({
                success: true,
                data: result,
                message: "Reports fetched successfully",
            });
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message?: string };
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async getReportById(req: Request, res: Response) {
        try {
            const report = await reportService.getReportById(String(req.params.id));
            return res.status(200).json({
                success: true,
                data: report,
                message: "Report fetched successfully",
            });
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message?: string };
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async getMyReports(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const result = await reportService.getMyReports(String(userId));
            return res.status(200).json({
                success: true,
                data: result,
                message: "Your reports fetched successfully",
            });
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message?: string };
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async updateReportStatus(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            const userRole = authReq.user?.role;
            if (!userId || !userRole) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const parsedData = UpdateReportStatusDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }

            const report = await reportService.updateReportStatus(
                String(req.params.id),
                parsedData.data,
                String(userId),
                userRole
            );

            return res.status(200).json({
                success: true,
                data: report,
                message: "Report status updated successfully",
            });
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message?: string };
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async deleteReport(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            const userRole = authReq.user?.role;
            if (!userId || !userRole) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const report = await reportService.deleteReport(
                String(req.params.id),
                String(userId),
                userRole
            );

            return res.status(200).json({
                success: true,
                data: report,
                message: "Report deleted successfully",
            });
        } catch (error: unknown) {
            const err = error as { statusCode?: number; message?: string };
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }
}
