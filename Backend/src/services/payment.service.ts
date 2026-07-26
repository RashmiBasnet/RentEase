import mongoose from "mongoose";
import { BookingRepository } from "../repositories/booking.repository";
import { IBooking } from "../models/booking.model";
import { HttpError } from "../errors/http-error";
import { CLIENT_URL, KHALTI_BASE_URL, KHALTI_SECRET_KEY } from "../config";
import {
    InitiateKhaltiPaymentDto,
    VerifyKhaltiPaymentDto,
} from "../dtos/payment.dto";
import {
    InitiatePaymentResult,
    KhaltiInitiateResponseSchema,
    KhaltiLookupResponseSchema,
    VerifyPaymentResult,
} from "../types/payment.type";

const bookingRepository = new BookingRepository();

/** Khalti rejects anything under Rs. 10. */
const MIN_AMOUNT_PAISA = 1000;

const toPaisa = (rupees: number) => Math.round(rupees * 100);

/** Mongoose populates userId/vehicleId, so the field may be a doc or a raw id. */
const idOf = (value: unknown): string => {
    if (!value) return "";
    if (typeof value === "object" && value !== null && "_id" in value) {
        return String((value as { _id: unknown })._id);
    }
    return String(value);
};

async function khaltiRequest<T>(path: string, body: unknown): Promise<unknown> {
    if (!KHALTI_SECRET_KEY) {
        throw new HttpError(500, "Khalti is not configured on the server");
    }

    let response: globalThis.Response;
    try {
        response = await fetch(`${KHALTI_BASE_URL}${path}`, {
            method: "POST",
            headers: {
                Authorization: `Key ${KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    } catch {
        throw new HttpError(502, "Could not reach Khalti. Please try again.");
    }

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        // Khalti reports field errors as arrays, e.g. { amount: ["..."] }
        const detail =
            (payload as { detail?: string } | null)?.detail ??
            Object.values((payload as Record<string, unknown>) ?? {})
                .flat()
                .filter((v) => typeof v === "string")
                .join(" ");
        throw new HttpError(
            response.status === 400 ? 400 : 502,
            detail || "Khalti rejected the payment request"
        );
    }

    return payload;
}

export class PaymentService {
    /**
     * Creates a Khalti payment session for a booking the caller owns.
     * The returned URL is where the browser must be sent to pay.
     */
    async initiateKhaltiPayment(
        userId: string,
        data: InitiateKhaltiPaymentDto
    ): Promise<InitiatePaymentResult> {
        if (!mongoose.isValidObjectId(data.bookingId)) {
            throw new HttpError(400, "Invalid booking id");
        }

        const booking = await bookingRepository.getBookingById(data.bookingId);
        if (!booking) {
            throw new HttpError(404, "Booking not found");
        }
        if (idOf(booking.userId) !== userId) {
            throw new HttpError(403, "You are not authorized to pay for this booking");
        }
        if (booking.paymentStatus === "paid") {
            throw new HttpError(409, "This booking has already been paid");
        }
        if (booking.status === "cancelled") {
            throw new HttpError(409, "This booking has been cancelled");
        }

        const amount = toPaisa(booking.totalAmount);
        if (amount < MIN_AMOUNT_PAISA) {
            throw new HttpError(400, "Amount is below Khalti's minimum of Rs. 10");
        }

        const customer = booking.userId as unknown as {
            fullName?: string;
            email?: string;
            phoneNumber?: string;
        };
        const vehicle = booking.vehicleId as unknown as { title?: string };

        const payload = await khaltiRequest("/epayment/initiate/", {
            return_url: `${CLIENT_URL}/payment/callback`,
            website_url: CLIENT_URL,
            amount,
            purchase_order_id: String(booking._id),
            purchase_order_name: vehicle?.title || "Vehicle rental",
            customer_info: {
                name: customer?.fullName,
                email: customer?.email,
                phone: customer?.phoneNumber,
            },
        });

        const parsed = KhaltiInitiateResponseSchema.safeParse(payload);
        if (!parsed.success) {
            throw new HttpError(502, "Unexpected response from Khalti");
        }

        await bookingRepository.updateBooking(String(booking._id), {
            khaltiPidx: parsed.data.pidx,
            paymentMethod: "khalti",
        } as Partial<IBooking>);

        return {
            pidx: parsed.data.pidx,
            paymentUrl: parsed.data.payment_url,
            expiresAt: parsed.data.expires_at,
        };
    }

    /**
     * Confirms a payment by asking Khalti directly. The browser's redirect
     * query params are never trusted — only this lookup decides the outcome.
     */
    async verifyKhaltiPayment(
        userId: string,
        data: VerifyKhaltiPaymentDto
    ): Promise<VerifyPaymentResult> {
        const booking = await bookingRepository.getBookingByKhaltiPidx(data.pidx);
        if (!booking) {
            throw new HttpError(404, "No booking matches this payment");
        }
        if (idOf(booking.userId) !== userId) {
            throw new HttpError(403, "You are not authorized to view this payment");
        }

        // Already settled — replaying the callback must not double-process.
        if (booking.paymentStatus === "paid") {
            return {
                status: "Completed",
                paid: true,
                bookingId: String(booking._id),
                transactionId: booking.khaltiTransactionId,
            };
        }

        const payload = await khaltiRequest("/epayment/lookup/", { pidx: data.pidx });
        const parsed = KhaltiLookupResponseSchema.safeParse(payload);
        if (!parsed.success) {
            throw new HttpError(502, "Unexpected response from Khalti");
        }

        const lookup = parsed.data;
        const paid = lookup.status === "Completed";

        // Guard against a Completed payment for the wrong amount.
        if (paid && lookup.total_amount !== toPaisa(booking.totalAmount)) {
            throw new HttpError(
                409,
                "Paid amount does not match the booking total. Please contact support."
            );
        }

        if (paid) {
            await bookingRepository.updateBooking(String(booking._id), {
                paymentStatus: "paid",
                status: "confirmed",
                khaltiTransactionId: lookup.transaction_id ?? undefined,
            } as Partial<IBooking>);
        }

        return {
            status: lookup.status,
            paid,
            bookingId: String(booking._id),
            transactionId: lookup.transaction_id,
        };
    }
}
