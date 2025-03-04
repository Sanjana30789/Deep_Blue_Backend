const mongoose = require('mongoose');

const chairSchema = new mongoose.Schema({
  chair_id: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ensures a valid user is linked
  relaxation_time: { type: Number, default: 0 }, // Default value 0 if not provided
  sitting_threshold: { type: Number, default: 30 }, // Default threshold (adjust as needed)
  continuous_vibration: { type: Boolean, default: false }, // Default to false
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const Chair = mongoose.model('Chair', chairSchema);

module.exports = Chair;
