"use server";

import {
    initiateKhaltiPayment,
    verifyKhaltiPayment,
    type InitiateKhaltiPayload,
    type VerifyKhaltiPayload,
} from "../api/payment/payment";

export const handleInitiateKhaltiPayment = async (formData: InitiateKhaltiPayload) => {
    try {
        const result = await initiateKhaltiPayment(formData);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Payment initiated" };
        }
        return { success: false, message: result.message || "Failed to initiate payment" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to initiate payment" };
    }
}

export const handleVerifyKhaltiPayment = async (formData: VerifyKhaltiPayload) => {
    try {
        const result = await verifyKhaltiPayment(formData);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Payment verified" };
        }
        return { success: false, message: result.message || "Failed to verify payment" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to verify payment" };
    }
}
