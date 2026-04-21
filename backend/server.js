import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./utils/db.js";
import userRoute from "./routes/authRoute.js";
import companyRoute from "./routes/compRoute.js";
import jobRoute from "./routes/jobRoute.js";
import applicationRoute from "./routes/appRoute.js";
import emailRoute from "./routes/emailRoute.js";
import rankRoutes from "./routes/rankRoute.js";
import axios from "axios";
import { User } from "./models/User.js";
import Authenticate from "./middlewares/isAuthenticated.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_URL];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API Routes
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);
app.use("/api/email", emailRoute);
app.use("/api/job", rankRoutes);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/api/user/get-recommended-jobs", Authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.id).select("profile.skills");
    const allJobs = await Job.find().select("title description requirements"); // Get real jobs from DB

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `User Skills: ${user.profile.skills.join(", ")}. 
                        Available Jobs: ${JSON.stringify(allJobs)}. 
                        Pick the top 3 job IDs that match the user. 
                        Return ONLY a JSON array of IDs: ["id1", "id2"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendedIds = JSON.parse(response.text());

    const recommended_jobs = await Job.find({ _id: { $in: recommendedIds } });
    res.status(200).json({ recommended_jobs });
  } catch (error) {
    res
      .status(500)
      .json({ error: "AI matching failed, showing latest jobs instead" });
  }
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});
