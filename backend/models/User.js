import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "recruiter", "admin"] },

  profile: {
    resume: String,
    cgpa: Number,
    branch: String,
    year: Number,
    skills: [String],
    phone: String,
    college: { type: String, default: "IET DAVV" }
  },

  notifications: [
    {
      message: String,
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("User", userSchema);
