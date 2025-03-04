const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({

  sittingDuration: { type: Number, required: true }, 
  // chair_id : { type: String, required: true },
  fsr1: { type: Number, required: true }, 
  fsr2: { type: Number, required: true },  
  fsr3: { type: Number, required: true },
  fsr4: { type: Number, required: true },   
  totalsittingduration : {type :Number,required : true},
  // relaxation_time : { type: Number, required: true },
  // sitting_threhold : { type: Number, required: true },
  // continous_vibration : {type :Boolean,required :true},
  timestamp: { type: Date, default: Date.now }, 
  measureweight : {type:Boolean ,required:true},


  history: [
    {
        sittingDuration: Number,
        fsr1: Number,
        fsr2: Number,
        fsr3: Number,
        fsr4: Number,
        totalsittingduration: Number,
        // relaxation_time: Number,
        // sitting_threshold: Number,
        // continous_vibration: Boolean,
        measureweight: Boolean,
        timestamp: { type: Date, default: Date.now }
    }
]
});

module.exports = mongoose.model('Data', dataSchema);
