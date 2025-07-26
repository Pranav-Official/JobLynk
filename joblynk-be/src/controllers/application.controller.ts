import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import applicationService from "../services/application.service";
import jobService from "../services/jobs.service";
import userService from "../services/user.service";
import ApiError from "../utils/ApiError";

class ApplicationController {
  public createApplication = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { jobId } = req.body;
      const userId = req.userId;

      if (!userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User ID missing.");
      }
      if (!jobId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Job ID is required.");
      }

      const user = await userService.getUser(userId);
      if (!user || !user.seeker || !user.seeker.id) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Seeker profile not found.",
        );
      }

      const seekerId = user.seeker.id;

      const applicationAttributes = {
        jobId,
        seekerId,
      };

      const application = await applicationService.createApplication(
        applicationAttributes,
      );

      res.status(StatusCodes.CREATED).json({
        data: application,
        message: "Application submitted successfully.",
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error("Error in createApplication:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  };

  public async getApplications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 10;

      if (!userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User ID missing.");
      }

      const user = await userService.getUser(userId);
      if (!user || !user.seeker || !user.seeker.id) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Seeker profile not found.",
        );
      }

      const seekerId = user.seeker.id;

      const applications = await applicationService.getPaginatedApplications(
        page,
        pageSize,
        seekerId,
      );

      res.status(StatusCodes.OK).json({
        data: applications,
        message: "Applications retrieved successfully.",
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error("Error in getApplications:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  }

  public async getRecruiterApplications(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.userId;
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 10;

      if (!userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User ID missing.");
      }

      const user = await userService.getUser(userId);
      if (!user || !user.recruiter || !user.recruiter.id) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Recruiter profile not found.",
        );
      }

      const recruiterId = user.recruiter.id;

      const applications =
        await applicationService.getPaginatedApplicationsByRecruiter(
          recruiterId,
          page,
          pageSize,
        );

      res.status(StatusCodes.OK).json({
        data: applications,
        message: "Applications retrieved successfully.",
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error("Error in getRecruiterApplications:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  }

  public async updateApplicationStatus(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.userId;
      const applicationId = req.params.id;
      const status = req.body.status;

      if (!userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User ID missing.");
      }

      const user = await userService.getUser(userId);
      if (!user || !user.recruiter || !user.recruiter.id) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Recruiter profile not found.",
        );
      }

      const recruiterId = user.recruiter.id;

      const application = await applicationService.getApplicationById(
        applicationId || "",
      );

      if (!application) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Application not found.");
      }

      if (application.job.recruiterId !== recruiterId) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "You are not authorized to update this application.",
        );
      }

      const updatedApplication =
        await applicationService.updateApplicationStatus(
          applicationId || "",
          status,
        );

      res.status(StatusCodes.OK).json({
        data: updatedApplication,
        message: "Application status updated successfully.",
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error("Error in updateApplicationStatus:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  }
}

export default new ApplicationController();
