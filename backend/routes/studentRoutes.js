import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get student dashboard data
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const student = await User.findById(req.userId).select("-password");
    if (!student) return res.status(404).json({ error: "Student not found" });

    const jobs = await Job.find({ status: "active" });
    const applications = await Application.find({ studentId: req.userId });
    const shortlisted = applications.filter(app => app.status === "shortlisted").length;

    res.json({
      student,
      courses: jobs,
      stats: {
        totalJobs: jobs.length,
        applied: applications.length,
        shortlisted
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { profile } = req.body;
    const student = await User.findByIdAndUpdate(
      req.userId,
      { 
        name: profile.name,
        "profile.branch": profile.branch,
        "profile.year": profile.year,
        "profile.resume": profile.resume
      },
      { new: true }
    ).select("-password");

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for a job
router.post("/apply/:jobId", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.userId;

    const alreadyApplied = await Application.findOne({ jobId, studentId });
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    await Application.create({ jobId, studentId, status: "applied" });

    // Add notification
    await User.findByIdAndUpdate(studentId, {
      $push: {
        notifications: { 
          message: "Your application has been submitted!",
          read: false
        }
      }
    });

    res.json({ message: "Applied successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's applications
router.get("/my-applications", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.userId })
      .populate("jobId");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notifications
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const student = await User.findById(req.userId).select("notifications");
    res.json(student.notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.put("/notifications/:notificationId", authMiddleware, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.userId, "notifications._id": req.params.notificationId },
      { $set: { "notifications.$.read": true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
