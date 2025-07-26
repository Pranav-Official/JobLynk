import express from "express";
import AWS from "aws-sdk";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { createRouteHandler } from "uploadthing/express";

import jobRouter from "./routes/jobs.routes";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import seekerRouter from "./routes/seeker.routes";
import recruiterRouter from "./routes/recruiter.routes";
import filesRouter from "./routes/files.routes";
import applicationRouter from "./routes/application.routes";

import { withAuth } from "./middleware/auth.middleware";

const app = express();
const port = 8080;

// Configure CORS
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
};

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

app.use(cookieParser()); // Parse cookies
app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/auth", authRouter);
app.use("/api/user", withAuth, userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/seeker", withAuth, seekerRouter);
app.use("/api/recruiter", withAuth, recruiterRouter);
app.use("/api/application", withAuth, applicationRouter);
app.use("/api/files", withAuth, filesRouter);

app.get("/health", (req, res) => {
  res.status(200).send("API is healthy");
});

export default app;
