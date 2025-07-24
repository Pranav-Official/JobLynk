import { Router } from "express";
import jobController from "../controllers/jobs.controller";
import { withAuth } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/role.middleware";

const router = Router();

// Route to create a new job
router.post("/", [withAuth, checkRole("recruiter")], jobController.createJob);

// Route to update a job by ID
router.patch("/:jobId", jobController.updateJob);

router.get("/:jobId", jobController.getJobById);

// Route to get a paginated list of jobs
router.get("/", jobController.getPaginatedJobs);

router.get(
  "/recruiter/:recruiterId",
  [withAuth, checkRole("recruiter")],
  jobController.getPaginatedJobs,
);

export default router;
