import mongoose from "mongoose";
import { ReviewRepository } from "../repositories/review.repository";
import { BookingRepository } from "../repositories/booking.repository";
import { IReview } from "../models/review.model";
import { HttpError } from "../errors/http-error";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/review.dto";

const reviewRepository = new ReviewRepository();
const bookingRepository = new BookingRepository();

export class ReviewService {
    async createReview(userId: string, data: CreateReviewDto): Promise<IReview> {
        if (!mongoose.isValidObjectId(userId)) {
            throw new HttpError(400, "Invalid user id");
        }
        if (!mongoose.isValidObjectId(data.vehicleId)) {
            throw new HttpError(400, "Invalid vehicle id");
        }
        if (!mongoose.isValidObjectId(data.bookingId)) {
            throw new HttpError(400, "Invalid booking id");
        }

        const booking = await bookingRepository.getBookingById(data.bookingId);
        if (!booking) {
            throw new HttpError(404, "Booking not found");
        }

        const bookingUserId =
            (booking.userId as any)?._id?.toString() ?? booking.userId?.toString();
        if (bookingUserId !== userId) {
            throw new HttpError(403, "You can only review your own bookings");
        }

        const bookingVehicleId =
            (booking.vehicleId as any)?._id?.toString() ?? booking.vehicleId?.toString();
        if (bookingVehicleId !== data.vehicleId) {
            throw new HttpError(400, "Vehicle does not match this booking");
        }

        if (booking.status !== "completed") {
            throw new HttpError(400, "You can only review a completed booking");
        }

        const existing = await reviewRepository.getReviewByBookingId(data.bookingId);
        if (existing) {
            throw new HttpError(409, "You have already reviewed this booking");
        }

        const review = await reviewRepository.createReview({
            userId: new mongoose.Types.ObjectId(userId),
            vehicleId: new mongoose.Types.ObjectId(data.vehicleId),
            bookingId: new mongoose.Types.ObjectId(data.bookingId),
            rating: data.rating,
            comment: data.comment,
            images: data.images,
        });

        return review;
    }

    async getReviewsForVehicle(
        vehicleId: string,
        page: number,
        size: number
    ): Promise<{ reviews: IReview[]; total: number; averageRating: number; page: number; size: number }> {
        if (!mongoose.isValidObjectId(vehicleId)) {
            throw new HttpError(400, "Invalid vehicle id");
        }

        const normalizedPage = Math.max(1, page);
        const normalizedSize = Math.max(1, size);

        const [{ reviews, total }, averageRating] = await Promise.all([
            reviewRepository.getAllReviews({
                page: normalizedPage,
                size: normalizedSize,
                vehicleId,
            }),
            reviewRepository.getAverageRatingForVehicle(vehicleId),
        ]);

        return { reviews, total, averageRating, page: normalizedPage, size: normalizedSize };
    }

    async getAllReviews(filters: {
        page: number;
        size: number;
        vehicleId?: string;
        userId?: string;
    }): Promise<{ reviews: IReview[]; total: number; page: number; size: number }> {
        const page = Math.max(1, filters.page);
        const size = Math.max(1, filters.size);

        if (filters.vehicleId && !mongoose.isValidObjectId(filters.vehicleId)) {
            throw new HttpError(400, "Invalid vehicle id");
        }
        if (filters.userId && !mongoose.isValidObjectId(filters.userId)) {
            throw new HttpError(400, "Invalid user id");
        }

        const { reviews, total } = await reviewRepository.getAllReviews({
            ...filters,
            page,
            size,
        });

        return { reviews, total, page, size };
    }

    async getReviewById(id: string): Promise<IReview> {
        if (!mongoose.isValidObjectId(id)) {
            throw new HttpError(400, "Invalid review id");
        }
        const review = await reviewRepository.getReviewById(id);
        if (!review) {
            throw new HttpError(404, "Review not found");
        }
        return review;
    }

    async updateReview(
        id: string,
        userId: string,
        requesterRole: string,
        data: UpdateReviewDto
    ): Promise<IReview> {
        if (!mongoose.isValidObjectId(id)) {
            throw new HttpError(400, "Invalid review id");
        }

        const review = await reviewRepository.getReviewById(id);
        if (!review) {
            throw new HttpError(404, "Review not found");
        }

        if (requesterRole !== "admin") {
            const reviewUserId =
                (review.userId as any)?._id?.toString() ?? review.userId?.toString();
            if (reviewUserId !== userId) {
                throw new HttpError(403, "You can only edit your own reviews");
            }
        }

        const updated = await reviewRepository.updateReview(id, data);
        return updated!;
    }

    async deleteReview(id: string, userId: string, requesterRole: string): Promise<IReview> {
        if (!mongoose.isValidObjectId(id)) {
            throw new HttpError(400, "Invalid review id");
        }

        const review = await reviewRepository.getReviewById(id);
        if (!review) {
            throw new HttpError(404, "Review not found");
        }

        if (requesterRole !== "admin") {
            const reviewUserId =
                (review.userId as any)?._id?.toString() ?? review.userId?.toString();
            if (reviewUserId !== userId) {
                throw new HttpError(403, "You can only delete your own reviews");
            }
        }

        const deleted = await reviewRepository.deleteReview(id);
        return deleted!;
    }
}
