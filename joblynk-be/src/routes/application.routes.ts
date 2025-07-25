import { Router } from "express";
import applicationController from "../controllers/application.controller";
import { checkRole } from "../middleware/role.middleware";

const router = Router();

// Route to create a new application
router.post("/", checkRole("seeker"), applicationController.createApplication);

router.get("/", checkRole("seeker"), applicationController.getApplications);

router.get(
  "/recruiter",
  checkRole("recruiter"),
  applicationController.getRecruiterApplications,
);

router.put(
  "/recruiter/:id",
  checkRole("recruiter"),
  applicationController.updateApplicationStatus,
);

export default router;
