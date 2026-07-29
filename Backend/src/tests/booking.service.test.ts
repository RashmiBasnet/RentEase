const mockBookingRepo = {
    createBooking: jest.fn(),
    getAllBookings: jest.fn(),
    getBookingById: jest.fn(),
    getBookingsByUserId: jest.fn(),
    updateBooking: jest.fn(),
    hasOverlappingBooking: jest.fn(),
};

const mockVehicleRepo = {
    getVehicleById: jest.fn(),
};

jest.mock("../repositories/booking.repository", () => ({
    BookingRepository: jest.fn(() => mockBookingRepo),
}));
jest.mock("../repositories/vehicle.repository", () => ({
    VehicleRepository: jest.fn(() => mockVehicleRepo),
}));

import mongoose from "mongoose";
import { BookingService } from "../services/booking.service";

const oid = () => new mongoose.Types.ObjectId().toString();
const DAY = 24 * 60 * 60 * 1000;

describe("BookingService", () => {
    let service: BookingService;
    beforeEach(() => {
        service = new BookingService();
    });

    describe("createBooking", () => {
        const userId = oid();
        const vehicleId = oid();
        const futureStart = new Date(Date.now() + 2 * DAY);
        const futureEnd = new Date(Date.now() + 5 * DAY);
        const baseData = {
            vehicleId,
            startDate: futureStart,
            endDate: futureEnd,
            pickupAddress: "Kathmandu",
            paymentMethod: "cash",
        } as any;

        const availableVehicle = { _id: vehicleId, isAvailable: true, pricePerDay: 1000, deposit: 500 };

        it("rejects an invalid user id", async () => {
            await expect(service.createBooking("not-an-id", baseData)).rejects.toMatchObject({ statusCode: 400 });
        });

        it("rejects an invalid vehicle id", async () => {
            await expect(
                service.createBooking(userId, { ...baseData, vehicleId: "bad" })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it("throws 404 when the vehicle does not exist", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue(null);
            await expect(service.createBooking(userId, baseData)).rejects.toMatchObject({ statusCode: 404 });
        });

        it("throws 409 when the vehicle is not available", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue({ ...availableVehicle, isAvailable: false });
            await expect(service.createBooking(userId, baseData)).rejects.toMatchObject({ statusCode: 409 });
        });

        it("rejects an end date not after the start date", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue(availableVehicle);
            await expect(
                service.createBooking(userId, { ...baseData, endDate: futureStart })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it("rejects a start date in the past", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue(availableVehicle);
            await expect(
                service.createBooking(userId, {
                    ...baseData,
                    startDate: new Date(Date.now() - 2 * DAY),
                    endDate: new Date(Date.now() + DAY),
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it("throws 409 when the dates overlap an existing booking", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue(availableVehicle);
            mockBookingRepo.hasOverlappingBooking.mockResolvedValue(true);
            await expect(service.createBooking(userId, baseData)).rejects.toMatchObject({ statusCode: 409 });
        });

        it("computes totalDays and totalAmount and creates the booking", async () => {
            mockVehicleRepo.getVehicleById.mockResolvedValue(availableVehicle);
            mockBookingRepo.hasOverlappingBooking.mockResolvedValue(false);
            mockBookingRepo.createBooking.mockImplementation(async (b: any) => ({ _id: "b1", ...b }));

            const result = await service.createBooking(userId, baseData);

            const created = mockBookingRepo.createBooking.mock.calls[0][0];
            expect(created.totalDays).toBe(3); // 5 days - 2 days
            expect(created.totalAmount).toBe(3000); // 3 * 1000
            expect(created.basePrice).toBe(1000);
            expect(created.status).toBe("pending");
            expect(result).toMatchObject({ _id: "b1" });
        });
    });

    describe("updateBookingStatus", () => {
        const bookingId = oid();
        const ownerId = oid();

        it("rejects an invalid booking id", async () => {
            await expect(
                service.updateBookingStatus("bad", { status: "confirmed" } as any, ownerId, "admin")
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it("throws 404 when the booking is missing", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue(null);
            await expect(
                service.updateBookingStatus(bookingId, { status: "confirmed" } as any, ownerId, "admin")
            ).rejects.toMatchObject({ statusCode: 404 });
        });

        it("rejects an illegal status transition", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({ _id: bookingId, status: "completed", userId: ownerId });
            await expect(
                service.updateBookingStatus(bookingId, { status: "active" } as any, ownerId, "admin")
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it("lets an admin confirm a pending booking", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({ _id: bookingId, status: "pending", userId: ownerId });
            mockBookingRepo.updateBooking.mockResolvedValue({ _id: bookingId, status: "confirmed" });

            const result = await service.updateBookingStatus(
                bookingId,
                { status: "confirmed" } as any,
                oid(),
                "admin"
            );

            expect(mockBookingRepo.updateBooking).toHaveBeenCalledWith(bookingId, { status: "confirmed" });
            expect(result.status).toBe("confirmed");
        });

        it("forbids a non-owner user from touching someone else's booking", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({ _id: bookingId, status: "pending", userId: ownerId });
            await expect(
                service.updateBookingStatus(bookingId, { status: "cancelled" } as any, oid(), "user")
            ).rejects.toMatchObject({ statusCode: 403 });
        });

        it("forbids an owner from any transition other than cancel", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({ _id: bookingId, status: "pending", userId: ownerId });
            await expect(
                service.updateBookingStatus(bookingId, { status: "confirmed" } as any, ownerId, "user")
            ).rejects.toMatchObject({ statusCode: 403 });
        });

        it("lets an owner cancel their own booking", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({ _id: bookingId, status: "pending", userId: ownerId });
            mockBookingRepo.updateBooking.mockResolvedValue({ _id: bookingId, status: "cancelled" });

            const result = await service.cancelBooking(bookingId, ownerId);
            expect(result.status).toBe("cancelled");
        });
    });

    describe("getBookingById / getMyBookings", () => {
        it("getBookingById rejects an invalid id", async () => {
            await expect(service.getBookingById("bad")).rejects.toMatchObject({ statusCode: 400 });
        });
        it("getMyBookings rejects an invalid user id", async () => {
            await expect(service.getMyBookings("bad")).rejects.toMatchObject({ statusCode: 400 });
        });
    });
});
