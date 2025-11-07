import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

const router = express.Router();

router.put("/profile", protect, async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    student.profile = req.body.profile;
    await student.save();

    res.json({ message: "Profile updated successfully", student });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧭 Student Dashboard
router.get("/dashboard", protect, async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select("-password");
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ status: "active" }).select(
      "title company description eligibility lastDate"
    );

    const applications = await Application.find({ studentId: student._id })
      .populate("jobId", "title company");

    res.json({ student, jobs, applications });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📝 Update Student Profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { resume, cgpa, branch, skills, phone, college } = req.body;

    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "User not found" });

    student.profile = {
      ...student.profile,
      resume: resume || student.profile?.resume,
      cgpa: cgpa || student.profile?.cgpa,
      branch: branch || student.profile?.branch,
      skills: skills || student.profile?.skills,
      phone: phone || student.profile?.phone,
      college: college || student.profile?.college,
    };

    await student.save();
    res.json({ message: "Profile updated successfully", student });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🚀 Apply to Job (using stored profile info)
router.post("/apply/:jobId", protect, async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const jobId = req.params.jobId;

    // Check duplicate
    const existing = await Application.findOne({
      studentId: student._id,
      jobId,
    });
    if (existing)
      return res.status(400).json({ message: "Already applied to this job" });

    // Create new application
    const application = new Application({
      studentId: student._id,
      jobId,
      resume: student.profile?.resume,
      status: "applied",
    });

    await application.save();
    res.json({ message: "Applied successfully", application });
  } catch (err) {
    console.error("❌ Apply error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
