const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  registered_at: { type: Date, default: Date.now },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  value: [
    {
      value: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Sensor", SensorSchema);
