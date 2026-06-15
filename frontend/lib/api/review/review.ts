import { API } from "../endpoints";
import axios from "../axios";

// Server computes userId from the token
export type CreateReviewPayload = {
    vehicleId: string;
    bookingId: string;
    rating: number; // 1-5
    comment: string;
    images?: string[];
};

export type UpdateReviewPayload = Partial<
    Pick<CreateReviewPayload, "rating" | "comment" | "images">
>;

export const createReview = async (data: CreateReviewPayload) => {
    try {
        const response = await axios.post(
            API.REVIEW.CREATE,
            data
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to create review"
        );
    }
}

export const getReviewsForVehicle = async (vehicleId: string) => {
    try {
        const response = await axios.get(
            API.REVIEW.GET_FOR_VEHICLE(vehicleId)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch reviews"
        );
    }
}

export const getAllReviews = async () => {
    try {
        const response = await axios.get(
            API.REVIEW.GET_ALL
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch reviews"
        );
    }
}

export const getReviewById = async (id: string) => {
    try {
        const response = await axios.get(
            API.REVIEW.GET_BY_ID(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch review"
        );
    }
}

export const updateReview = async (id: string, data: UpdateReviewPayload) => {
    try {
        const response = await axios.patch(
            API.REVIEW.UPDATE(id),
            data
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update review"
        );
    }
}

export const deleteReview = async (id: string) => {
    try {
        const response = await axios.delete(
            API.REVIEW.DELETE(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to delete review"
        );
    }
}
