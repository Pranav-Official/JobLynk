import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

router.get("/login", authController.login);
router.get("/callback", authController.callback);
router.get("/is-logged-in", authController.isLoggedIn);
router.get("/logout", authController.logout);

export default router;
