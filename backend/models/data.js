const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  sittingDuration: { type: Number, required: true },  
  fsrReading: { type: Number, required: true },        
  timestamp: { type: Date, default: Date.now },        
});

module.exports = mongoose.model('Data', dataSchema);
