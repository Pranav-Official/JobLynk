import { Router } from "express";
import recruiterController from "../controllers/recruiter.controller";
import jobController from "../controllers/jobs.controller";
import { checkRole } from "../middleware/role.middleware";

const router = Router();

// Route to update recruiter profile
router.patch("/", checkRole("recruiter"), recruiterController.updateRecruiter);

export default router;
