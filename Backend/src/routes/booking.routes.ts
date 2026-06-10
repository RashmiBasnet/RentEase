import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import {
    adminOnlyMiddleware,
    authorizedMiddleware,
} from "../middlewares/authorization.middleware";

const router = Router();
const bookingController = new BookingController();

router.post("/", authorizedMiddleware, bookingController.createBooking.bind(bookingController));
router.get(
    "/",
    authorizedMiddleware,
    adminOnlyMiddleware,
    bookingController.getAllBookings.bind(bookingController)
);
router.get("/me", authorizedMiddleware, bookingController.getMyBookings.bind(bookingController));
router.get("/:id", authorizedMiddleware, bookingController.getBookingById.bind(bookingController));
router.patch(
    "/:id/status",
    authorizedMiddleware,
    bookingController.updateBookingStatus.bind(bookingController)
);
router.patch("/:id/cancel", authorizedMiddleware, bookingController.cancelBooking.bind(bookingController));

export default router;
