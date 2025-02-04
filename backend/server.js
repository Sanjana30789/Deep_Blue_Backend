const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Data = require('./models/data');
require('dotenv').config();

const app = express();
const port = process.env.PORT


app.use(bodyParser.json());


const mongoURI = process.env.MONGODB_URL;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((err) => {
  console.log("Error connecting to MongoDB Atlas:", err);
});

// Route to handle data from ESP32
app.post('/data', async (req, res) => {
  try {
    const { sittingDuration, fsrReading } = req.body;  // Expecting Sitting Duration and FSR Reading

    // Validate the data
    if (sittingDuration === undefined || fsrReading === undefined) {
      return res.status(400).json({ message: 'Sitting Duration and FSR Reading are required' });
    }

    const newData = new Data({
      sittingDuration,
      fsrReading,
    });

    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

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



// // server.js (or wherever you define your routes)

// const express = require('express');
// const app = express();

// // Simulate dummy data
// const dummyData = [
//   { 
//     _id: '1', 
//     sittingDuration: 30, // In minutes
//     fsrReading: 0.6, // Some dummy FSR reading
//     timestamp: new Date().toISOString(),
//   },
//   { 
//     _id: '2', 
//     sittingDuration: 45, 
//     fsrReading: 0.8, 
//     timestamp: new Date().toISOString(),
//   },
//   { 
//     _id: '3', 
//     sittingDuration: 60, 
//     fsrReading: 0.9, 
//     timestamp: new Date().toISOString(),
//   },
// ];

// // Endpoint to send dummy data
// app.get('/data', (req, res) => {
//   res.json(dummyData);
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
