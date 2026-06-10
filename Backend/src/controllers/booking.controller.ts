import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { CreateBookingDto, UpdateBookingStatusDto } from "../dtos/booking.dto";
import { BookingType } from "../types/booking.type";

const bookingService = new BookingService();

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

export class BookingController {
    async createBooking(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const parsedData = CreateBookingDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }

            const booking = await bookingService.createBooking(String(userId), parsedData.data);
            return res.status(201).json({
                success: true,
                data: booking,
                message: "Booking created successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async getAllBookings(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;
            const status = req.query.status as BookingType["status"] | undefined;
            const userId = req.query.userId as string | undefined;
            const vehicleId = req.query.vehicleId as string | undefined;

            const result = await bookingService.getAllBookings({
                page,
                size,
                status,
                userId,
                vehicleId,
            });

            return res.status(200).json({
                success: true,
                data: result,
                message: "Bookings fetched successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async getBookingById(req: Request, res: Response) {
        try {
            const booking = await bookingService.getBookingById(String(req.params.id));
            return res.status(200).json({
                success: true,
                data: booking,
                message: "Booking fetched successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async getMyBookings(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const bookings = await bookingService.getMyBookings(String(userId));
            return res.status(200).json({
                success: true,
                data: bookings,
                message: "Your bookings fetched successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async updateBookingStatus(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            const userRole = authReq.user?.role;
            if (!userId || !userRole) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const parsedData = UpdateBookingStatusDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }

            const booking = await bookingService.updateBookingStatus(
                String(req.params.id),
                parsedData.data,
                String(userId),
                userRole
            );

            return res.status(200).json({
                success: true,
                data: booking,
                message: "Booking status updated successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async cancelBooking(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const booking = await bookingService.cancelBooking(
                String(req.params.id),
                String(userId)
            );

            return res.status(200).json({
                success: true,
                data: booking,
                message: "Booking cancelled successfully",
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
