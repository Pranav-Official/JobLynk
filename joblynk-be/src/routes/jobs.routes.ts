import { Router } from "express";
import jobController from "../controllers/jobs.controller";

const router = Router();

// Route to create a new job
router.post("/", jobController.createJob);

// Route to update the status of a job by ID
router.patch("/:jobId/status", jobController.updateJobStatus);

router.get("/:jobId", jobController.getJobById);

// Route to get a paginated list of jobs
router.get("/", jobController.getPaginatedJobs);

export default router;
