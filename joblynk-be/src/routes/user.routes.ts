import type { Request, Response } from "express";
import { Router } from "express";

import userController from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getUser);

router.post("/", userController.createUser);

router.put("/", userController.updateUser);

router.post("/role", userController.updateUserRole);

export default router;
