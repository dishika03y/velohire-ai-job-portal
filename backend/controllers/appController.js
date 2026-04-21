import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import transporter from "../utils/config.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Job id is required.", success: false });
    }

    // 1. Logic Check: Has user applied before?
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // 2. Logic Check: Does the job exist?
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // 3. Create the application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // 4. SYNC LOGIC: Update the Job's applications array
    // This ensures that job.populate('applications') works on the frontend
    job.applications.push(newApplication._id);
    await job.save();

    return res
      .status(201)
      .json({ message: "Job applied successfully.", success: true });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    // We find all applications by this user and populate the nested job and company details
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" },
      });

    if (!applications || applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No Applications found", success: false });
    }

    return res.status(200).json({ application: applications, success: true });
  } catch (error) {
    console.error("Get Applied Jobs Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    // LOGIC FIX: Instead of finding the job and populating,
    // we query the Application collection directly for accuracy.
    const applicants = await Application.find({ job: jobId })
      .populate({
        path: "applicant",
        select: "fullname email phoneNumber profile", // Ensure we get the profile for AI ranking
      })
      .sort({ createdAt: -1 });

    // Note: applicants will be an empty array if none found, not null
    if (!applicants || applicants.length === 0) {
      return res
        .status(404)
        .json({ message: "No applicants found for this job.", success: false });
    }

    return res.status(200).json({ applicants, success: true });
  } catch (error) {
    console.error("Get Applicants Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params; // Application ID
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ message: "Status is required", success: false });
    }

    // Find application and populate applicant/job for the email content
    const application =
      await Application.findById(id).populate("applicant job");

    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found.", success: false });
    }

    // Update the status
    application.status = status.toLowerCase();
    await application.save();

    // EMAIL LOGIC
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.applicant.email,
      subject: `Application Update: ${application.job.title}`,
      text: `Hello ${application.applicant.fullname}, the status of your application for ${application.job.title} has been updated to: ${status}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error("Email failed to send:", error);
      else console.log("Status email sent:", info.response);
    });

    return res.status(200).json({
      message: "Status updated and email sent successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Error updating status", success: false });
  }
};
