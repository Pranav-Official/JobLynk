import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import userService from "../services/user.service";
import ApiError from "../utils/ApiError";
import seekerService from "../services/seeker.service";
import recruiterService from "../services/recruiter.service";

class UserController {
  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userAttributes = req.body;
      const user = await userService.createUser(userAttributes);
      res.status(StatusCodes.CREATED).json(user);
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  };

  public updateUserRole = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { role, userId } = req.body;
    try {
      if (!userId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User ID is required.");
      }
      const user = await userService.updateAnyUserAttribute(userId, {
        role,
      });
      if (role === "seeker") {
        const seeker = await seekerService.createSeeker({ userId });
        res.status(StatusCodes.OK).json({
          data: {
            user,
            seeker,
          },
          message: "seeker profile created sucessfully",
        });
      } else if (role === "recruiter") {
        const recruiter = await recruiterService.createRecruiter({ userId });
        res.status(StatusCodes.OK).json({
          data: {
            user,
            recruiter,
          },
          message: "seeker recruiter created sucessfully",
        });
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  };
}

export default new UserController();
