import type { Request, Response } from "express";
import jobService from "../services/jobs.service";
import { JobStatus } from "../constants/enums"; // Import JobStatus
import { literal } from "sequelize";

class JobController {
  public createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobAttributes = req.body;
      const job = await jobService.createJob(jobAttributes);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ error: "Failed to create job" });
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
        res.status(400).json({ error: "Status is required" });
        return;
      }

      if (!Object.values(JobStatus).includes(status)) {
        res.status(400).json({ error: "Invalid status value" });
        return;
      }

      const updatedJob = await jobService.updateJobStatus(
        jobId as string,
        status,
      );
      res.status(200).json(updatedJob);
    } catch (error: any) {
      console.error("Error updating job status:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to update job status" });
    }
  };

  public getPaginatedJobs = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const search = req.query.search as string | undefined;
      const status = req.query.status as JobStatus | undefined;

      const { jobs, total, currentPage, totalPages } =
        await jobService.getPaginatedJobs(page, pageSize, search, status);

      res.status(200).json({
        data: {
          jobs,
          total,
          currentPage,
          totalPages,
        },
        message: "Paginated jobs retrieved successfully",
        status: "success",
      });
    } catch (error) {
      console.error("Error getting paginated jobs:", error);
      res.status(500).json({ error: "Failed to get paginated jobs" });
    }
  };

  public getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = req.params.jobId as string;

      const job = await jobService.getJobById(jobId);

      if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
      }

      res.status(200).json({
        data: job,
        message: "Job retrieved successfully",
        status: "success",
      });
    } catch (error) {
      console.error("Error getting job by ID:", error);
      res.status(500).json({ error: "Failed to get job by ID" });
    }
  };
}

export default new JobController();
