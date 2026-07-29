import { API } from "../endpoints";
import axios from "../axios";

export type RegisterPayload = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export const register = async (data: RegisterPayload) => {
    try {
        const response = await axios.post(
            API.AUTH.REGISTER,
            data
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Registration failed"
        );
    }
}

export const login = async (data: LoginPayload) => {
    try {
        const response = await axios.post(
            API.AUTH.LOGIN,
            data
        );
        return response.data; // { token, user }
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Login failed"
        );
    }
}

export const startGoogleLogin = async (state: string) => {
    try {
        const response = await axios.get(API.AUTH.GOOGLE_START(state));
        return response.data; // { data: { url } }
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Could not start Google sign-in"
        );
    }
}

export const completeGoogleLogin = async (code: string) => {
    try {
        const response = await axios.post(API.AUTH.GOOGLE_CALLBACK, { code });
        return response.data; // { data: { token, user } }
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Google sign-in failed"
        );
    }
}

export const forgotPassword = async (email: string) => {
    try {
        const response = await axios.post(
            API.AUTH.FORGOT_PASSWORD,
            { email }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Request password reset failed"
        );
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(
            API.AUTH.RESET_PASSWORD(token),
            { newPassword }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Reset password failed"
        );
    }
}
