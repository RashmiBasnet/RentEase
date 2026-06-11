import mongoose from "mongoose";
import { BookingRepository } from "../repositories/booking.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { IBooking } from "../models/booking.model";
import { HttpError } from "../errors/http-error";
import { CreateBookingDto, UpdateBookingStatusDto } from "../dtos/booking.dto";
import { BookingType } from "../types/booking.type";

const bookingRepository = new BookingRepository();
const vehicleRepository = new VehicleRepository();

export class BookingService {
    async createBooking(userId: string, data: CreateBookingDto): Promise<IBooking> {
        if (!mongoose.isValidObjectId(userId)) {
            throw new HttpError(400, "Invalid user id");
        }
        if (!mongoose.isValidObjectId(data.vehicleId)) {
            throw new HttpError(400, "Invalid vehicle id");
        }

        const vehicle = await vehicleRepository.getVehicleById(data.vehicleId);
        if (!vehicle) {
            throw new HttpError(404, "Vehicle not found");
        }
        if (!vehicle.isAvailable) {
            throw new HttpError(409, "Vehicle is not available for booking");
        }

        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new HttpError(400, "Invalid start or end date");
        }
        if (startDate >= endDate) {
            throw new HttpError(400, "End date must be after start date");
        }
        if (startDate < new Date()) {
            throw new HttpError(400, "Start date cannot be in the past");
        }

        const hasOverlap = await bookingRepository.hasOverlappingBooking(
            data.vehicleId,
            startDate,
            endDate
        );
        if (hasOverlap) {
            throw new HttpError(409, "Vehicle is already booked for the selected dates");
        }

        const days = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalPrice = days * vehicle.pricePerDay;

        const booking = await bookingRepository.createBooking({
            userId: new mongoose.Types.ObjectId(userId),
            vehicleId: new mongoose.Types.ObjectId(data.vehicleId),
            startDate,
            endDate,
            totalDays: days,
            pickupAddress: data.pickupAddress,
            basePrice: vehicle.pricePerDay,
            depositAmount: vehicle.deposit,
            totalAmount: totalPrice,
            paymentMethod: data.paymentMethod,
            notes: data.notes,
            status: "pending",
            paymentStatus: "pending",
        });

        return booking;
    }

    async getAllBookings(filters: {
        page: number;
        size: number;
        status?: BookingType["status"];
        userId?: string;
        vehicleId?: string;
    }): Promise<{ bookings: IBooking[]; total: number; page: number; size: number }> {
        const page = Math.max(1, filters.page);
        const size = Math.max(1, filters.size);

        if (filters.userId && !mongoose.isValidObjectId(filters.userId)) {
            throw new HttpError(400, "Invalid user id");
        }
        if (filters.vehicleId && !mongoose.isValidObjectId(filters.vehicleId)) {
            throw new HttpError(400, "Invalid vehicle id");
        }

        const { bookings, total } = await bookingRepository.getAllBookings({
            ...filters,
            page,
            size,
        });

        return { bookings, total, page, size };
    }

    async getBookingById(id: string): Promise<IBooking> {
        if (!mongoose.isValidObjectId(id)) {
            throw new HttpError(400, "Invalid booking id");
        }
        const booking = await bookingRepository.getBookingById(id);
        if (!booking) {
            throw new HttpError(404, "Booking not found");
        }
        return booking;
    }

    async getMyBookings(userId: string): Promise<IBooking[]> {
        if (!mongoose.isValidObjectId(userId)) {
            throw new HttpError(400, "Invalid user id");
        }
        return bookingRepository.getBookingsByUserId(userId);
    }

    async updateBookingStatus(
        id: string,
        data: UpdateBookingStatusDto,
        requesterId: string,
        requesterRole: string
    ): Promise<IBooking> {
        if (!mongoose.isValidObjectId(id)) {
            throw new HttpError(400, "Invalid booking id");
        }

        const booking = await bookingRepository.getBookingById(id);
        if (!booking) {
            throw new HttpError(404, "Booking not found");
        }

        const allowedTransitions: Record<string, string[]> = {
            pending: ["confirmed", "cancelled"],
            confirmed: ["active", "cancelled"],
            active: ["completed", "cancelled"],
            completed: [],
            cancelled: [],
        };

        const current = booking.status;
        if (!allowedTransitions[current].includes(data.status)) {
            throw new HttpError(
                400,
                `Cannot transition booking from "${current}" to "${data.status}"`
            );
        }

        // Users can only cancel their own pending bookings
        if (requesterRole !== "admin") {
            const bookingUserId =
                (booking.userId as any)?._id?.toString() ?? booking.userId?.toString();
            if (bookingUserId !== requesterId) {
                throw new HttpError(403, "You are not authorized to update this booking");
            }
            if (data.status !== "cancelled") {
                throw new HttpError(403, "Users can only cancel their own bookings");
            }
        }

        const updated = await bookingRepository.updateBooking(id, { status: data.status });
        return updated!;
    }

    async cancelBooking(id: string, userId: string): Promise<IBooking> {
        return this.updateBookingStatus(
            id,
            { status: "cancelled" },
            userId,
            "user"
        );
    }
}
