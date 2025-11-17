import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  skillsRequired: [{ type: String }],
  eligibility: { type: String, default: "Any branch" },
  lastDate: { type: String, default: "2024-12-31" },
  status: { type: String, default: "active" }, // active / closed
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
