import db from "../models";
import type { RecruiterAttributes } from "../models/user/recruiter.model";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

class RecruiterService {
  public async createRecruiter(
    recruiterAttributes: RecruiterAttributes,
  ): Promise<RecruiterAttributes> {
    try {
      const recruiter = await db.Recruiter.create(recruiterAttributes);
      return recruiter.get({ plain: true });
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "A recruiter profile already exists for this user.",
        );
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create recruiter profile. " + error,
      );
    }
  }

  public async updateRecruiter(
    userId: string,
    updates: Partial<RecruiterAttributes>,
  ): Promise<RecruiterAttributes> {
    try {
      const recruiter = await db.Recruiter.findOne({ where: { userId } });
      if (!recruiter) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Recruiter profile not found for this user.",
        );
      }
      await recruiter.update(updates);
      return recruiter.get({ plain: true });
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update recruiter profile. " + error,
      );
    }
  }

  public async getRecruiter(userId: string): Promise<RecruiterAttributes> {
    try {
      const recruiter = await db.Recruiter.findOne({ where: { userId } });
      if (!recruiter) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Recruiter profile not found for this user.",
        );
      }
      return recruiter.get({ plain: true });
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve recruiter profile. " + error,
      );
    }
  }
}

export default new RecruiterService();
