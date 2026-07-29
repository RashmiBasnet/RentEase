"use server";

import { cookies } from "next/headers";

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "auth_token", value: token });
}

export const getAuthToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    return token || null;
}

export const setUserData = async (userData: any) => {
    const cookieStore = await cookies();
    cookieStore.set({ name: "user_data", value: JSON.stringify(userData) });
}

export const getUserData = async () => {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value;
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
}

export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
};

// Short-lived CSRF token for the Google OAuth round-trip. Set before redirecting to
// Google, then compared against the `state` Google echoes back on the callback.
const OAUTH_STATE_MAX_AGE = 10 * 60;

export const setOAuthState = async (state: string) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "g_oauth_state",
        value: state,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: OAUTH_STATE_MAX_AGE,
    });
};

export const getOAuthState = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("g_oauth_state")?.value || null;
};

export const clearOAuthState = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("g_oauth_state");
};