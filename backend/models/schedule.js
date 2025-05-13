
const mongoose = require("mongoose");
const scheduleSchema = new mongoose.Schema({
    action: {
      type: String,
      required: true,
      match: /^led\/\d+$|^fan\/\d+$/, 
    },
    time: String,
    deviceId: {type: String, required: true},
    done: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });
  
scheduleSchema.index({ time: 1, done: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);
