import { Router } from "express";
import seekerController from "../controllers/seeker.controller";

const router = Router();

// Route to create a update a seeker profile
router.post("/", seekerController.updateSeeker);

export default router;
