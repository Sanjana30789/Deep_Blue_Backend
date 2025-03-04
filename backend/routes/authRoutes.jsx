const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

const router = express.Router();

//   try {
//     const { name, email, password } = req.body;
//     const existingUser = await User.findOne({ email });

//     if (existingUser) return res.status(400).json({ msg: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save profile photo URL
//     const profilePhoto = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";

//     const newUser = new User({ name, email, password: hashedPassword, profilePhoto });
//     await newUser.save();

//     res.status(201).json({ msg: "User registered successfully", profilePhoto });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// Login Route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({ 
//       token, 
//       user: { id: user._id, name: user.name, email: user.email, profilePhoto: user.profilePhoto } 
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingUser = await User.findOne({ email });

//     if (existingUser) return res.status(400).json({ msg: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ msg: "User registered successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ msg: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user (MongoDB will generate _id automatically)
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      // Return the generated user ID in the response
      res.status(201).json({ 
          msg: "User registered successfully", 
          user_id: newUser._id 
      });

  } catch (err) {
      console.error("Error registering user:", err);
      res.status(500).json({ msg: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(400).json({ msg: "User not found" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Generate JWT token (optional)
      const token = jwt.sign({ user_id: user._id }, "your_secret_key", { expiresIn: "1h" });

      // Send response with user_id
      res.status(200).json({ 
          msg: "Login successful", 
          user_id: user._id, 
          token 
      });

  } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
