import db from "../models";
import type { SeekerAttributes } from "../models/user/seeker.model";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

class SeekerService {
  public async createSeeker(
    seekerAttributes: SeekerAttributes,
  ): Promise<SeekerAttributes> {
    try {
      const seeker = await db.Seeker.create(seekerAttributes);
      return seeker.get({ plain: true });
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const seeker = await db.Seeker.findOne({
          where: { userId: seekerAttributes.userId },
        });
        if (seeker) {
          return seeker.get({ plain: true });
        }
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to create seeker profile." + error,
        );
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create seeker profile." + error,
      );
    }
  }

  public async updateSeeker(
    userId: string,
    updates: Partial<SeekerAttributes>,
  ): Promise<SeekerAttributes> {
    try {
      const seeker = await db.Seeker.findOne({ where: { userId } });
      if (!seeker) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Seeker profile not found for this user.",
        );
      }
      await seeker.update(updates);
      return seeker.get({ plain: true });
    } catch (error: any) {
      console.log(error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update seeker profile. " + error,
      );
    }
  }
}

export default new SeekerService();
