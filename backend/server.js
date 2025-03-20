const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Data = require('./models/data');
const User = require('./models/User');
require('dotenv').config();
const cors = require('cors');

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloud.js");
const multer = require("multer");
const { upload } = require("./multiconfig")


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URL;

// post all data 
app.post('/data', async (req, res) => {
  console.log("Raw Request Body:", req.body);
  try {
    const {
      sittingDuration, fsr1, fsr2, fsr3, fsr4,fsr5,fsr6, totalsittingduration,
      relaxation_time, sitting_threhold, continous_vibration, measureweight
    } = req.body;

    // console.log("Extracted Values - Chair ID:", chair_id);

    const newData = new Data({
      sittingDuration,
      fsr1, fsr2, fsr3, fsr4,fsr5,fsr6,
      totalsittingduration,
      relaxation_time,
      sitting_threhold,
      // chair_id: String(chair_id), 
      continous_vibration: Boolean(continous_vibration),
      measureweight: Boolean(measureweight)
    });

    console.log("Final Object Before Saving:", newData);

    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    console.error("Database Save Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// Put Method for updating data and storing the previous data in history 
// app.put('/data/:chair_id', async (req, res) => {
//   try {
//     // const chairId = req.params.chair_id.trim();
//     const existingData = await Data.findOne({ chair_id: req.params.chair_id.trim() });

//     if (!existingData) {
//       return res.status(404).json({ message: "Data not found" });
//     }

//     // ✅ Ensure history array exists before using .push()
//     if (!Array.isArray(existingData.history)) {
//       existingData.history = [];
//     }

//     // ✅ Push old data to history array
//     existingData.history.push({
//       sittingDuration: existingData.sittingDuration,
//       fsr1: existingData.fsr1,
//       fsr2: existingData.fsr2,
//       fsr3: existingData.fsr3,
//       fsr4: existingData.fsr4,
//       fsr5: existingData.fsr5,
//       fsr6: existingData.fsr6,
//       totalsittingduration: existingData.totalsittingduration,
//       relaxation_time: existingData.relaxation_time,
//       sitting_threshold: existingData.sitting_threshold,
//       continous_vibration: existingData.continous_vibration,
//       measureweight: existingData.measureweight,
//       timestamp: existingData.timestamp,
//       weight : existingData.weight,
//     });

//     // ✅ Update with new data
//     Object.assign(existingData, req.body, { timestamp: new Date() });

//     await existingData.save();
//     res.json({ message: "Data updated successfully", updatedData: existingData });

//   } catch (err) {
//     console.error("Error updating data:", err);
//     res.status(500).json({ message: err.message });
//   }
// });


// app.put('/data/:chair_id', async (req, res) => {
//   try {
//     console.log("Received data:", req.body); // Check what is coming in the request

//     const existingData = await Data.findOne({ chair_id: req.params.chair_id.trim() });

//     if (!existingData) {
//       return res.status(404).json({ message: "Data not found" });
//     }

//     if (!Array.isArray(existingData.history)) {
//       existingData.history = [];
//     }

//     existingData.history.push({
//       sittingDuration: existingData.sittingDuration,
//       fsr1: existingData.fsr1,
//       fsr2: existingData.fsr2,
//       fsr3: existingData.fsr3,
//       fsr4: existingData.fsr4,
//       fsr5: existingData.fsr5,
//       fsr6: existingData.fsr6,
//       totalsittingduration: existingData.totalsittingduration,
//       timestamp: existingData.timestamp,
//       weight: existingData.weight,
//     });

//     // ✅ Log before updating
//     console.log("Before update:", existingData);

//     Object.assign(existingData, req.body, { timestamp: new Date() });

//     await existingData.save();

//     // ✅ Log after update
//     console.log("After update:", existingData);

//     res.json({ message: "Data updated successfully", updatedData: existingData });

//   } catch (err) {
//     console.error("Error updating data:", err);
//     res.status(500).json({ message: err.message });
//   }
// });


// app.put('/data/:chair_id', async (req, res) => {
//   try {
//     console.log("Received data:", req.body); // Debug request body

//     const existingData = await Data.findOne({ chair_id: req.params.chair_id.trim() });

//     if (!existingData) {
//       return res.status(404).json({ message: "Data not found" });
//     }

//     if (!Array.isArray(existingData.history)) {
//       existingData.history = [];
//     }

//     existingData.history.push({
//       sittingDuration: existingData.sittingDuration,
//       fsr1: existingData.fsr1,
//       fsr2: existingData.fsr2,
//       fsr3: existingData.fsr3,
//       fsr4: existingData.fsr4,
//       totalsittingduration: existingData.totalsittingduration,
//       timestamp: existingData.timestamp,
//       weight: existingData.weight,
//     });

    
//     Object.assign(existingData, {
//       fsr1: req.body.fsr1 ?? existingData.fsr1,
//       fsr2: req.body.fsr2 ?? existingData.fsr2,
//       fsr3: req.body.fsr3 ?? existingData.fsr3,
//       fsr4: req.body.fsr4 ?? existingData.fsr4,
//       totalsittingduration: req.body.totalsittingduration ?? existingData.totalsittingduration,
//       weight: req.body.weight ?? existingData.weight,
//       // Ensuring fsr6 updates
//       timestamp: new Date()
//     });

//     console.log("Before saving:", existingData); // Debug before saving

//     await existingData.save();

//     console.log("Updated document in DB:", await Data.findOne({ chair_id: req.params.chair_id.trim() }));

//     res.json({ message: "Data updated successfully", updatedData: existingData });

//   } catch (err) {
//     console.error("Error updating data:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

app.put('/data/:chair_id', async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { chair_id } = req.params;
    if (!chair_id) return res.status(400).json({ message: "Chair ID is required" });

    // Find the existing document
    const existingData = await Data.findOne({ chair_id: chair_id.trim() });
    if (!existingData) return res.status(404).json({ message: "Data not found" });

    // Append the current data to history before updating
    if (!Array.isArray(existingData.history)) {
      existingData.history = [];
    }
    existingData.history.push({
      sittingDuration: existingData.sittingDuration,
      fsr1: existingData.fsr1,
      fsr2: existingData.fsr2,
      fsr3: existingData.fsr3,
      fsr4: existingData.fsr4,
      totalsittingduration: existingData.totalsittingduration,
      weight: existingData.weight,
      timestamp: existingData.timestamp,
    });

    // **Use findOneAndUpdate for atomic update**
    const updatedData = await Data.findOneAndUpdate(
      { chair_id: chair_id.trim() }, // Find condition
      {
        $set: {
          sittingDuration: req.body.sittingDuration ?? existingData.sittingDuration,  // ✅ Added sittingDuration
          fsr1: req.body.fsr1 ?? existingData.fsr1,
          fsr2: req.body.fsr2 ?? existingData.fsr2,
          fsr3: req.body.fsr3 ?? existingData.fsr3,
          fsr4: req.body.fsr4 ?? existingData.fsr4,
          totalsittingduration: req.body.totalsittingduration ?? existingData.totalsittingduration,
          weight: req.body.weight ?? existingData.weight,
          timestamp: new Date(),
        },
        $push: { history: existingData.history[existingData.history.length - 1] } // Add to history array
      },
      { new: true } // Return updated document
    );

    console.log("Updated document in DB:", updatedData);

    res.json({ message: "Data updated successfully", updatedData });

  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});






// app.put('/data/:chair_id', async (req, res) => {
//   try {
//     console.log("Received PUT request:", req.body); // Log incoming data

//     const existingData = await Data.findOne({ chair_id: req.params.chair_id.trim() });

//     if (!existingData) {
//       return res.status(404).json({ message: "Data not found" });
//     }

//     console.log("Before update:", existingData); // Log existing document

//     // Check if the incoming request has fsr5 and fsr6
//     if (req.body.fsr5 === undefined || req.body.fsr6 === undefined) {
//       return res.status(400).json({ message: "fsr5 and fsr6 are missing in the request body" });
//     }

//     // Update fields individually
//     existingData.fsr5 = req.body.fsr5;
//     existingData.fsr6 = req.body.fsr6;

//     // Save the updated document
//     await existingData.save();

//     console.log("After update:", existingData); // Log after updating

//     res.json({ message: "Data updated successfully", updatedData: existingData });

//   } catch (err) {
//     console.error("Error updating data:", err);
//     res.status(500).json({ message: err.message });
//   }
// });







// app.post('/data', async (req, res) => {
//   console.log("Received Data:", req.body);  

//   try {
//     const { sittingDuration, fsr1, fsr2, fsr3, fsr4, totalsittingduration, relaxation_time, sitting_threhold, continous_vibration, measureweight } = req.body;
    
//     if (!sittingDuration || !fsr1 || !fsr2 || !fsr3 || !fsr4 || !totalsittingduration || !relaxation_time || !sitting_threhold || continous_vibration === undefined || measureweight === undefined) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const newData = new Data({
//       sittingDuration,
//       fsr1,
//       fsr2,
//       fsr3,
//       fsr4,
//       totalsittingduration,
//       relaxation_time,
//       sitting_threhold,
//       continous_vibration,
//       measureweight
//     });

//     await newData.save();
//     res.status(201).json(newData);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }
// });

app.post("/user/upload-profile", upload.single("profileImage"), async (req, res) => {
  try {
    const imageUrl = req.file.path; // Cloudinary URL

    // Update user profile in database (Assuming you have authentication)
    const user = await User.findByIdAndUpdate(req.user.id, { profileImage: imageUrl }, { new: true });

    res.json({ success: true, imageUrl, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Upload failed", error });
  }
});

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((err) => {
  console.log("Error connecting to MongoDB Atlas:", err);
});

// Authentication route
app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/chair",require("./routes/chairRoutes.jsx"))

// all data
app.get('/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// app.get("/user", async (req, res) => {
//   try {
//     const users = await User.find(); 
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });




// app.get('/data/:chair_id', async (req, res) => {
//   console.log("Received Request for Chair ID:", req.params.chair_id);  

//   try {
//       const data = await Data.findOne({ chair_id: req.params.chair_id }); 
//       console.log("MongoDB Response:", data);  

//       if (!data) {
//           return res.status(404).json({ message: "Data not found" });
//       }
//       res.json(data);  
//   } catch (err) {
//       console.error("Error Fetching Data:", err);
//       res.status(400).json({ message: err.message});
//   }
// });


app.get('/data/:chair_id', async (req, res) => {
  try {
    
      const data = await Data.find({ chair_id: req.params.chair_id.trim() });

      if (!data || data.length === 0) {
          return res.status(404).json({ message: "No sensor data found" });
      }

      res.json(data);
  } catch (err) {
      console.error("Error Fetching Data:", err);
      res.status(500).json({ message: "Server error" });
  }
});



app.post('/data/:chair_id', async (req, res) => {
  console.log("Received Data for Chair ID:", req.params.chair_id, "with Body:", req.body);

  try {
      const newData = new Data({
          chair_id: req.params.chair_id.trim(),  // Assign chair_id from URL parameter
          ...req.body  // Spread the rest of the request body into the new object
      });

      const savedData = await newData.save(); // Save to MongoDB

      console.log("Data Saved:", savedData);

      res.status(201).json(savedData);  // Respond with the saved data
  } catch (err) {
      console.error("Error Saving Data:", err);
      res.status(500).json({ message: "Server error while saving data" });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});