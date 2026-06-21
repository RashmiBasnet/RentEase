import { API } from "../endpoints";
import axios from "../axios";

export type ReportReason =
    | "fake_listing"
    | "poor_condition"
    | "scam"
    | "misleading_info"
    | "other";

export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

// Server computes reportedBy from the token
export type CreateReportPayload = {
    vehicleId: string;
    reason: ReportReason;
    description: string;
};

export const createReport = async (data: CreateReportPayload) => {
    try {
        const response = await axios.post(
            API.REPORT.CREATE,
            data
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to create report"
        );
    }
}

export const getAllReports = async () => {
    try {
        const response = await axios.get(
            API.REPORT.GET_ALL
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch reports"
        );
    }
}

export const getMyReports = async () => {
    try {
        const response = await axios.get(
            API.REPORT.GET_MY
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch your reports"
        );
    }
}

export const getReportById = async (id: string) => {
    try {
        const response = await axios.get(
            API.REPORT.GET_BY_ID(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch report"
        );
    }
}

export const updateReportStatus = async (id: string, status: ReportStatus) => {
    try {
        const response = await axios.patch(
            API.REPORT.UPDATE_STATUS(id),
            { status }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update report status"
        );
    }
}

export const deleteReport = async (id: string) => {
    try {
        const response = await axios.delete(
            API.REPORT.DELETE(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to delete report"
        );
    }
}
