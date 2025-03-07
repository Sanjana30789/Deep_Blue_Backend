const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("../models/User.js");

require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
const cloudinary = require("../cloud.js");
const multer = require("multer");
const { upload } = require("../multiconfig.js")



// router.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//       // Check if the user already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//           return res.status(400).json({ msg: "User already exists" });
//       }

//       // Hash the password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       // Create new user (MongoDB will generate _id automatically)
//       const newUser = new User({ name, email, password: hashedPassword });
//       await newUser.save();

//       // Return the generated user ID in the response
//       res.status(201).json({ 
//           msg: "User registered successfully", 
//           user_id: newUser._id 
//       });

//   } catch (err) {
//       console.error("Error registering user:", err);
//       res.status(500).json({ msg: "Server error" });
//   }
// });


router.post("/signup", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password, chair_id } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get Cloudinary image URL
    const profilePic = req.file ? req.file.path : ""; // Cloudinary returns a URL in req.file.path

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      chair_id,
      profilePic,
    });

    await newUser.save();
    res.status(201).json({ msg: "User created successfully", user_id: newUser._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});




// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.status(400).json({ msg: "User not found" });
//       }
  
//       // Check password
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ msg: "Invalid credentials" });
//       }
  
//       // Check if chair is registered (Assuming there is a field 'isChairRegistered' in the user schema)
//       const isChairRegistered = user.isChairRegistered || false;
  
//       // Generate JWT token
//       const token = jwt.sign({ user_id: user._id }, "your_secret_key", { expiresIn: "1h" });
  
//       // Send response with user_id and chair registration status
//       res.status(200).json({
//         msg: "Login successful",
//         user_id: user._id,
//         token,
//         isChairRegistered,  // Include chair registration status
//       });
  
//     } catch (err) {
//       console.error("Error logging in:", err);
//       res.status(500).json({ msg: "Server error" });
//     }
//   });


// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     // Compare hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     // Generate JWT Token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     // Send Response
//     res.status(200).json({
//       user_id: user._id,
//       token,
//       profilePic: user.profilePic || "default.jpg",
//     });

//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Send Response
    res.status(200).json({
      user_id: user._id,
      token,
      profilePic: user.profilePic || "default.jpg",
      isChairRegistered: user.isChairRegistered || false, // Return chair registration status
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



module.exports = router;
