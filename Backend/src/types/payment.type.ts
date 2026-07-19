import z from "zod";

/**
 * Khalti ePayment (KPG-2) wire formats.
 * Amounts are always in paisa — Rs. 1 = 100 paisa.
 */

export const KhaltiInitiateResponseSchema = z.object({
    pidx: z.string().trim().min(1),
    payment_url: z.string().trim().min(1),
    expires_at: z.string().optional(),
    expires_in: z.number().optional(),
});
export type KhaltiInitiateResponse = z.infer<typeof KhaltiInitiateResponseSchema>;

/** Only "Completed" means the money actually arrived — everything else withholds service. */
export const KHALTI_PAYMENT_STATUSES = [
    "Completed",
    "Pending",
    "Initiated",
    "Refunded",
    "Partially Refunded",
    "Expired",
    "User canceled",
] as const;

export const KhaltiLookupResponseSchema = z.object({
    pidx: z.string().trim().min(1),
    total_amount: z.number(),
    status: z.enum(KHALTI_PAYMENT_STATUSES),
    transaction_id: z.string().nullable().optional(),
    fee: z.number().optional(),
    refunded: z.boolean().optional(),
});
export type KhaltiLookupResponse = z.infer<typeof KhaltiLookupResponseSchema>;

export type InitiatePaymentResult = {
    pidx: string;
    paymentUrl: string;
    expiresAt?: string;
};

export type VerifyPaymentResult = {
    status: KhaltiLookupResponse["status"];
    paid: boolean;
    bookingId: string;
    transactionId?: string | null;
};
