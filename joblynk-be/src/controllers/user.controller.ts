import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import userService from "../services/user.service";
import ApiError from "../utils/ApiError";
import seekerService from "../services/seeker.service";
import recruiterService from "../services/recruiter.service";

class UserController {
  public getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      console.log("useId from middleware", userId);
      const data = await userService.getUser(userId as string);
      res.status(StatusCodes.OK).json({
        data,
        message: "user details retrived",
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res
          .status(error.statusCode)
          .json({ data: null, message: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userAttributes = req.body;
      userAttributes.id = req.userId;
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
    const { role } = req.body;
    const userId = req.userId;
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

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId || "";
    const { firstName, lastName, email, phone } = req.body;
    try {
      const user = await userService.updateAnyUserAttribute(userId, {
        firstName,
        lastName,
        email,
        phone,
      });
      res.status(StatusCodes.OK).json({
        data: user,
        message: "User updated successfully",
      });
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
