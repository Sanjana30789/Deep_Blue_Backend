const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({

  sittingDuration: { type: Number, required: true }, 
  chair_id: { type: mongoose.Schema.Types.String, ref: "Chair", required: true },
  fsr1: { type: Number, required: true }, 
  fsr2: { type: Number, required: true },  
  fsr3: { type: Number, required: true },
  fsr4: { type: Number, required: true },   
  fsr5: { type: Number, required: true }, 
  fsr6: { type: Number, required: true }, 
  totalsittingduration : {type :Number,required : true},
  timestamp: { type: Date, default: Date.now }, 
  weight : {type:Number},



  history: [
    {
        sittingDuration: Number,
        fsr1: Number,
        fsr2: Number,
        fsr3: Number,
        fsr4: Number,
        fsr5: Number,
        fsr6: Number,
        totalsittingduration: Number,
        weight: Number,
        timestamp: { type: Date, default: Date.now }
    }
]
});

module.exports = mongoose.model('Data', dataSchema);
