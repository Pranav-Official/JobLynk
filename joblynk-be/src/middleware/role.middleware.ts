import type { NextFunction, Request, Response } from "express";
import db from "../models";

export const checkRole = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    console.log("role check userid", userId, " for role", requiredRole);
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found." });
    }

    try {
      const user = await db.User.findByPk(userId, { raw: true });
      console.log("role check user", user);
      if (!user) {
        return res
          .status(404)
          .json({ message: "Unauthorized: User not found." });
      }

      const userRole = user.role;

      if (!userRole || userRole !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role." });
      }
      next();
    } catch (error) {
      console.error("Error checking user role:", error);
      return res
        .status(500)
        .json({ message: "Internal server error during role check." });
    }
  };
};
