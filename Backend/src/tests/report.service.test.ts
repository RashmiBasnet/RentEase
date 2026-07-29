const mockReportRepo = {
    createReport: jest.fn(),
    getAllReports: jest.fn(),
    getReportById: jest.fn(),
    hasReported: jest.fn(),
    updateReport: jest.fn(),
    deleteReport: jest.fn(),
};

const mockVehicleRepo = {
    getVehicleById: jest.fn(),
};

jest.mock("../repositories/report.repository", () => ({
    ReportRepository: jest.fn(() => mockReportRepo),
}));
jest.mock("../repositories/vehicle.repository", () => ({
    VehicleRepository: jest.fn(() => mockVehicleRepo),
}));

import mongoose from "mongoose";
import { ReportService } from "../services/report.service";

const oid = () => new mongoose.Types.ObjectId().toString();

describe("ReportService", () => {
    let service: ReportService;
    beforeEach(() => {
        service = new ReportService();
    });

    describe("createReport", () => {
        const userId = oid();
        const vehicleId = oid();
        const data = { vehicleId, reason: "fraud", description: "Fake listing" } as any;

        it("rejects an invalid user id", async () => {
            await expect(service.createReport("bad", data)).rejects.toMatchObject({ statusCode: 400 });
        });

        it("throws 404 when the vehicle does not exist", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue(null);
            await expect(service.createReport(userId, data)).rejects.toMatchObject({ statusCode: 404 });
        });

        it("throws 409 when the user already reported this vehicle", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue({ _id: vehicleId });
            mockReportRepo.hasReported.mockResolvedValue(true);
            await expect(service.createReport(userId, data)).rejects.toMatchObject({ statusCode: 409 });
        });

        it("creates a pending report on the happy path", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue({ _id: vehicleId });
            mockReportRepo.hasReported.mockResolvedValue(false);
            mockReportRepo.createReport.mockImplementation(async (r: any) => ({ _id: "rep1", ...r }));

            const result = await service.createReport(userId, data);

            const created = mockReportRepo.createReport.mock.calls[0][0];
            expect(created.status).toBe("pending");
            expect(created.reason).toBe("fraud");
            expect(result).toMatchObject({ _id: "rep1" });
        });
    });

    describe("updateReportStatus", () => {
        const reportId = oid();

        it("forbids a non-admin from updating status", async () => {
            mockReportRepo.getReportById.mockResolvedValue({ _id: reportId, reportedBy: oid() });
            await expect(
                service.updateReportStatus(reportId, { status: "reviewed" } as any, oid(), "user")
            ).rejects.toMatchObject({ statusCode: 403 });
        });

        it("lets an admin update status", async () => {
            mockReportRepo.getReportById.mockResolvedValue({ _id: reportId, reportedBy: oid() });
            mockReportRepo.updateReport.mockResolvedValue({ _id: reportId, status: "reviewed" });

            const result = await service.updateReportStatus(
                reportId,
                { status: "reviewed" } as any,
                oid(),
                "admin"
            );
            expect(result.status).toBe("reviewed");
        });
    });

    describe("deleteReport", () => {
        const reportId = oid();
        const ownerId = oid();

        it("forbids deleting a report you do not own (non-admin)", async () => {
            mockReportRepo.getReportById.mockResolvedValue({ _id: reportId, reportedBy: ownerId });
            await expect(service.deleteReport(reportId, oid(), "user")).rejects.toMatchObject({ statusCode: 403 });
        });

        it("lets the owner delete their own report", async () => {
            mockReportRepo.getReportById.mockResolvedValue({ _id: reportId, reportedBy: ownerId });
            mockReportRepo.deleteReport.mockResolvedValue({ _id: reportId });
            await expect(service.deleteReport(reportId, ownerId, "user")).resolves.toMatchObject({ _id: reportId });
        });

        it("lets an admin delete any report", async () => {
            mockReportRepo.getReportById.mockResolvedValue({ _id: reportId, reportedBy: ownerId });
            mockReportRepo.deleteReport.mockResolvedValue({ _id: reportId });
            await expect(service.deleteReport(reportId, oid(), "admin")).resolves.toMatchObject({ _id: reportId });
        });
    });

    describe("getMyReports", () => {
        it("rejects an invalid user id", async () => {
            await expect(service.getMyReports("bad")).rejects.toMatchObject({ statusCode: 400 });
        });
        it("queries the repository scoped to the user", async () => {
            const userId = oid();
            mockReportRepo.getAllReports.mockResolvedValue({ reports: [], total: 0 });
            await service.getMyReports(userId);
            expect(mockReportRepo.getAllReports).toHaveBeenCalledWith({ page: 1, size: 100, userId });
        });
    });
});
