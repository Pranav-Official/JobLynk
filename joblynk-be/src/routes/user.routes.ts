import type { Request, Response } from "express";
import { Router } from "express";

import UserController from "../controllers/user.controller";

const router = Router();

router.post("/", UserController.createUser);

router.post("/role", UserController.updateUserRole);

export default router;
