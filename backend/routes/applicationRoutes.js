import express from "express";
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("Application routes working!");
});

export default router; // ✅ This line is important!
