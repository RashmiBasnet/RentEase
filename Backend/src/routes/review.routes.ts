import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import {
    adminOnlyMiddleware,
    authorizedMiddleware,
} from "../middlewares/authorization.middleware";

const router = Router();
const reviewController = new ReviewController();

router.post("/", authorizedMiddleware, reviewController.createReview.bind(reviewController));
router.get("/vehicle/:vehicleId", reviewController.getReviewsForVehicle.bind(reviewController));
router.get(
    "/",
    authorizedMiddleware,
    adminOnlyMiddleware,
    reviewController.getAllReviews.bind(reviewController)
);
router.get("/:id", reviewController.getReviewById.bind(reviewController));
router.patch("/:id", authorizedMiddleware, reviewController.updateReview.bind(reviewController));
router.delete("/:id", authorizedMiddleware, reviewController.deleteReview.bind(reviewController));

export default router;
