"use server";

import {
    createReview,
    deleteReview,
    getAllReviews,
    getReviewById,
    getReviewsForVehicle,
    updateReview,
    type CreateReviewPayload,
    type UpdateReviewPayload,
} from "../api/review/review";

export const handleCreateReview = async (formData: CreateReviewPayload) => {
    try {
        const result = await createReview(formData);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Review submitted" };
        }
        return { success: false, message: result.message || "Failed to create review" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to create review" };
    }
}

export const handleGetReviewsForVehicle = async (vehicleId: string) => {
    try {
        const result = await getReviewsForVehicle(vehicleId);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Reviews fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch reviews" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch reviews" };
    }
}

export const handleGetAllReviews = async () => {
    try {
        const result = await getAllReviews();
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Reviews fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch reviews" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch reviews" };
    }
}

export const handleGetReviewById = async (id: string) => {
    try {
        const result = await getReviewById(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Review fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch review" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch review" };
    }
}

export const handleUpdateReview = async (id: string, formData: UpdateReviewPayload) => {
    try {
        const result = await updateReview(id, formData);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Review updated" };
        }
        return { success: false, message: result.message || "Failed to update review" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to update review" };
    }
}

export const handleDeleteReview = async (id: string) => {
    try {
        const result = await deleteReview(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Review deleted" };
        }
        return { success: false, message: result.message || "Failed to delete review" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to delete review" };
    }
}
