const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

router.post("/signup", async (req, res) => {
  try {
    const { name, specialization, email, password } = req.body;
    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      name,
      specialization,
      email,
      password: hashedPassword,
    });
    res.json({
      message: "Signup successful",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        email: doctor.email,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { doctorId: doctor._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,      
      secure: false,           
      sameSite: "strict",      
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({
      message: "Login successful",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        email: doctor.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false
    });
    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
