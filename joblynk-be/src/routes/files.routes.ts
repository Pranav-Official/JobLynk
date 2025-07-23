import { Router } from "express";
import filesController from "../controllers/files.controller";

const router = Router();

router.post("/s3-presigned-post", filesController.createPresignedPost);
router.post("/secure-resume-url", filesController.getSecureResumeUrl);

export default router;