import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";
import cloudinary from "cloudinary";

export const postApplication = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Employer") {
      return res.status(400).json({
        success: false,
        message: "Employer not allowed to access this resource.",
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Resume File Required!",
      });
    }

    const { resume } = req.files;
    // const allowedFormats = ["application/pdf","image/jpg"];
    // if (!allowedFormats.includes(resume.mimetype)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid file type. Please upload a PDF file.",
    //   });
    // }

    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, {
        resource_type: "pdf" 
      });

      console.log("cloudinary Response:",cloudinaryResponse)

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return res.status(500).json({
        success: false,
        message: "Failed to upload Resume to Cloudinary",
      });
    }

    const { name, email, coverLetter, phone, address, jobId } = req.body;
    if (!jobId) {
      return res.status(404).json({
        success: false,
        message: "Job not found!",
      });
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
      return res.status(404).json({
        success: false, 
        message: "Job not found!",
      });
    }

    const applicantID = { user: req.user._id, role: "Job Seeker" };
    const employerID = { user: jobDetails.postedBy, role: "Employer" };

    if (!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID,
      resume: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    console.error("Error posting application:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const employerGetAllApplications = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return res.status(400).json({
        success: false,
        message: "Job Seeker not allowed to access this resource.",
      });
    }

    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching employer applications:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const jobseekerGetAllApplications = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Employer") {
      return res.status(400).json({
        success: false,
        message: "Employer not allowed to access this resource.",
      });
    }

    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching jobseeker applications:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export const jobseekerDeleteApplication = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Employer") {
      return res.status(400).json({
        success: false,
        message: "Employer not allowed to access this resource.",
      });
    }

    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found!",
      });
    }

    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
