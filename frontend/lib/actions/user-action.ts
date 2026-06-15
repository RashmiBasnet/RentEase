"use server";

import {
    getProfile,
    updateProfilePicture,
    updateUserLocation,
    updateUserProfile,
    type UpdateProfilePayload,
} from "../api/user/user";
import { setUserData } from "../cookie";

export const handleGetProfile = async () => {
    try {
        const result = await getProfile();
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message || "Profile fetched",
            };
        }
        return {
            success: false,
            message: result.message || "Profile fetch failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Profile fetch failed",
        };
    }
}

export const handleUpdateProfile = async (formData: UpdateProfilePayload) => {
    try {
        const result = await updateUserProfile(formData);
        if (result.success) {
            // Keep the cached user cookie in sync
            await setUserData(result.data);
            return {
                success: true,
                data: result.data,
                message: result.message || "Profile updated",
            };
        }
        return {
            success: false,
            message: result.message || "Update profile failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Update profile failed",
        };
    }
}

export const handleUpdateProfilePicture = async (file: File) => {
    try {
        const result = await updateProfilePicture(file);
        if (result.success) {
            await setUserData(result.data);
            return {
                success: true,
                data: result.data,
                message: result.message || "Profile picture updated",
            };
        }
        return {
            success: false,
            message: result.message || "Profile picture update failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Profile picture update failed",
        };
    }
}

export const handleUpdateLocation = async (coords: { lat: number; lng: number }) => {
    try {
        const result = await updateUserLocation(coords);
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message || "Location updated",
            };
        }
        return {
            success: false,
            message: result.message || "Location update failed",
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Location update failed",
        };
    }
}
