import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
} from "../controllers/applicationController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", authMiddleware, postApplication);
router.get("/employer/getall", authMiddleware, employerGetAllApplications);
router.get("/jobseeker/getall", authMiddleware, jobseekerGetAllApplications);
router.delete("/delete/:id", authMiddleware, jobseekerDeleteApplication);

export default router;