import { Job } from "../models/jobModel.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: 'Server error while fetching jobs.',
      error: error.message,
    });
  }
};

export const postJob = async (req, res) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return res.status(400).json({
      success: false,
      message: "Job Seeker not allowed to access this resource.",
    });
  }
  const {
    title, description, category, country, city, location,
    fixedSalary, salaryFrom, salaryTo
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return res.status(400).json({
      success: false,
      message: "Please provide full job details.",
    });
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return res.status(400).json({
      success: false,
      message: "Please either provide fixed salary or ranged salary.",
    });
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return res.status(400).json({
      success: false,
      message: "Cannot Enter Fixed and Ranged Salary together.",
    });
  }

  try {
    const postedBy = req.user._id;
    const job = await Job.create({
      title, description, category, country, city, location,
      fixedSalary, salaryFrom, salaryTo, postedBy,
    });
    res.status(200).json({
      success: true,
      message: "Job Posted Successfully!",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while posting job.',
      error: error.message,
    });
  }
};

export const getMyJobs = async (req, res) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return res.status(400).json({
      success: false,
      message: "Job Seeker not allowed to access this resource.",
    });
  }
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
      success: true,
      myJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs.',
      error: error.message,
    });
  }
};

export const updateJob = async (req, res) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return res.status(400).json({
      success: false,
      message: "Job Seeker not allowed to access this resource.",
    });
  }
  const { id } = req.params;
  try {
    let job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "OOPS! Job not found.",
      });
    }
    job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Job Updated!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating job.',
      error: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return res.status(400).json({
      success: false,
      message: "Job Seeker not allowed to access this resource.",
    });
  }
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "OOPS! Job not found.",
      });
    }
    await job.deleteOne();
    res.status(200).json({
      success: true,
      message: "Job Deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting job.',
      error: error.message,
    });
  }
};

export const getSingleJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Invalid ID or CastError',
      error: error.message,
    });
  }
};
