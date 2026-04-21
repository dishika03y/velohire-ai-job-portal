import { Job } from "../models/Job.js";
import { Company } from "../models/Company.js";
import { User } from "../models/User.js";
import { Application } from "../models/Application.js";
import { searchSuggestions } from "../utils/nlpProcessor.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("profile.skills");

    if (!user || !user.profile.skills.length) {
      return res.status(200).json({
        recommended_jobs: [],
        message: "Add skills to your profile for better matches!",
      });
    }

    const allJobs = await Job.find().populate("company", "name logo");

    let recommendedIds = [];

    try {
      // 🔥 Gemini call (may fail)
      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash",
      });

      const prompt = `
        As a career assistant, compare the user's skills with these jobs.
        User Skills: ${user.profile.skills.join(", ")}
        Available Jobs Data: ${JSON.stringify(
          allJobs.map((j) => ({
            id: j._id,
            title: j.title,
            requirements: j.requirements,
          })),
        )}
        
        Return ONLY a valid JSON array of the top 3 Job IDs that match best. 
        Example format: ["ID1", "ID2", "ID3"]
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      console.log("Gemini recommendation response:", responseText);

      const match = responseText.match(/\[.*\]/s);

      if (match) {
        recommendedIds = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON from AI");
      }
    } catch (aiError) {
      // 🔥 FALLBACK if Gemini fails
      console.error("Gemini failed, using fallback:", aiError.message);

      recommendedIds = allJobs.slice(0, 3).map((job) => job._id.toString());
    }

    const recommendedJobs = allJobs.filter((job) =>
      recommendedIds.includes(job._id.toString()),
    );

    return res.status(200).json({
      success: true,
      recommended_jobs: recommendedJobs,
    });
  } catch (error) {
    console.error("Final Recommendation Error:", error);

    // 🔥 FINAL FALLBACK (guaranteed response)
    try {
      const fallbackJobs = await Job.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("company");

      return res.status(200).json({
        recommended_jobs: fallbackJobs,
        note: "Final fallback used",
      });
    } catch {
      return res.status(200).json({
        recommended_jobs: [],
      });
    }
  }
};

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    console.log("Creating job with created_by:", userId);
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary,
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log("Error in postJob:", error);
    return res.status(500).json({
      message: "An error occurred while creating the job.",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
        select: "name logo website",
      })
      .sort({ createdAt: -1 });

    console.log(`Fetched ${jobs.length} jobs for keyword "${keyword}":`, jobs);

    if (!jobs.length) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while fetching jobs.",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({
        path: "applications",
        select: "applicant",
      })
      .populate({
        path: "company",
        select: "name logo",
      });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while fetching the job.",
      success: false,
    });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    console.log("Fetching admin jobs for user ID:", adminId);
    const jobs = await Job.find({ created_by: adminId })
      .populate({
        path: "company",
        select: "name logo",
      })
      .sort({ createdAt: -1 });

    console.log("Found jobs:", jobs);
    if (!jobs.length) {
      return res.status(404).json({
        message: "No jobs found for this employer.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log("Error in getAdminJobs:", error);
    return res.status(500).json({
      message: "An error occurred while fetching admin jobs.",
      success: false,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this job.",
        success: false,
      });
    }

    await Job.findByIdAndDelete(jobId);
    return res.status(200).json({
      message: "Job deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the job.",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name logo",
        },
      })
      .sort({ createdAt: -1 });

    if (!applications.length) {
      return res.status(404).json({
        message: "No applications found.",
        success: false,
      });
    }

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({
      message: "An error occurred while fetching applied jobs.",
      success: false,
    });
  }
};

export const getJobSuggestions = (req, res) => {
  const { query, type } = req.query;
  const results = searchSuggestions(query, type);
  res.json(results);
};

export const searchJobs = async (req, res) => {
  try {
    const { role, location, jobType, companyName } = req.query;

    const company = companyName
      ? await Company.findOne({
          name: { $regex: new RegExp(companyName, "i") },
        })
      : null;

    const query = {
      ...(role && { title: { $regex: new RegExp(role, "i") } }),
      ...(location && { location: { $regex: new RegExp(location, "i") } }),
      ...(jobType && { jobType: { $regex: new RegExp(jobType, "i") } }),
      ...(company
        ? { company: company._id }
        : companyName
          ? { company: null }
          : {}),
    };

    const jobs = await Job.find(query).populate("company");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};
