import { Router } from "express";
import seekerController from "../controllers/seeker.controller";
import { checkRole } from "../middleware/role.middleware";

const router = Router();

// Route to create a update a seeker profile
router.post("/", checkRole("seeker"), seekerController.updateSeeker);

export default router;
