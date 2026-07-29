import { CreateUserDto, LoginUserDto } from "../dtos/user.dto";
import { AuthService } from "../services/auth.service";
import * as googleService from "../services/google.service";
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

    // Returns the Google consent URL for the CSRF `state` the frontend generated.
    // The frontend stores that state in a cookie and verifies it on the callback.
    async googleStart(req: Request, res: Response) {
        try {
            const state = req.query.state as string;
            if (!state) {
                return res.status(400).json({
                    success: false,
                    message: "Missing state parameter",
                });
            }
            if (!googleService.isConfigured()) {
                return res.status(503).json({
                    success: false,
                    message: "Google sign-in is not configured on this server",
                });
            }
            const url = googleService.getAuthUrl(state);
            return res.status(200).json({ success: true, data: { url } });
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }

    // Exchanges the Google authorization code for a session. CSRF `state` is verified
    // on the frontend before this is called, so here we only need the code.
    async googleCallback(req: Request, res: Response) {
        try {
            const { code } = req.body;
            if (!code || typeof code !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Missing authorization code",
                });
            }
            const identity = await googleService.exchangeCode(code);
            const { token, user, created } = await authService.loginWithGoogle(identity);
            return res.status(created ? 201 : 200).json({
                success: true,
                data: { token, user },
                message: created ? "Account created with Google" : "Login successful",
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