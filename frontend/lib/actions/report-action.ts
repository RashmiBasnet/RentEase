"use server";

import {
    createReport,
    deleteReport,
    getAllReports,
    getMyReports,
    getReportById,
    updateReportStatus,
    type CreateReportPayload,
    type ReportStatus,
} from "../api/report/report";

export const handleCreateReport = async (formData: CreateReportPayload) => {
    try {
        const result = await createReport(formData);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Report submitted" };
        }
        return { success: false, message: result.message || "Failed to create report" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to create report" };
    }
}

export const handleGetAllReports = async () => {
    try {
        const result = await getAllReports();
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Reports fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch reports" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch reports" };
    }
}

export const handleGetMyReports = async () => {
    try {
        const result = await getMyReports();
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Your reports fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch your reports" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch your reports" };
    }
}

export const handleGetReportById = async (id: string) => {
    try {
        const result = await getReportById(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Report fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch report" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch report" };
    }
}

export const handleUpdateReportStatus = async (id: string, status: ReportStatus) => {
    try {
        const result = await updateReportStatus(id, status);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Report status updated" };
        }
        return { success: false, message: result.message || "Failed to update report status" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to update report status" };
    }
}

export const handleDeleteReport = async (id: string) => {
    try {
        const result = await deleteReport(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Report deleted" };
        }
        return { success: false, message: result.message || "Failed to delete report" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to delete report" };
    }
}
