"use server";

import {
    cancelBooking,
    createBooking,
    getAllBookings,
    getBookingById,
    getMyBookings,
    updateBookingStatus,
    type BookingFilterParams,
    type BookingStatus,
    type CreateBookingPayload,
} from "../api/booking/booking";

export const handleCreateBooking = async (formData: CreateBookingPayload) => {
    try {
        const result = await createBooking(formData);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Booking created" };
        }
        return { success: false, message: result.message || "Failed to create booking" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to create booking" };
    }
}

export const handleGetAllBookings = async (params?: BookingFilterParams) => {
    try {
        const result = await getAllBookings(params);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Bookings fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch bookings" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch bookings" };
    }
}

export const handleGetMyBookings = async () => {
    try {
        const result = await getMyBookings();
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Your bookings fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch your bookings" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch your bookings" };
    }
}

export const handleGetBookingById = async (id: string) => {
    try {
        const result = await getBookingById(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Booking fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch booking" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch booking" };
    }
}

export const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
        const result = await updateBookingStatus(id, status);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Booking status updated" };
        }
        return { success: false, message: result.message || "Failed to update booking status" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to update booking status" };
    }
}

export const handleCancelBooking = async (id: string) => {
    try {
        const result = await cancelBooking(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Booking cancelled" };
        }
        return { success: false, message: result.message || "Failed to cancel booking" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to cancel booking" };
    }
}
