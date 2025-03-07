const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({

  sittingDuration: { type: Number, required: true }, 
  chair_id: { type: mongoose.Schema.Types.String, ref: "Chair", required: true },
  fsr1: { type: Number, required: true }, 
  fsr2: { type: Number, required: true },  
  fsr3: { type: Number, required: true },
  fsr4: { type: Number, required: true },   
  totalsittingduration : {type :Number,required : true},
  timestamp: { type: Date, default: Date.now }, 
  measureweight : {type:Boolean ,required:true},
  weight : {type:Number},



//   history: [
//     {
//         sittingDuration: Number,
//         fsr1: Number,
//         fsr2: Number,
//         fsr3: Number,
//         fsr4: Number,
//         totalsittingduration: Number,
//         // relaxation_time: Number,
//         // sitting_threshold: Number,
//         // continous_vibration: Boolean,
//         measureweight: Boolean,
//         weight: Number,
//         timestamp: { type: Date, default: Date.now }
//     }
// ]
});

module.exports = mongoose.model('Data', dataSchema);
