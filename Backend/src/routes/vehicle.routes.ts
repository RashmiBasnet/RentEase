import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller";
import {
    adminOnlyMiddleware,
    authorizedMiddleware,
} from "../middlewares/authorization.middleware";
import { uploads } from "../middlewares/upload.middleware";

const router = Router();
const vehicleController = new VehicleController();
const maxVehicleImages = 12;

router.get("/", vehicleController.getAllVehicles.bind(vehicleController));
router.get("/near", vehicleController.getVehiclesNear.bind(vehicleController));
router.get("/:id", vehicleController.getVehicleById.bind(vehicleController));

router.post(
    "/",
    authorizedMiddleware,
    adminOnlyMiddleware,
    uploads.array("images", maxVehicleImages),
    vehicleController.createVehicle.bind(vehicleController)
);
router.patch(
    "/:id",
    authorizedMiddleware,
    adminOnlyMiddleware,
    uploads.array("images", maxVehicleImages),
    vehicleController.updateVehicle.bind(vehicleController)
);
router.delete(
    "/:id",
    authorizedMiddleware,
    adminOnlyMiddleware,
    vehicleController.deleteVehicle.bind(vehicleController)
);
router.patch(
    "/:id/availability",
    authorizedMiddleware,
    adminOnlyMiddleware,
    vehicleController.toggleAvailability.bind(vehicleController)
);
router.patch(
    "/:id/verification",
    authorizedMiddleware,
    adminOnlyMiddleware,
    vehicleController.toggleVerification.bind(vehicleController)
);

export default router;
