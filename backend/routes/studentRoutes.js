import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Job from "../models/Job.js";

const router = express.Router();

// Student dashboard route
router.get("/dashboard", protect, async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select("-password");
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ status: "active" }).select("title company description eligibility lastDate");

    res.json({
      student,
      courses: jobs, // reuse your "courses" UI to show jobs
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
