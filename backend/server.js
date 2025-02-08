const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Data = require('./models/data');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT
const mongoURI = process.env.MONGODB_URL;


// Route to handle data from ESP32
app.post('/data', async (req, res) => {
  console.log(req.body); // Log the request body to ensure it's coming through correctly

  try {
    const { sittingDuration, fsrReading } = req.body;  // Expecting Sitting Duration and FSR Reading

    // Validate the data
    if (sittingDuration === undefined || fsrReading === undefined) {
      return res.status(400).json({ message: 'Sitting Duration and FSR Reading are required' });
    }

    // Create a new data record
    const newData = new Data({
      sittingDuration,
      fsrReading,
    });

    // Save the data to the database
    await newData.save();

    // Respond with the newly created data
    res.status(201).json(newData);
  } catch (err) {
    console.error(err);  // Log the error for debugging
    res.status(400).json({ message: err.message });
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

// For authentication of users 
app.use("/api/auth", require("./routes/authRoutes.jsx"));

// Route to fetch all data
app.get('/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



