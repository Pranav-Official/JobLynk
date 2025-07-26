import db from "../models";
import { Op, Sequelize } from "sequelize";
import type { ApplicationAttributes } from "../models/jobs/application.model";
import { ApplicationStatus } from "../constants/enums";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";

class ApplicationService {
  async createApplication(
    applicationAttributes: ApplicationAttributes,
  ): Promise<ApplicationAttributes> {
    console.log(
      "Creating application... with attributes:",
      applicationAttributes,
    );
    const existingApplication = await db.Application.findOne({
      where: {
        seekerId: applicationAttributes.seekerId,
        jobId: applicationAttributes.jobId,
      },
    });
    if (existingApplication) {
      throw new ApiError(StatusCodes.CONFLICT, "Application already exists");
    }
    const application = await db.Application.create(applicationAttributes);
    if (!application) {
      throw new Error("Failed to create application");
    }
    return application.get({ plain: true });
  }

  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<ApplicationAttributes> {
    const application = await db.Application.findByPk(applicationId);

    if (!application) {
      console.log("Application not found, application service 44");
      throw new Error("Application not found");
    }

    if (!Object.values(ApplicationStatus).includes(status)) {
      throw new Error(`Invalid application status: ${status}`);
    }

    try {
      await application.update({ status });
      return application.get({ plain: true });
    } catch (error) {
      console.error("Error updating application status:", error);
      throw new Error("Failed to update application status");
    }
  }

  async getPaginatedApplications(
    page: number = 1,
    pageSize: number = 10,
    seekerId: string,
  ): Promise<{
    applications: ApplicationAttributes[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    console.log("Fetching paginated applications...");
    const offset = (page - 1) * pageSize;
    const where: any = {};
    if (seekerId) {
      where.seekerId = { [Op.eq]: seekerId };
    }

    const { rows, count } = await db.Application.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [["applicationDate", "DESC"]],
      include: [
        {
          model: db.Jobs,
          as: "job",
          attributes: ["id", "title", "location", "jobType"],
          include: [
            {
              model: db.Recruiter,
              as: "recruiter",
              attributes: ["id", "companyName"],
            },
          ],
        },
      ],
    });

    const applications = rows.map((row) => row.get({ plain: true }));
    const totalPages = Math.ceil(count / pageSize);

    return {
      applications,
      total: count,
      currentPage: page,
      totalPages,
    };
  }

  async getPaginatedApplicationsByRecruiter(
    recruiterId: string,
    page: number = 1,
    pageSize: number = 10,
    status?: ApplicationStatus,
  ): Promise<{
    applications: ApplicationAttributes[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    console.log(
      "Fetching paginated applications for recruiter ID:",
      recruiterId,
    );
    const offset = (page - 1) * pageSize;
    const where: any = {};
    const jobIncludeWhere: any = { recruiterId: { [Op.eq]: recruiterId } };

    if (status) {
      where.status = { [Op.eq]: status };
    }

    const { rows, count } = await db.Application.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [["applicationDate", "DESC"]],
      include: [
        {
          model: db.Jobs,
          as: "job",
          attributes: ["id", "title", "location", "jobType"],
          where: jobIncludeWhere,
          required: true,
        },
        {
          model: db.Seeker,
          as: "seeker",
          attributes: ["id", "employmentStatus", "resumeUrl"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            },
          ],
        },
      ],
    });

    const applications = rows.map((row) => row.get({ plain: true }));
    const totalPages = Math.ceil(count / pageSize);

    return {
      applications,
      total: count,
      currentPage: page,
      totalPages,
    };
  }

  async getApplicationById(id: string): Promise<any> {
    const application = await db.Application.findByPk(id, {
      include: [
        {
          model: db.Jobs,
          as: "job",
          attributes: ["id", "title", "location", "jobType", "recruiterId"],
          required: true,
        },
        {
          model: db.Seeker,
          as: "seeker",
          attributes: ["id", "employmentStatus", "resumeUrl"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            },
          ],
        },
      ],
    });

    return application?.get({ plain: true }) || null;
  }

  async rejectApplicationsByJobId(jobId: string): Promise<void> {
    await db.Application.update(
      { status: "Rejected" },
      {
        where: {
          jobId,
        },
      },
    );
  }
}

export default new ApplicationService();
