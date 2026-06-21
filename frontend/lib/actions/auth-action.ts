"use server";

import {
    forgotPassword,
    login,
    register,
    resetPassword,
    type LoginPayload,
    type RegisterPayload,
} from "../api/auth/auth";
import { clearAuthCookies, setAuthToken, setUserData } from "../cookie";

export const handleRegister = async (formData: RegisterPayload) => {
    try {
        const result = await register(formData);
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message || "Registration successful",
            };
        }
        return {
            success: false,
            message: result.message || "Registration failed",
        };
    } catch (err: Error | any) {
        console.log("HANDLE REGISTER ERROR:", err.response?.data);
        return {
            success: false,
            message: err.message || "Registration failed",
        };
    }
}

export const handleLogin = async (formData: LoginPayload) => {
    try {
        const result = await login(formData);
        if (result.success) {
            // Backend returns data: { token, user }
            await setAuthToken(result.data.token);
            await setUserData(result.data.user);

            return {
                success: true,
                data: result.data,
                message: result.message || "Login successful",
            };
        }
        return {
            success: false,
            message: result.message || "Login failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Login failed",
        };
    }
}

export const handleForgotPassword = async (email: string) => {
    try {
        const result = await forgotPassword(email);
        if (result.success) {
            return {
                success: true,
                message: result.message || "Password reset link sent",
            };
        }
        return {
            success: false,
            message: result.message || "Request password reset failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Request password reset failed",
        };
    }
}

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const result = await resetPassword(token, newPassword);
        if (result.success) {
            return {
                success: true,
                message: result.message || "Password reset successful",
            };
        }
        return {
            success: false,
            message: result.message || "Reset password failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Reset password failed",
        };
    }
}

export const handleLogout = async () => {
    await clearAuthCookies();
    return { success: true, message: "Logged out" };
}
