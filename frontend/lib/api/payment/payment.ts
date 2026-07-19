import { API } from "../endpoints";
import axios from "../axios";

export type KhaltiPaymentStatus =
    | "Completed"
    | "Pending"
    | "Initiated"
    | "Refunded"
    | "Partially Refunded"
    | "Expired"
    | "User canceled";

export type InitiateKhaltiPayload = {
    bookingId: string;
};

export type VerifyKhaltiPayload = {
    pidx: string;
};

export const initiateKhaltiPayment = async (data: InitiateKhaltiPayload) => {
    try {
        const response = await axios.post(
            API.PAYMENT.KHALTI_INITIATE,
            data
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to initiate payment"
        );
    }
}

export const verifyKhaltiPayment = async (data: VerifyKhaltiPayload) => {
    try {
        const response = await axios.post(
            API.PAYMENT.KHALTI_VERIFY,
            data
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to verify payment"
        );
    }
}
