import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// Get all jobs + search
router.get("/", async (req, res) => {
  const { search } = req.query;

  let query = {};
  if (search) {
    query = { title: { $regex: search, $options: "i" } };
  }

  const jobs = await Job.find(query);
  res.json(jobs);
});

// Total opportunities count
router.get("/count", async (req, res) => {
  const count = await Job.countDocuments();
  res.json({ totalJobs: count });
});

export default router;
