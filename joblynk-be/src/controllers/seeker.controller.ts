import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import seekerService from "../services/seeker.service";
import ApiError from "../utils/ApiError";

class SeekerController {
  public updateSeeker = async (req: Request, res: Response): Promise<void> => {
    try {
      const updates = req.body; // Updates to apply to the seeker profile
      const { userId } = updates;
      if (!userId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User ID is required.");
      }
      if (Object.keys(updates).length <= 1) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No updates provided.");
      }

      const updatedSeeker = await seekerService.updateSeeker(userId, updates);

      res.status(StatusCodes.OK).json({
        data: updatedSeeker,
        message: "Seeker profile updated successfully.",
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

export default new SeekerController();
