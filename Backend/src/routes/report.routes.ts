import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import {
    adminOnlyMiddleware,
    authorizedMiddleware,
} from "../middlewares/authorization.middleware";

const router = Router();
const reportController = new ReportController();

router.post("/", authorizedMiddleware, reportController.createReport.bind(reportController));
router.get(
    "/",
    authorizedMiddleware,
    adminOnlyMiddleware,
    reportController.getAllReports.bind(reportController)
);
router.get("/me", authorizedMiddleware, reportController.getMyReports.bind(reportController));
router.get("/:id", authorizedMiddleware, reportController.getReportById.bind(reportController));
router.patch(
    "/:id/status",
    authorizedMiddleware,
    adminOnlyMiddleware,
    reportController.updateReportStatus.bind(reportController)
);
router.delete("/:id", authorizedMiddleware, reportController.deleteReport.bind(reportController));

export default router;
