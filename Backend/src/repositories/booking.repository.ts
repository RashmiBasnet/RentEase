import { QueryFilter } from "mongoose";
import { IBooking, BookingModel } from "../models/booking.model";
import { BookingType } from "../types/booking.type";

type BookingListFilters = {
    page: number;
    size: number;
    status?: BookingType["status"];
    userId?: string;
    vehicleId?: string;
};

export interface IBookingRepository {
    createBooking(data: Partial<IBooking>): Promise<IBooking>;
    getAllBookings({
        page,
        size,
        status,
        userId,
        vehicleId,
    }: BookingListFilters): Promise<{ bookings: IBooking[]; total: number }>;
    getBookingById(id: string): Promise<IBooking | null>;
    getBookingsByUserId(userId: string): Promise<IBooking[]>;
    updateBooking(id: string, data: Partial<IBooking>): Promise<IBooking | null>;
    hasOverlappingBooking(
        vehicleId: string,
        startDate: Date,
        endDate: Date,
        excludeBookingId?: string
    ): Promise<boolean>;
}

export class BookingRepository implements IBookingRepository {
    async createBooking(data: Partial<IBooking>): Promise<IBooking> {
        const booking = await BookingModel.create(data);
        return booking;
    }

    async getAllBookings({
        page,
        size,
        status,
        userId,
        vehicleId,
    }: BookingListFilters): Promise<{ bookings: IBooking[]; total: number }> {
        const query: QueryFilter<IBooking> = {};

        if (status) query.status = status;
        if (userId) query.userId = userId;
        if (vehicleId) query.vehicleId = vehicleId;

        const skip = (page - 1) * size;
        const [bookings, total] = await Promise.all([
            BookingModel.find(query)
                .populate("userId", "fullName email phoneNumber profilePicture")
                .populate("vehicleId", "title brand vehicleModel images pricePerDay type")
                .skip(skip)
                .limit(size)
                .sort({ createdAt: -1 }),
            BookingModel.countDocuments(query),
        ]);

        return { bookings, total };
    }

    async getBookingById(id: string): Promise<IBooking | null> {
        return BookingModel.findById(id)
            .populate("userId", "fullName email phoneNumber profilePicture")
            .populate("vehicleId", "title brand vehicleModel images pricePerDay type pickupAddress");
    }

    async getBookingsByUserId(userId: string): Promise<IBooking[]> {
        return BookingModel.find({ userId })
            .populate("vehicleId", "title brand vehicleModel images pricePerDay type")
            .sort({ createdAt: -1 });
    }

    async updateBooking(id: string, data: Partial<IBooking>): Promise<IBooking | null> {
        return BookingModel.findByIdAndUpdate(id, data, { new: true })
            .populate("userId", "fullName email phoneNumber profilePicture")
            .populate("vehicleId", "title brand vehicleModel images pricePerDay type");
    }

    async hasOverlappingBooking(
        vehicleId: string,
        startDate: Date,
        endDate: Date,
        excludeBookingId?: string
    ): Promise<boolean> {
        const query: QueryFilter<IBooking> = {
            vehicleId,
            status: { $in: ["pending", "confirmed", "active"] },
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
            ],
        };

        if (excludeBookingId) {
            query._id = { $ne: excludeBookingId };
        }

        const count = await BookingModel.countDocuments(query);
        return count > 0;
    }
}
