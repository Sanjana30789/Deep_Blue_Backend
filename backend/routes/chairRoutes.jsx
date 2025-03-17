const express = require("express");
const Chair = require('../models/chairs'); // import the Chair model
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/register-chair', async (req, res) => {
    const { chair_id, user_id, relaxation_time, sitting_threshold, continuous_vibration } = req.body;

    // Check if required fields are present
    if (!chair_id || !user_id) {
        return res.status(400).json({ msg: "Chair ID and User ID are required" });
    }

    try {
        console.log("🔹 Incoming Request Body:", req.body);

        // Check if the chair is already registered
        const existingChair = await Chair.findOne({ chair_id });
        if (existingChair) {
            console.log("⚠️ Chair already registered:", existingChair);
            return res.status(400).json({ msg: "Chair already registered" });
        }

        // Check if the user exists
        const userExists = await User.findById(user_id);
        if (!userExists) {
            console.log("❌ User not found for ID:", user_id);
            return res.status(404).json({ msg: "User not found" });
        }

        // Create and save new chair entry
        const newChair = new Chair({
            chair_id,
            user_id,
            relaxation_time,
            sitting_threshold,
            continuous_vibration,
            
        });

        await newChair.save();
        console.log("✅ New Chair Registered:", newChair);

        // Update the user document to reflect chair registration
        const updatedUser = await User.findByIdAndUpdate(
            user_id,
            { chair_id, isChairRegistered: true }, // Adding `isChairRegistered`
            { new: true } // Returns the updated user document
        );

        console.log("🔄 Updated User Data:", updatedUser);

        res.status(201).json({
            msg: "Chair registered successfully",
            chair: newChair,
            user: updatedUser
        });

    } catch (err) {
        console.error("🚨 Error registering chair:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

// FOR GETTING THE CHAIR DATA FROM CHAIR ID
router.get('/chair-data/:chair_id', async (req, res) => {
    try {
        const chairId = String(req.params.chair_id).trim();  // Convert to string & remove spaces
        console.log("Received chair_id:", chairId, "Type:", typeof chairId);

        const chairData = await Chair.findOne({ chair_id: chairId });

        console.log("Database response:", chairData);

        if (!chairData) {
            return res.status(404).json({ msg: "No chair data found" });
        }

        res.json(chairData);
    } catch (err) {
        console.error("Error fetching chair data by chair_id:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// FOR UPDATING THE CHAIR DETAILS 
router.put("/chair-settings/:chair_id", async (req, res) => {
    try {
        const { chair_id } = req.params;
        const { sitting_threshold, relaxation_time } = req.body;

        const updatedChair = await Chair.findOneAndUpdate(
            { chair_id },
            { sitting_threshold, relaxation_time },
            { new: true } // Return updated document
        );

        if (!updatedChair) {
            return res.status(404).json({ message: "Chair not found" });
        }

        res.json(updatedChair);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});





  module.exports = router;