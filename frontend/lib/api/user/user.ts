import { API } from "../endpoints";
import axios from "../axios";

export type UpdateProfilePayload = {
    fullName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    profilePicture?: string;
};

export const getProfile = async () => {
    try {
        const response = await axios.get(
            API.USER.GET_PROFILE,
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Profile fetch failed"
        );
    }
}

export const updateUserProfile = async (updateData: UpdateProfilePayload) => {
    try {
        const response = await axios.patch(
            API.USER.UPDATE_PROFILE,
            updateData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Update profile failed"
        );
    }
}

export const updateProfilePicture = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("profilePicture", file); 

        const response = await axios.patch(
            API.USER.UPDATE_PROFILE_PICTURE,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data" 
                }
            }
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Profile picture update failed"
        );
    }
}

export const updateUserLocation = async ({ lat, lng }: { lat: number; lng: number }) => {
    try {
        const response = await axios.patch(
            API.USER.UPDATE_LOCATION,
            { lng, lat } 
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Location update failed"
        );
    }
}

export const requestPasswordReset = async (email: string) => {
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
