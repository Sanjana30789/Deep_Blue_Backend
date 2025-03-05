const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Data = require('./models/data');
const User = require('./models/User');
require('dotenv').config();
const cors = require('cors');
const Chair = require('./models/chairs')


const app = express();
app.use(bodyParser.json());
app.use(cors());

const auth = require("./middleware/authMiddleware");

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URL;

// post all data 
app.post('/data', async (req, res) => {
  console.log("Raw Request Body:", req.body);
  // console.log("Extracted Chair ID:", req.body.chair_id);
  // console.log("Type of Chair ID:", typeof req.body.chair_id);

  // if (!req.body.chair_id) {
  //   return res.status(400).json({ error: "chair_id is missing in request" });
  // }

  try {
    const {
      sittingDuration, fsr1, fsr2, fsr3, fsr4, totalsittingduration,
      relaxation_time, sitting_threhold, continous_vibration, measureweight,weight
    } = req.body;

    // console.log("Extracted Values - Chair ID:", chair_id);

    const newData = new Data({
      sittingDuration,
      fsr1, fsr2, fsr3, fsr4,
      totalsittingduration,
      relaxation_time,
      sitting_threhold,
      // chair_id: String(chair_id), 
      continous_vibration: Boolean(continous_vibration),
      measureweight: Boolean(measureweight),
      weight
    });

    console.log("Final Object Before Saving:", newData);

    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    console.error("Database Save Error:", err);
    res.status(400).json({ message: err.message });
  }
});


app.post("/data/:chair_id", async (req, res) => {
  console.log("Received Data for Chair ID:", req.params.chair_id, "with Body:", req.body);

  try {
      const { chair_id } = req.params;

      // Check if the chair exists
      const chairExists = await Chair.findOne({ chair_id });
      if (!chairExists) {
          return res.status(404).json({ message: "Chair not found" });
      }

      // Create and Save Data
      const newData = new Data({
          chair_id,  // Assign chair_id from URL parameter
          ...req.body  // Spread the request body into the new object
      });

      const savedData = await newData.save(); // Save to MongoDB
      console.log("Data Saved:", savedData);

      res.status(201).json(savedData);  // Respond with the saved data
  } catch (err) {
      console.error("Error Saving Data:", err);
      res.status(500).json({ message: "Server error while saving data" });
  }
});


app.get("/data/:chair_id", async (req, res) => {
  try {
      const { chair_id } = req.params;

      // Check if the chair exists
      const chairExists = await Chair.findOne({ chair_id });
      if (!chairExists) {
          return res.status(404).json({ message: "Chair not found" });
      }

      // Fetch all data for the given chair_id
      const chairData = await Data.find({ chair_id });

      res.status(200).json({ data: chairData });
  } catch (error) {
      console.error("Error Fetching Data:", error);
      res.status(500).json({ message: "Server error while fetching data" });
  }
});


// Put Method for updating data and storing the previous data in history 
app.put("/data/:chair_id", async (req, res) => {
  console.log("Updating Data for Chair ID:", req.params.chair_id, "with Body:", req.body);

  try {
      const { chair_id } = req.params;

      // Check if the chair exists
      const chairExists = await Chair.findOne({ chair_id });
      if (!chairExists) {
          return res.status(404).json({ message: "Chair not found" });
      }

      // Update the data
      const updatedData = await Data.findOneAndUpdate(
          { chair_id },  // Find data by chair_id
          { $set: req.body },  // Update with new data
          { new: true, runValidators: true } // Return updated document
      );

      if (!updatedData) {
          return res.status(404).json({ message: "No data found to update" });
      }

      console.log("Data Updated:", updatedData);
      res.status(200).json(updatedData);
  } catch (err) {
      console.error("Error Updating Data:", err);
      res.status(500).json({ message: "Server error while updating data" });
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
app.use("/api/auth", require("./routes/authRoutes.jsx"));
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


// router.get("/user", async (req, res) => {
//   try {
//       const token = req.headers.authorization?.split(" ")[1]; // Extract token
//       if (!token) return res.status(401).json({ message: "Unauthorized" });

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.userId).select("-password"); // Exclude password

//       if (!user) return res.status(404).json({ message: "User not found" });

//       res.json(user); // ✅ Send user data including chair_id
//   } catch (error) {
//       console.error("Error fetching user:", error);
//       res.status(500).json({ message: "Server error" });
//   }
// });



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
