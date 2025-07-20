import db from "../models";
import type { JobAttributes } from "../models/jobs/jobs.model";
import { JobStatus } from "../constants/enums"; // Import JobStatus Enum
import { literal } from "sequelize"; // Import literal
import { Op } from "sequelize";

class JobService {
  async createJob(jobAttributes: JobAttributes): Promise<JobAttributes> {
    const job = await db.Jobs.create(jobAttributes);
    return job.get({ plain: true });
  }

  async updateJobStatus(
    jobId: string,
    status: JobStatus, // Correctly type status as JobStatus enum
  ): Promise<JobAttributes> {
    const job = await db.Jobs.findByPk(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    // Validate status - this provides better error handling
    if (!Object.values(JobStatus).includes(status)) {
      throw new Error(`Invalid job status: ${status}`);
    }
    try {
      await job.update({ status });
      return job.get({ plain: true });
    } catch (error) {
      console.error("Error updating job status:", error);
      throw new Error("Failed to update job status");
    }
  }

  async getPaginatedJobs(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    location?: string,
    jobType?: string,
  ): Promise<{
    jobs: JobAttributes[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * pageSize;
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { descriptionMarkdown: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (jobType) {
      where.jobType = { [Op.eq]: jobType };
    }

    where.status = { [Op.eq]: JobStatus.ACTIVE };

    const { rows, count } = await db.Jobs.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]], // Example ordering
      attributes: {
        exclude: ["descriptionMarkdown"],
      },
    });

    const jobs = rows.map((row) => row.get({ plain: true }));
    const totalPages = Math.ceil(count / pageSize);

    return {
      jobs,
      total: count,
      currentPage: page,
      totalPages,
    };
  }

  async getJobById(jobId: string): Promise<JobAttributes> {
    const job = await db.Jobs.findByPk(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    return job.get({ plain: true });
  }
}

export default new JobService();
