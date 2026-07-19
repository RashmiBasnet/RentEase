import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";

const router = Router();
const paymentController = new PaymentController();

router.post(
    "/khalti/initiate",
    authorizedMiddleware,
    paymentController.initiateKhaltiPayment.bind(paymentController)
);
router.post(
    "/khalti/verify",
    authorizedMiddleware,
    paymentController.verifyKhaltiPayment.bind(paymentController)
);

export default router;
