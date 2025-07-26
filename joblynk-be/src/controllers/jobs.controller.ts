import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import jobService from "../services/jobs.service";
import recruiterService from "../services/recruiter.service";
import userService from "../services/user.service";
import { JobStatus } from "../constants/enums";
import ApiError from "../utils/ApiError";
import applicationService from "../services/application.service";

class JobController {
  public createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobAttributes = req.body;
      const userId = req.userId;
      if (!userId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User ID is required.");
      }
      const recruiter = await recruiterService.getRecruiter(userId);
      jobAttributes.recruiterId = recruiter.id;
      const job = await jobService.createJob(jobAttributes);

      res.status(StatusCodes.CREATED).json({
        data: job,
        message: "Job created successfully.",
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

  public updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { jobId } = req.params;
      console.log("Updating job with ID:", jobId);
      const jobData = req.body;
      const updatedJob = await jobService.updateJob(jobId || "", jobData);
      console.log("Updated job:", updatedJob);
      res.status(StatusCodes.OK).json(updatedJob);
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

  public updateJobStatus = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { jobId } = req.params;
      const status = req.body.status as JobStatus;

      if (!status) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Status is required");
      }

      if (!Object.values(JobStatus).includes(status)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid status value");
      }

      const updatedJob = await jobService.updateJobStatus(
        jobId as string,
        status,
      );
      res.status(StatusCodes.OK).json(updatedJob);
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

  public getPaginatedJobs = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      console.log("Fetching paginated jobs...");
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const search = req.query.search as string | undefined;
      const location = req.query.location as string | undefined;
      const jobType = req.query.jobType as string | undefined;

      const { jobs, total, currentPage, totalPages } =
        await jobService.getPaginatedJobs(
          page,
          pageSize,
          search,
          location,
          jobType,
        );

      res.status(StatusCodes.OK).json({
        data: {
          jobs,
          total,
          currentPage,
          totalPages,
        },
        message: "Paginated jobs retrieved successfully",
        status: "success",
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  };

  public getPaginatedRecruiterJobs = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      console.log("Fetching paginated jobs...");
      const userId = req.userId;
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const search = req.query.search as string | undefined;
      const location = req.query.location as string | undefined;
      const jobType = req.query.jobType as string | undefined;

      const user = await userService.getUser(userId || "");
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }
      const recruiterId = user.recruiter?.id;

      const { jobs, total, currentPage, totalPages } =
        await jobService.getPaginatedJobs(
          page,
          pageSize,
          search,
          location,
          jobType,
          recruiterId,
        );

      res.status(StatusCodes.OK).json({
        data: {
          jobs,
          total,
          currentPage,
          totalPages,
        },
        message: "Paginated jobs retrieved successfully",
        status: "success",
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  };

  public getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = req.params.jobId as string;

      const job = await jobService.getJobById(jobId);

      if (!job) {
        console.log("Job not found jcb.controller 193");
        throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
      }

      res.status(StatusCodes.OK).json({
        data: job,
        message: "Job retrieved successfully",
        status: "success",
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

  public deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = req.params.jobId as string;

      const job = await jobService.deleteJob(jobId);

      if (!job) {
        console.log("Job not found");
        throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
      }

      await applicationService.rejectApplicationsByJobId(jobId);

      res.status(StatusCodes.OK).json({
        data: job,
        message: "Job deleted successfully",
        status: "success",
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

export default new JobController();
