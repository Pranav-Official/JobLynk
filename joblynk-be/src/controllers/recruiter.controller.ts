import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import recruiterService from "../services/recruiter.service";
import jobService from "../services/jobs.service";
import ApiError from "../utils/ApiError";

class RecruiterController {
  public updateRecruiter = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const updates = req.body;
      const userId = req.userId;
      console.log("recruiter patch updates", updates);
      if (!userId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User ID is required.");
      }
      if (Object.keys(updates).length < 1) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No updates provided.");
      }

      const updatedRecruiter = await recruiterService.updateRecruiter(
        userId,
        updates,
      );

      res.status(StatusCodes.OK).json({
        data: updatedRecruiter,
        message: "Recruiter profile updated successfully.",
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

export default new RecruiterController();
