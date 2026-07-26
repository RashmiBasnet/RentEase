import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import {
    InitiateKhaltiPaymentDto,
    VerifyKhaltiPaymentDto,
} from "../dtos/payment.dto";

const paymentService = new PaymentService();

type AuthenticatedRequest = Request & {
    user?: {
        _id?: string;
        id?: string;
        role?: string;
    };
};

type ControllerError = Error & { statusCode?: number };

const getFirstZodMessage = (error: { issues: { message: string }[] }) =>
    error.issues[0]?.message || "Invalid request data";

export class PaymentController {
    async initiateKhaltiPayment(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const parsedData = InitiateKhaltiPaymentDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }

            const result = await paymentService.initiateKhaltiPayment(
                String(userId),
                parsedData.data
            );

            return res.status(200).json({
                success: true,
                data: result,
                message: "Payment initiated successfully",
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }

    async verifyKhaltiPayment(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?._id ?? authReq.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const parsedData = VerifyKhaltiPaymentDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: getFirstZodMessage(parsedData.error),
                });
            }

            const result = await paymentService.verifyKhaltiPayment(
                String(userId),
                parsedData.data
            );

            return res.status(200).json({
                success: true,
                data: result,
                message: result.paid
                    ? "Payment verified successfully"
                    : `Payment is ${result.status}`,
            });
        } catch (error: unknown) {
            const err = error as ControllerError;
            return res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    }
}
