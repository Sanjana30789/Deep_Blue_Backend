const express = require("express");
const Chair = require('../models/chairs'); // import the Chair model
const router = express.Router();
const User = require("../models/User");

// register a new chair 

// router.post('/register-chair', async (req, res) => {
//     const { chair_id, relaxation_time, sitting_threshold, continuous_vibration } = req.body;
  
//     try {
//       const newChair = new Chair({
//         chair_id,
//         relaxation_time,
//         sitting_threshold,
//         continuous_vibration,
//       });
  
//       await newChair.save(); // Save chair data to the database
//       res.status(200).json({ message: 'Chair registered successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error registering chair', error });
//     }
//   });


router.post('/register-chair', async (req, res) => {
    const { chair_id, user_id ,relaxation_time, sitting_threshold, continuous_vibration} = req.body;

    // Check if required fields are present
    if (!chair_id || !user_id) {
        return res.status(400).json({ msg: "Chair ID and User ID are required" });
    }

    try {
        console.log("Incoming Request Body:", req.body);

        // Check if the chair already exists
        const existingChair = await Chair.findOne({ chair_id });
        if (existingChair) {
            console.log("Chair already registered:", existingChair);
            return res.status(400).json({ msg: "Chair already registered" });
        }

        // Check if the user exists before linking the chair
        const userExists = await User.findById(user_id);
        if (!userExists) {
            console.log("User not found for ID:", user_id);
            return res.status(404).json({ msg: "User not found" });
        }

        // Create and save new chair
        const newChair = new Chair({ chair_id, user_id, relaxation_time, sitting_threshold, continuous_vibration  });
        await newChair.save();
        console.log("New Chair Registered:", newChair);

        // Link the chair to the user
        const updatedUser = await User.findByIdAndUpdate(user_id, { chair_id }, { new: true });
        console.log("Updated User:", updatedUser);

        res.status(201).json({ msg: "Chair registered successfully", chair: newChair });

    } catch (err) {
        console.error("Error registering chair:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});



  // get the chair data
//   router.get('/chair-data/:user_id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.user_id);
//         if (!user) return res.status(404).json({ msg: "User not found" });

//         if (!user.chair_id) return res.status(400).json({ msg: "No chair linked to this user" });

//         const chairData = await Chair.findOne({ chair_id: user.chair_id });
//         if (!chairData) return res.status(404).json({ msg: "No chair data found" });

//         res.json(chairData);
//     } catch (err) {
//         console.error("Error fetching chair data:", err);
//         res.status(500).json({ msg: "Server error" });
//     }
// });


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



// router.post('/add-data', async (req, res) => {
//     try {
//         const { sittingDuration, fsr1, fsr2, fsr3, fsr4, totalsittingduration, measureweight } = req.body;

//         // Find the user and get their chair_id
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ msg: "User not found" });

//         const chair_id = user.chair_id; // Get chair_id from the user

//         // Create a new data entry
//         const newData = new Data({
//             chair_id,
//             sittingDuration,
//             fsr1,
//             fsr2,
//             fsr3,
//             fsr4,
//             totalsittingduration,
//             measureweight
//         });

//         await newData.save();
//         res.status(201).json({ msg: "Data added successfully", data: newData });

//     } catch (err) {
//         console.error("Error adding data:", err);
//         res.status(500).json({ msg: "Server error" });
//     }
// });

  module.exports = router;