import { UpdateUserDto, UpdateUserLocationDto } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import z from "zod";

let userService = new UserService();

interface AuthenticatedRequest extends Request {
    user?: {
        _id?: unknown;
        id?: unknown;
    };
    file?: {
        filename: string;
    };
}

export class UserController {
    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?._id ?? req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const user = await userService.getUserById(String(userId));
            return res.status(200).json({
                success: true,
                data: user,
                message: "User profile fetched successfully",
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async updateProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?._id ?? req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const parsedData = UpdateUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error),
                });
            }
            const updatedUser = await userService.updateUser(String(userId), parsedData.data);
            return res.status(200).json({
                success: true,
                data: updatedUser,
                message: "User profile updated successfully",
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async updateLocation(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?._id ?? req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const parsedData = UpdateUserLocationDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error),
                });
            }
            const updatedUser = await userService.updateUserLocation(
                String(userId),
                parsedData.data.lng,
                parsedData.data.lat
            );
            return res.status(200).json({
                success: true,
                data: updatedUser,
                message: "Location updated successfully",
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async uploadProfilePicture(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?._id ?? req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const updatedUser = await userService.uploadProfilePicture(String(userId), req.file);
            return res.status(200).json({
                success: true,
                data: { profilePicture: updatedUser?.profilePicture },
                message: "Profile picture uploaded successfully",
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
