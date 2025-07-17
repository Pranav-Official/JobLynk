import type { Request, Response } from "express";
import userService from "../services/user.service";

class UserController {
  public createUser = async (req: Request, res: Response): Promise<void> => {
    const userAttributes = req.body;
    const user = await userService.createUser(userAttributes);
    res.status(201).json(user);
  };

  public updateUserRole = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await userService.updateUserRole(Number(userId), role);
    res.status(200).json(user);
  };
}

export default new UserController();
