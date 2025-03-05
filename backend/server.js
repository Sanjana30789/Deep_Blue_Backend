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
      relaxation_time, sitting_threhold, continous_vibration, measureweight
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
app.put('/data/:chair_id', async (req, res) => {
  try {
      const existingData = await Data.findOne({ chair_id: req.params.chair_id });
      if (!existingData) {
          return res.status(404).json({ message: "Data not found" });
      }

     //push old data to history array
      existingData.history.push({
          sittingDuration: existingData.sittingDuration,
          fsr1: existingData.fsr1,
          fsr2: existingData.fsr2,
          fsr3: existingData.fsr3,
          fsr4: existingData.fsr4,
          totalsittingduration: existingData.totalsittingduration,
          relaxation_time: existingData.relaxation_time,
          sitting_threshold: existingData.sitting_threshold,
          continous_vibration: existingData.continous_vibration,
          measureweight: existingData.measureweight,
          timestamp: existingData.timestamp
      });

      // new data updated
      existingData.sittingDuration = req.body.sittingDuration;
      existingData.fsr1 = req.body.fsr1;
      existingData.fsr2 = req.body.fsr2;
      existingData.fsr3 = req.body.fsr3;
      existingData.fsr4 = req.body.fsr4;
      existingData.totalsittingduration = req.body.totalsittingduration;
      existingData.relaxation_time = req.body.relaxation_time;
      existingData.sitting_threshold = req.body.sitting_threshold;
      existingData.continous_vibration = req.body.continous_vibration;
      existingData.measureweight = req.body.measureweight;
      existingData.timestamp = new Date();

      
      await existingData.save();
      res.json({ message: "Data updated successfully", updatedData: existingData });

  } catch (err) {
      res.status(500).json({ message: err.message });
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


app.get("/user", async (req, res) => {
  try {
      // console.log("Request User Object:", req.user); // Debugging log

      // if (!req.user) {
      //     return res.status(401).json({ msg: "Unauthorized, no user token" });
      // }

      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ msg: "User not found" });

      console.log("User Data Sent:", user); // Debugging log
      res.json(user);
  } catch (err) {
      console.error("Server Error:", err.message);
      res.status(500).send("Server Error");
  }
});





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





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
