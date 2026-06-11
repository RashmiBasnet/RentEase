import { QueryFilter, Types } from "mongoose";
import { IReview, ReviewModel } from "../models/review.model";

type ReviewListFilters = {
    page: number;
    size: number;
    vehicleId?: string;
    userId?: string;
};

export interface IReviewRepository {
    createReview(data: Partial<IReview>): Promise<IReview>;
    getAllReviews({
        page,
        size,
        vehicleId,
        userId,
    }: ReviewListFilters): Promise<{ reviews: IReview[]; total: number }>;
    getReviewById(id: string): Promise<IReview | null>;
    getReviewByBookingId(bookingId: string): Promise<IReview | null>;
    getAverageRatingForVehicle(vehicleId: string): Promise<number>;
    updateReview(id: string, data: Partial<IReview>): Promise<IReview | null>;
    deleteReview(id: string): Promise<IReview | null>;
}

export class ReviewRepository implements IReviewRepository {
    async createReview(data: Partial<IReview>): Promise<IReview> {
        const review = await ReviewModel.create(data);
        return review;
    }

    async getAllReviews({
        page,
        size,
        vehicleId,
        userId,
    }: ReviewListFilters): Promise<{ reviews: IReview[]; total: number }> {
        const query: QueryFilter<IReview> = {};

        if (vehicleId) query.vehicleId = vehicleId;
        if (userId) query.userId = userId;

        const skip = (page - 1) * size;
        const [reviews, total] = await Promise.all([
            ReviewModel.find(query)
                .populate("userId", "fullName profilePicture")
                .populate("vehicleId", "title brand vehicleModel images")
                .populate("bookingId", "startDate endDate")
                .skip(skip)
                .limit(size)
                .sort({ createdAt: -1 }),
            ReviewModel.countDocuments(query),
        ]);

        return { reviews, total };
    }

    async getReviewById(id: string): Promise<IReview | null> {
        return ReviewModel.findById(id)
            .populate("userId", "fullName profilePicture")
            .populate("vehicleId", "title brand vehicleModel images")
            .populate("bookingId", "startDate endDate");
    }

    async getReviewByBookingId(bookingId: string): Promise<IReview | null> {
        return ReviewModel.findOne({ bookingId });
    }

    async getAverageRatingForVehicle(vehicleId: string): Promise<number> {
        const result = await ReviewModel.aggregate([
            { $match: { vehicleId: new Types.ObjectId(vehicleId) } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]);
        return result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
    }

    async updateReview(id: string, data: Partial<IReview>): Promise<IReview | null> {
        return ReviewModel.findByIdAndUpdate(id, data, { new: true })
            .populate("userId", "fullName profilePicture")
            .populate("vehicleId", "title brand vehicleModel images");
    }

    async deleteReview(id: string): Promise<IReview | null> {
        return ReviewModel.findByIdAndDelete(id);
    }
}
