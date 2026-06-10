import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middlewares/authorization.middleware";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();
const userController = new UserController();

router.get("/me", authorizedMiddleware, userController.getProfile.bind(userController));
router.patch("/me", authorizedMiddleware, userController.updateProfile.bind(userController));
router.patch("/me/location", authorizedMiddleware, userController.updateLocation.bind(userController));
router.patch(
    "/me/profile-picture",
    authorizedMiddleware,
    uploads.single("profilePicture"),
    userController.uploadProfilePicture.bind(userController)
);

export default router;
