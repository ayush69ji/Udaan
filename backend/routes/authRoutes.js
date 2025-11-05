import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// =============================
// 📘 REGISTER ROUTE
// =============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("🟦 Register attempt:", { name, email, role });

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("🟥 User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    console.log("🟩 User registered successfully:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// =============================
// 📕 LOGIN ROUTE
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟦 Login attempt:", { email, password });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("🟥 No user found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🟩 User found:", user.email);
    console.log("🔑 Stored hashed password:", user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🧩 Password valid?", isPasswordValid);

    if (!isPasswordValid) {
      console.log("🟥 Invalid password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // JWT creation
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user._doc;

    console.log("✅ Login successful:", user.email);
    res.json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
