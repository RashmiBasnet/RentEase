import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/review.dto";

const reviewService = new ReviewService();

type AuthenticatedRequest = Request & {
    user?: {
        _id?: string;
        id?: string;
        role?: string;
    };
};

type ControllerError = Error & { statusCode?: number };

const getFirstZodMessage = (error: { issues: { message: string }[] }) =>
    error.issues[0]?.message || "Invalid request data";

export class ReviewController {
    async createReview(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const parsedData = CreateReviewDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }

            const review = await reviewService.createReview(String(userId), parsedData.data);
            return res.status(201).json({
                success: true,
                data: review,
                message: "Review submitted successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async getReviewsForVehicle(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;

            const result = await reviewService.getReviewsForVehicle(
                String(req.params.vehicleId),
                page,
                size
            );

            return res.status(200).json({
                success: true,
                data: result,
                message: "Reviews fetched successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async getAllReviews(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;
            const vehicleId = req.query.vehicleId as string | undefined;
            const userId = req.query.userId as string | undefined;

            const result = await reviewService.getAllReviews({ page, size, vehicleId, userId });
            return res.status(200).json({
                success: true,
                data: result,
                message: "Reviews fetched successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async getReviewById(req: Request, res: Response) {
        try {
            const review = await reviewService.getReviewById(String(req.params.id));
            return res.status(200).json({
                success: true,
                data: review,
                message: "Review fetched successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async updateReview(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            const userRole = authReq.user?.role;
            if (!userId || !userRole) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const parsedData = UpdateReviewDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }

            const review = await reviewService.updateReview(
                String(req.params.id),
                String(userId),
                userRole,
                parsedData.data
            );

            return res.status(200).json({
                success: true,
                data: review,
                message: "Review updated successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async deleteReview(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            const userRole = authReq.user?.role;
            if (!userId || !userRole) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const review = await reviewService.deleteReview(
                String(req.params.id),
                String(userId),
                userRole
            );

            return res.status(200).json({
                success: true,
                data: review,
                message: "Review deleted successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }
}
