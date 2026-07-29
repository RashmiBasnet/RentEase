const mockReviewRepo = {
    createReview: jest.fn(),
    getAllReviews: jest.fn(),
    getReviewById: jest.fn(),
    getReviewByBookingId: jest.fn(),
    getAverageRatingForVehicle: jest.fn(),
    updateReview: jest.fn(),
    deleteReview: jest.fn(),
};

const mockBookingRepo = {
    getBookingById: jest.fn(),
};

jest.mock("../repositories/review.repository", () => ({
    ReviewRepository: jest.fn(() => mockReviewRepo),
}));
jest.mock("../repositories/booking.repository", () => ({
    BookingRepository: jest.fn(() => mockBookingRepo),
}));

import mongoose from "mongoose";
import { ReviewService } from "../services/review.service";

const oid = () => new mongoose.Types.ObjectId().toString();

describe("ReviewService", () => {
    let service: ReviewService;
    beforeEach(() => {
        service = new ReviewService();
    });

    describe("createReview", () => {
        const userId = oid();
        const vehicleId = oid();
        const bookingId = oid();
        const data = { vehicleId, bookingId, rating: 5, comment: "Great" } as any;

        const completedBooking = { _id: bookingId, userId, vehicleId, status: "completed" };

        it("rejects invalid ids", async () => {
            await expect(service.createReview("bad", data)).rejects.toMatchObject({ statusCode: 400 });
        });

        it("throws 404 when the booking is missing", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue(null);
            await expect(service.createReview(userId, data)).rejects.toMatchObject({ statusCode: 404 });
        });

        it("forbids reviewing a booking you do not own", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({ ...completedBooking, userId: oid() });
            await expect(service.createReview(userId, data)).rejects.toMatchObject({ statusCode: 403 });
        });

        it("rejects a vehicle that does not match the booking", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({ ...completedBooking, vehicleId: oid() });
            await expect(service.createReview(userId, data)).rejects.toMatchObject({ statusCode: 400 });
        });

        it("rejects a booking that is not completed", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue({ ...completedBooking, status: "active" });
            await expect(service.createReview(userId, data)).rejects.toMatchObject({ statusCode: 400 });
        });

        it("throws 409 when the booking is already reviewed", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue(completedBooking);
            mockReviewRepo.getReviewByBookingId.mockResolvedValue({ _id: "existing" });
            await expect(service.createReview(userId, data)).rejects.toMatchObject({ statusCode: 409 });
        });

        it("creates the review on the happy path", async () => {
            mockBookingRepo.getBookingById.mockResolvedValue(completedBooking);
            mockReviewRepo.getReviewByBookingId.mockResolvedValue(null);
            mockReviewRepo.createReview.mockImplementation(async (r: any) => ({ _id: "r1", ...r }));

            const result = await service.createReview(userId, data);

            expect(mockReviewRepo.createReview).toHaveBeenCalled();
            expect(result).toMatchObject({ _id: "r1", rating: 5 });
        });
    });

    describe("getReviewsForVehicle", () => {
        it("rejects an invalid vehicle id", async () => {
            await expect(service.getReviewsForVehicle("bad", 1, 10)).rejects.toMatchObject({ statusCode: 400 });
        });
        it("returns reviews with the average rating", async () => {
            mockReviewRepo.getAllReviews.mockResolvedValue({ reviews: [{ _id: "r1" }], total: 1 });
            mockReviewRepo.getAverageRatingForVehicle.mockResolvedValue(4.2);

            const result = await service.getReviewsForVehicle(oid(), 1, 10);
            expect(result).toMatchObject({ total: 1, averageRating: 4.2 });
        });
    });

    describe("updateReview / deleteReview", () => {
        const reviewId = oid();
        const ownerId = oid();

        it("forbids editing someone else's review", async () => {
            mockReviewRepo.getReviewById.mockResolvedValue({ _id: reviewId, userId: ownerId });
            await expect(
                service.updateReview(reviewId, oid(), "user", { rating: 3 })
            ).rejects.toMatchObject({ statusCode: 403 });
        });

        it("lets an admin edit any review", async () => {
            mockReviewRepo.getReviewById.mockResolvedValue({ _id: reviewId, userId: ownerId });
            mockReviewRepo.updateReview.mockResolvedValue({ _id: reviewId, rating: 3 });
            await expect(service.updateReview(reviewId, oid(), "admin", { rating: 3 })).resolves.toMatchObject({
                rating: 3,
            });
        });

        it("lets an owner delete their own review", async () => {
            mockReviewRepo.getReviewById.mockResolvedValue({ _id: reviewId, userId: ownerId });
            mockReviewRepo.deleteReview.mockResolvedValue({ _id: reviewId });
            await expect(service.deleteReview(reviewId, ownerId, "user")).resolves.toMatchObject({ _id: reviewId });
        });

        it("throws 404 when the review to delete is missing", async () => {
            mockReviewRepo.getReviewById.mockResolvedValue(null);
            await expect(service.deleteReview(reviewId, ownerId, "user")).rejects.toMatchObject({ statusCode: 404 });
        });
    });
});
