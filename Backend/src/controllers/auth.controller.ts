import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";
import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import z from "zod";

let authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const parsedData = CreateUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error),
                });
            }
            const newUser = await authService.registerUser(parsedData.data);
            return res.status(201).json({
                success: true,
                data: newUser,
                message: "User registered successfully",
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error),
                });
            }
            const { token, user } = await authService.loginUser(parsedData.data);
            return res.status(200).json({
                success: true,
                data: { token, user },
                message: "Login successful",
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            await authService.sendResetPasswordEmail(email);
            return res.status(200).json({
                success: true,
                message: "If the email is registered, a password reset link has been sent.",
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const token = req.params.token as string;
            const { newPassword } = req.body;
            await authService.resetPassword(token, newPassword);
            return res.status(200).json({
                success: true,
                message: "Password has been reset successfully.",
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}