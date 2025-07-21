import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import jobRouter from "./routes/jobs.routes";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import seekerRouter from "./routes/seeker.routes";

const app = express();
const port = 8080;

// Configure CORS
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
};

app.use(cookieParser()); // Parse cookies
app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/seeker", seekerRouter);

app.get("/health", (req, res) => {
  res.status(200).send("API is healthy");
});

export default app;
