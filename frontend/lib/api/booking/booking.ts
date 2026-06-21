import { API } from "../endpoints";
import axios from "../axios";

export type BookingStatus =
    | "pending"
    | "confirmed"
    | "active"
    | "completed"
    | "cancelled";

// Server computes userId, totalDays, basePrice and totalAmount
export type CreateBookingPayload = {
    vehicleId: string;
    startDate: string | Date;
    endDate: string | Date;
    pickupAddress: string;
    notes?: string;
    paymentMethod?: string;
};

// Reuse the admin list filters defined in endpoints.ts
export type BookingFilterParams = Parameters<typeof API.BOOKING.GET_ALL>[0];

export const createBooking = async (data: CreateBookingPayload) => {
    try {
        const response = await axios.post(
            API.BOOKING.CREATE,
            data
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to create booking"
        );
    }
}

export const getAllBookings = async (params?: BookingFilterParams) => {
    try {
        const response = await axios.get(
            API.BOOKING.GET_ALL(params)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch bookings"
        );
    }
}

export const getMyBookings = async () => {
    try {
        const response = await axios.get(
            API.BOOKING.GET_MY
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch your bookings"
        );
    }
}

export const getBookingById = async (id: string) => {
    try {
        const response = await axios.get(
            API.BOOKING.GET_BY_ID(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to fetch booking"
        );
    }
}

export const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
        const response = await axios.patch(
            API.BOOKING.UPDATE_STATUS(id),
            { status }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to update booking status"
        );
    }
}

export const cancelBooking = async (id: string) => {
    try {
        const response = await axios.patch(
            API.BOOKING.CANCEL(id)
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to cancel booking"
        );
    }
}
