import db from "../models";
import type { JobAttributes } from "../models/jobs/jobs.model";
import { JobStatus } from "../constants/enums"; // Import JobStatus Enum
import { literal } from "sequelize"; // Import literal
import { Op } from "sequelize";

class JobService {
  async createJob(jobAttributes: JobAttributes): Promise<JobAttributes> {
    try {
      console.log("Creating job... with attributes:", jobAttributes);
      const job = await db.Jobs.create(jobAttributes);
      if (!job) {
        throw new Error("Failed to create job");
      }
      return job.get({ plain: true });
    } catch (error) {
      console.error("Error creating job:", error);
      throw new Error("Failed to create job");
    }
  }

  async updateJob(jobId: string, jobData: JobAttributes) {
    try {
      const job = await db.Jobs.findByPk(jobId);

      if (!job) {
        console.log("Job not found, jobs sdervice 27");
        throw new Error("Job not found");
      }

      await job.update(jobData);
      return job.get({ plain: true });
    } catch (error) {
      console.error("Error updating job:", error);
      throw new Error("Failed to update job");
    }
  }

  async updateJobStatus(
    jobId: string,
    status: JobStatus, // Correctly type status as JobStatus enum
  ): Promise<JobAttributes> {
    const job = await db.Jobs.findByPk(jobId);

    if (!job) {
      console.log("Job not found, jobs sdervice 46");
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
    recruiterId?: string,
  ): Promise<{
    jobs: JobAttributes[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    console.log("Fetching paginated jobs... for recruiterId:", recruiterId);
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

    if (recruiterId) {
      where.recruiterId = { [Op.eq]: recruiterId };
    } else {
      where.status = { [Op.eq]: JobStatus.ACTIVE };
    }

    const { rows, count } = await db.Jobs.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [["createdAt", "DESC"]], // Example ordering
      attributes: {
        exclude: ["descriptionMarkdown"],
      },
      include: [
        {
          model: db.Recruiter,
          as: "recruiter", // Ensure this matches the alias used in associations
          attributes: ["id", "companyName", "companyUrl"], // Include only necessary fields
        },
      ],
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
    const job = await db.Jobs.findByPk(jobId, {
      include: [
        {
          model: db.Recruiter,
          as: "recruiter",
        },
      ],
    });

    if (!job) {
      console.log("Job not found, jobs sdervice 126");
      throw new Error("Job not found");
    }

    return job.toJSON();
  }
}

export default new JobService();
