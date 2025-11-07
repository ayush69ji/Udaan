import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "recruiter", "admin"],
    required: true,
  },
  profile: {
    resume: { type: String }, // URL or filename
    cgpa: { type: Number },
    branch: { type: String },
    skills: [{ type: String }],
    phone: { type: String },
    college: { type: String },
  },
});

export default mongoose.model("User", userSchema);
