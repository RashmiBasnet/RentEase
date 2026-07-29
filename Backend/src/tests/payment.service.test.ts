const mockBookingRepo = {
    getBookingById: jest.fn(),
    getBookingByKhaltiPidx: jest.fn(),
    updateBooking: jest.fn(),
};

jest.mock("../repositories/booking.repository", () => ({
    BookingRepository: jest.fn(() => mockBookingRepo),
}));

// Provide Khalti config so the service treats it as configured.
jest.mock("../config", () => ({
    KHALTI_SECRET_KEY: "test-secret-key",
    KHALTI_BASE_URL: "https://khalti.test/api/v2",
    CLIENT_URL: "http://localhost:3000",
}));

import mongoose from "mongoose";
import { PaymentService } from "../services/payment.service";

const oid = () => new mongoose.Types.ObjectId().toString();

// Helper to stub the global fetch used by the service.
function mockFetchOnce(ok: boolean, status: number, body: unknown) {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok,
        status,
        json: async () => body,
    });
}

describe("PaymentService", () => {
    let service: PaymentService;

    beforeEach(() => {
        service = new PaymentService();
        global.fetch = jest.fn();
    });

    describe("initiateKhaltiPayment", () => {
        const userId = oid();
        const bookingId = oid();

        it("rejects an invalid booking id", async () => {
            await expect(
                service.initiateKhaltiPayment(userId, { bookingId: "bad" })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it("throws 404 when the booking is missing", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue(null);
            await expect(
                service.initiateKhaltiPayment(userId, { bookingId })
            ).rejects.toMatchObject({ statusCode: 404 });
        });

        it("forbids paying for a booking you do not own", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({ _id: bookingId, userId: oid() });
            await expect(
                service.initiateKhaltiPayment(userId, { bookingId })
            ).rejects.toMatchObject({ statusCode: 403 });
        });

        it("throws 409 when the booking is already paid", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({
                _id: bookingId,
                userId,
                paymentStatus: "paid",
            });
            await expect(
                service.initiateKhaltiPayment(userId, { bookingId })
            ).rejects.toMatchObject({ statusCode: 409 });
        });

        it("throws 409 when the booking is cancelled", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({
                _id: bookingId,
                userId,
                paymentStatus: "pending",
                status: "cancelled",
            });
            await expect(
                service.initiateKhaltiPayment(userId, { bookingId })
            ).rejects.toMatchObject({ statusCode: 409 });
        });

        it("rejects an amount below Khalti's minimum", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({
                _id: bookingId,
                userId,
                paymentStatus: "pending",
                status: "pending",
                totalAmount: 5, // 500 paisa < 1000 minimum
            });
            await expect(
                service.initiateKhaltiPayment(userId, { bookingId })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it("initiates payment and stores the pidx on success", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({
                _id: bookingId,
                userId,
                paymentStatus: "pending",
                status: "pending",
                totalAmount: 5000,
                vehicleId: { title: "Toyota" },
            });
            mockFetchOnce(true, 200, {
                pidx: "pidx_123",
                payment_url: "https://khalti.test/pay/pidx_123",
                expires_at: "2026-01-01T00:00:00Z",
            });

            const result = await service.initiateKhaltiPayment(userId, { bookingId });

            expect(result).toMatchObject({ pidx: "pidx_123", paymentUrl: "https://khalti.test/pay/pidx_123" });
            expect(mockBookingRepo.updateBooking).toHaveBeenCalledWith(
                String(bookingId),
                expect.objectContaining({ khaltiPidx: "pidx_123", paymentMethod: "khalti" })
            );
        });
    });

    describe("verifyKhaltiPayment", () => {
        const userId = oid();
        const bookingId = oid();

        it("throws 404 when no booking matches the pidx", async () => {
            mockBookingRepo.getBookingByKhaltiPidx.mockResolvedValue(null);
            await expect(
                service.verifyKhaltiPayment(userId, { pidx: "pidx_x" })
            ).rejects.toMatchObject({ statusCode: 404 });
        });

        it("forbids verifying a payment you do not own", async () => {
            mockBookingRepo.getBookingByKhaltiPidx.mockResolvedValue({ _id: bookingId, userId: oid() });
            await expect(
                service.verifyKhaltiPayment(userId, { pidx: "pidx_x" })
            ).rejects.toMatchObject({ statusCode: 403 });
        });

        it("short-circuits an already-paid booking without calling Khalti", async () => {
            mockBookingRepo.getBookingByKhaltiPidx.mockResolvedValue({
                _id: bookingId,
                userId,
                paymentStatus: "paid",
                khaltiTransactionId: "txn_1",
            });

            const result = await service.verifyKhaltiPayment(userId, { pidx: "pidx_x" });

            expect(result).toMatchObject({ status: "Completed", paid: true, transactionId: "txn_1" });
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it("marks the booking paid when Khalti reports Completed for the right amount", async () => {
            mockBookingRepo.getBookingByKhaltiPidx.mockResolvedValue({
                _id: bookingId,
                userId,
                paymentStatus: "pending",
                totalAmount: 5000,
            });
            mockFetchOnce(true, 200, {
                pidx: "pidx_x",
                total_amount: 500000, // 5000 * 100
                status: "Completed",
                transaction_id: "txn_success",
            });

            const result = await service.verifyKhaltiPayment(userId, { pidx: "pidx_x" });

            expect(result).toMatchObject({ paid: true, status: "Completed" });
            expect(mockBookingRepo.updateBooking).toHaveBeenCalledWith(
                String(bookingId),
                expect.objectContaining({ paymentStatus: "paid", status: "confirmed" })
            );
        });

        it("throws 409 when a Completed payment's amount does not match the booking", async () => {
            mockBookingRepo.getBookingByKhaltiPidx.mockResolvedValue({
                _id: bookingId,
                userId,
                paymentStatus: "pending",
                totalAmount: 5000,
            });
            mockFetchOnce(true, 200, {
                pidx: "pidx_x",
                total_amount: 999, // wrong
                status: "Completed",
                transaction_id: "txn_x",
            });

            await expect(
                service.verifyKhaltiPayment(userId, { pidx: "pidx_x" })
            ).rejects.toMatchObject({ statusCode: 409 });
        });
    });
});
