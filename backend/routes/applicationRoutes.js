import express from "express";
import Application from "../models/Application.js";
import User from "../models/User.js";

const router = express.Router();

// Apply for a job
router.post("/apply", async (req, res) => {
  const { jobId, studentId } = req.body;

  const already = await Application.findOne({ jobId, studentId });
  if (already) return res.json({ message: "Already applied" });

  await Application.create({ jobId, studentId });

  // Push notification
  await User.findByIdAndUpdate(studentId, {
    $push: {
      notifications: { message: "Your application has been submitted!" }
    }
  });

  res.json({ message: "Applied successfully" });
});

// Get shortlisted jobs
router.get("/my/:studentId", async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.params.studentId })
      .populate("jobId");
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
