import db from "../models";
import type { RecruiterAttributes } from "../models/user/recruiter.model";
import type { SeekerAttributes } from "../models/user/seeker.model";
import type { UserAttributes } from "../models/user/user.model";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { UniqueConstraintError } from "sequelize";

interface UserData {
  user: UserAttributes;
  seeker?: SeekerAttributes;
  recruiter?: RecruiterAttributes;
}

class UserService {
  public async getUser(userId: string): Promise<UserData> {
    try {
      const user = await db.User.findByPk(userId);

      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");
      }

      const userData: UserData = {
        user: user.get({ plain: true }),
      };
      console.log("role", user);
      if (userData.user.role === "seeker") {
        const seeker = await db.Seeker.findOne({
          where: { userId: userData.user.id },
        });
        if (seeker) {
          userData.seeker = seeker.get({ plain: true });
        }
      } else if (userData.user.role === "recruiter") {
        const recruiter = await db.Recruiter.findOne({
          where: { userId: userData.user.id },
        });
        if (recruiter) {
          userData.recruiter = recruiter.get({ plain: true });
        }
      }

      return userData;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve user: " + error.message,
      );
    }
  }

  public async createUser(
    userAttributes: UserAttributes,
  ): Promise<UserAttributes> {
    try {
      const user = await db.User.create(userAttributes);
      return user.get({ plain: true });
    } catch (error: any) {
      if (error instanceof UniqueConstraintError) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "User with this email/username already exists.",
        );
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create user: " + error.message,
      );
    }
  }

  public async updateAnyUserAttribute(
    userId: string,
    updates: Partial<UserAttributes>,
  ): Promise<UserAttributes> {
    console.log("userid", userId);
    try {
      const user = await db.User.findByPk(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");
      }
      await user.update(updates);
      return user.get({ plain: true });
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof UniqueConstraintError) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "The updated value for this attribute already exists for another user.",
        );
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update user: " + error.message,
      );
    }
  }
}

export default new UserService();
