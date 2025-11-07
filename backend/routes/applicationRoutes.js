import express from "express";
import Application from "../models/Application.js";

const router = express.Router();


// ✅ Apply for a Job
router.post("/apply", async (req, res) => {
  try {
    const { jobId, studentId } = req.body;

    // check if already applied
    const existingApp = await Application.findOne({ jobId, studentId });
    if (existingApp) {
      return res.status(400).json({ message: "You already applied for this job" });
    }

    const newApp = new Application({ jobId, studentId });
    await newApp.save();

    res.status(201).json({ message: "Application submitted successfully!", application: newApp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ Get all applications by a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.params.studentId })
      .populate("jobId")
      .sort({ createdAt: -1 });

    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error: error.message });
  }
});


// ✅ Get all applications for a job (for admin/company view)
router.get("/job/:jobId", async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job applications", error: error.message });
  }
});


// ✅ Withdraw application
router.delete("/:applicationId", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.applicationId);
    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error withdrawing application", error: error.message });
  }
});

export default router;
